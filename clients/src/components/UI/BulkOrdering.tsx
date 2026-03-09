import React, { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import CurrencyConverter from '../International/CurrencyConverter';

interface BulkPricingTier {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  discount: number;
}

interface BulkOrderingProps {
  productId: string;
  productName: string;
  basePrice: number;
  pricingTiers: BulkPricingTier[];
  onAddToCart?: (quantity: number, price: number) => void;
}

const BulkOrdering: React.FC<BulkOrderingProps> = ({
  productId,
  productName,
  basePrice,
  pricingTiers,
  onAddToCart,
}) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const getPriceForQuantity = (qty: number): number => {
    // Sort tiers by minQuantity descending
    const sortedTiers = [...pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    
    for (const tier of sortedTiers) {
      if (qty >= tier.minQuantity && (!tier.maxQuantity || qty <= tier.maxQuantity)) {
        return tier.price;
      }
    }
    return basePrice;
  };

  const getCurrentTier = (qty: number): BulkPricingTier | null => {
    const sortedTiers = [...pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    return sortedTiers.find(
      tier => qty >= tier.minQuantity && (!tier.maxQuantity || qty <= tier.maxQuantity)
    ) || null;
  };

  const currentPrice = getPriceForQuantity(quantity);
  const currentTier = getCurrentTier(quantity);
  const savings = currentTier ? (basePrice - currentPrice) * quantity : 0;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(quantity, currentPrice);
    } else {
      // Default implementation
      dispatch(addToCart({
        product: {
          id: productId,
          name: productName,
          description: '',
          price: currentPrice,
          image: '',
          category: '',
          brand: '',
          unit: '',
          inStock: true,
          rating: 0,
          reviewCount: 0,
          tags: [],
        },
        quantity: quantity,
      }));
      toast.success(`${quantity} x ${productName} added to cart`);
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Ordering - Save More!</h3>

      {/* Quantity Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 transition-colors"
              disabled={quantity <= 1}
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 min-w-[80px] text-center font-medium text-lg">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Tiers</label>
        <div className="space-y-2">
          {pricingTiers.map((tier, index) => {
            const isActive = currentTier?.minQuantity === tier.minQuantity;
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  isActive
                    ? 'border-green-600 bg-green-100'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {tier.minQuantity}
                    {tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+'} units
                  </span>
                  <div className="text-right">
                    <CurrencyConverter
                      inrPrice={tier.price}
                      className="font-bold text-green-600"
                    />
                    <span className="text-xs text-gray-500 ml-2">
                      ({tier.discount}% off)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Pricing */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Unit Price:</span>
          <CurrencyConverter inrPrice={currentPrice} className="font-bold text-lg" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Total Price:</span>
          <CurrencyConverter
            inrPrice={currentPrice * quantity}
            className="font-bold text-xl text-green-600"
          />
        </div>
        {savings > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm font-medium text-green-600">You Save:</span>
            <CurrencyConverter inrPrice={savings} className="font-bold text-green-600" />
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        Add {quantity} to Cart
      </button>
    </div>
  );
};

export default BulkOrdering;
