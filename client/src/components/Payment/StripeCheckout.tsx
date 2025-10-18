import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface StripeCheckoutProps {
  amount: number;
  currency: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  amount,
  currency,
  onSuccess,
  onError,
  disabled = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  // Show configuration message if Stripe is not available
  if (!stripe) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiCreditCard className="text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600">Payment System</h3>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            💡 <strong>Payment system is being configured.</strong><br />
            For now, you can use other payment methods or contact support to complete your order.
          </p>
          <div className="mt-3 text-xs text-yellow-600">
            <p>• All major credit cards will be supported</p>
            <p>• Secure processing via Stripe</p>
            <p>• International transactions enabled</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Payment system is not available. Please check your configuration.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found.');
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent on server
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase()
        })
      });

      const { client_secret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // You can get this from user profile
          }
        }
      });

      if (result.error) {
        onError(result.error.message || 'Payment failed');
        toast.error('Payment failed. Please try again.');
      } else {
        onSuccess(result.paymentIntent);
        toast.success('Payment successful!');
      }
    } catch (error: any) {
      onError(error.message || 'Payment processing failed');
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiCreditCard className="text-blue-600" />
        <h3 className="text-lg font-semibold">Payment Details</h3>
        <FiLock className="text-green-600 ml-auto" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border rounded-lg p-3 bg-gray-50">
            <CardElement options={cardStyle} />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FiLock className="text-green-600" />
              <span>Secured by Stripe</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              {currency} {amount.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              Including all taxes and fees
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing || disabled}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            processing || disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {processing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay ${currency} ${amount.toFixed(2)}`
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span>💳 Visa</span>
          <span>💳 Mastercard</span>
          <span>💳 American Express</span>
          <span>💳 Discover</span>
        </div>
      </form>
    </div>
  );
};
