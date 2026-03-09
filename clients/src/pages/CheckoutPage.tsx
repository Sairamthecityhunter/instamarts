import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { clearCart } from '../store/slices/cartSlice';
import { addOrder } from '../store/slices/ordersSlice';
import { toast } from 'react-hot-toast';
import { TaxCalculator } from '../components/Checkout/TaxCalculator';
import { StripeCheckout } from '../components/Payment/StripeCheckout';
import { TrustBadges } from '../components/Support/TrustBadges';
import { TaxCalculation } from '../utils/taxCalculator';
import { useCurrency } from '../hooks/useCurrency';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'cod';
  name: string;
  icon: string;
  description: string;
}

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, deliveryFee, freeDeliveryThreshold } = useSelector((state: RootState) => state.cart);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { formatPrice, toUSD } = useCurrency();
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to proceed with checkout</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use real user addresses
  const userAddresses = user.addresses || [];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe',
      type: 'card',
      name: 'Credit/Debit Card (USD)',
      icon: '💳',
      description: 'Secure payment via Stripe - Visa, MasterCard, American Express',
    },
    {
      id: '2',
      type: 'upi',
      name: 'UPI (INR)',
      icon: '📱',
      description: 'Pay using UPI apps (India residents only)',
    },
    {
      id: '3',
      type: 'wallet',
      name: 'Digital Wallet',
      icon: '👛',
      description: 'Pay using digital wallets',
    }
  ];

  const finalDeliveryFee = totalAmount > freeDeliveryThreshold ? 0 : deliveryFee;
  const finalTotal = totalAmount + finalDeliveryFee;
  
  // Convert to USD for tax calculation (to match Order Summary display)
  const subtotalUSD = toUSD(totalAmount);

  const handlePlaceOrder = async () => {
    if (userAddresses.length === 0) {
      toast.error('Please add a delivery address first');
      return;
    }
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `ORD${Date.now()}`;
      const selectedAddressData = userAddresses.find(addr => addr.id === selectedAddress);
      const selectedPaymentData = paymentMethods.find(payment => payment.id === selectedPayment);
      
      // Create order object
      const newOrder = {
        id: orderId,
        storeName: 'FreshBazaar',
        storeImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=200',
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image,
        })),
        total: finalTotal,
        status: 'confirmed' as const,
        orderDate: new Date().toISOString(),
        deliveryAddress: selectedAddressData ? 
          `${selectedAddressData.address}, ${selectedAddressData.city} - ${selectedAddressData.pincode}` :
          'Address not found',
        paymentMethod: selectedPaymentData?.name || 'Unknown',
        deliveryInstructions: deliveryInstructions,
      };
      
      // Save order to Redux store (which will also save to localStorage)
      dispatch(addOrder(newOrder));
      
      toast.success('Order placed successfully!');
      dispatch(clearCart());
      navigate(`/track-order/${orderId}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    // Navigate to addresses page to add new address
    navigate('/addresses');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to proceed to checkout!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
              
              {userAddresses.length > 0 ? (
                <div className="space-y-3">
                  {userAddresses.map((address) => (
                    <label key={address.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                        <p className="text-sm text-gray-600">
                          {address.city} - {address.pincode}
                        </p>
                        <p className="text-sm text-gray-600">Phone: {user.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                  <p className="text-gray-600 mb-4">Please add a delivery address to continue</p>
                </div>
              )}
              
              <button 
                onClick={handleAddAddress}
                className="text-green-500 hover:text-green-700 font-medium mt-4 flex items-center"
              >
                + Add New Address
              </button>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Tax Calculator */}
            <TaxCalculator
              subtotal={subtotalUSD}
              productCategories={items.map(item => item.product.category || 'default')}
              onTaxCalculated={setTaxCalculation}
              selectedState={selectedState}
            />

            {/* Delivery Instructions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Instructions</h2>
              <textarea
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Any special instructions for delivery? (Optional)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Stripe Payment */}
            {selectedPayment === 'stripe' && taxCalculation && (
              <StripeCheckout
                amount={taxCalculation.total}
                currency="USD"
                onSuccess={(paymentIntent) => {
                  console.log('Payment successful:', paymentIntent);
                  toast.success('Payment successful!');
                  handlePlaceOrder();
                }}
                onError={(error) => {
                  console.error('Payment failed:', error);
                  toast.error('Payment failed. Please try again.');
                }}
                disabled={!selectedAddress || !selectedPayment || !taxCalculation}
              />
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              {taxCalculation ? (
                <div className="border-t pt-4 space-y-3">
                  <div className="text-center mb-4">
                    <p className="text-sm text-blue-600 font-medium">
                      💰 All taxes and duties calculated below
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between font-bold text-xl text-green-800">
                      <span>Total Amount</span>
                      <span>${taxCalculation.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 mt-1">
                      <span>Approx. INR</span>
                      <span>₹{(taxCalculation.total * 83).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    ✅ Includes all taxes, duties, shipping, and fees
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{finalDeliveryFee === 0 ? 'Free' : formatPrice(finalDeliveryFee)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Subtotal</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                    <div className="text-sm text-orange-600 text-center mt-2">
                      ⚠️ Select state to calculate final total with taxes
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment !== 'stripe' && (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || userAddresses.length === 0 || !selectedAddress || !selectedPayment || !taxCalculation}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? 'Placing Order...' : 
                   userAddresses.length === 0 ? 'Add Address to Continue' :
                   !taxCalculation ? 'Select State for Tax Calculation' :
                   `Place Order • $${taxCalculation.total.toFixed(2)} USD`}
                </button>
              )}

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  🚚 Estimated delivery: 7-15 business days (India to USA)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ✈️ International shipping with customs clearance included
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6">
                <TrustBadges />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 