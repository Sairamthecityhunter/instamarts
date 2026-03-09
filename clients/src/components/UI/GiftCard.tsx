import React, { useState } from 'react';
import { FiGift, FiMail, FiDollarSign } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store/store';
import { toast } from 'react-hot-toast';
import CurrencyConverter from '../International/CurrencyConverter';

interface GiftCardProps {
  onPurchase?: (amount: number, recipientEmail: string, message: string) => void;
}

const GiftCard: React.FC<GiftCardProps> = ({ onPurchase }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [amount, setAmount] = useState(500);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const presetAmounts = [500, 1000, 2000, 5000];

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase gift cards');
      return;
    }

    if (!recipientEmail || !recipientEmail.includes('@')) {
      toast.error('Please enter a valid recipient email');
      return;
    }

    const finalAmount = customAmount ? Number(customAmount) : amount;

    if (finalAmount < 100) {
      toast.error('Minimum gift card amount is ₹100');
      return;
    }

    if (onPurchase) {
      onPurchase(finalAmount, recipientEmail, message);
    } else {
      // Add to cart as a product
      dispatch(addToCart({
        product: {
          id: `gift-card-${Date.now()}`,
          name: `Gift Card - ₹${finalAmount}`,
          description: `Gift card worth ₹${finalAmount} for ${recipientEmail}`,
          price: finalAmount,
          image: '/images/gift-card.png',
          category: 'Gift Cards',
          brand: '',
          unit: '1 Card',
          inStock: true,
          rating: 0,
          reviewCount: 0,
          tags: ['gift-card'],
        },
        quantity: 1,
      }));
      toast.success('Gift card added to cart!');
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-pink-500 rounded-full p-3">
          <FiGift className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Send a Gift Card</h3>
          <p className="text-sm text-gray-600">Perfect gift for any occasion</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Amount
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAmount(preset);
                  setCustomAmount('');
                }}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  amount === preset && !customAmount
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <label className="block text-sm text-gray-600 mb-1">Or enter custom amount:</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">₹</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  if (e.target.value) {
                    setAmount(Number(e.target.value));
                  }
                }}
                placeholder="Min ₹100"
                min={100}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-lg font-bold text-gray-900">
              <CurrencyConverter inrPrice={customAmount ? Number(customAmount) || amount : amount} />
            </span>
          </div>
        </div>

        {/* Recipient Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMail className="inline h-4 w-4 mr-1" />
            Recipient Email
          </label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="friend@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personal Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/200 characters</p>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiGift className="h-5 w-5" />
          Purchase Gift Card
        </button>
      </div>
    </div>
  );
};

export default GiftCard;
