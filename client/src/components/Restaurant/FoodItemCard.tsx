import React, { useState } from 'react';
import { MenuItem } from '../../types/restaurant';

interface FoodItemCardProps {
  item: MenuItem;
  quantity: number;
  onAddToCart: () => void;
  onCustomize: () => void;
  onRemoveFromCart: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  quantity,
  onAddToCart,
  onCustomize,
  onRemoveFromCart,
  onUpdateQuantity
}) => {
  const [showNutrition, setShowNutrition] = useState(false);

  const getTagBadge = (tag: string) => {
    const badges: { [key: string]: { text: string; color: string; bgColor: string } } = {
      bestseller: { text: 'Bestseller', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
      chef_special: { text: "Chef's Special", color: 'text-purple-800', bgColor: 'bg-purple-100' },
      new_item: { text: 'New', color: 'text-green-800', bgColor: 'bg-green-100' },
      instamart_recommended: { text: 'Recommended', color: 'text-blue-800', bgColor: 'bg-blue-100' },
      healthy_choice: { text: 'Healthy', color: 'text-emerald-800', bgColor: 'bg-emerald-100' }
    };
    return badges[tag] || { text: tag, color: 'text-gray-800', bgColor: 'bg-gray-100' };
  };

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case 'mild': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'spicy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSpiceLevelIcon = (level: string) => {
    switch (level) {
      case 'mild': return '🌶️';
      case 'medium': return '🌶️🌶️';
      case 'spicy': return '🌶️🌶️🌶️';
      default: return '';
    }
  };

  const discountPercentage = item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex gap-6">
        {/* Item Image */}
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
          
          {/* Dietary Indicator */}
          <div className="absolute top-2 left-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              item.isVeg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {item.isVeg ? '🟢' : '🔴'}
            </div>
          </div>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-bold">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Not Available</span>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              {/* Item Name and Tags */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                {item.tags.slice(0, 2).map((tag) => {
                  const badge = getTagBadge(tag);
                  return (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bgColor} ${badge.color}`}
                    >
                      {badge.text}
                    </span>
                  );
                })}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-2">
                {item.description}
              </p>

              {/* Rating and Reviews */}
              {item.rating && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-semibold text-sm ml-1">{item.rating.average}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({item.rating.count} reviews)</span>
                </div>
              )}

              {/* Spice Level */}
              {item.spiceLevel && (
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-medium ${getSpiceLevelColor(item.spiceLevel)}`}>
                    {getSpiceLevelIcon(item.spiceLevel)} {item.spiceLevel.charAt(0).toUpperCase() + item.spiceLevel.slice(1)}
                  </span>
                </div>
              )}

              {/* Calories */}
              {item.calories && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 text-sm">🔥 {item.calories} kcal</span>
                </div>
              )}

              {/* Allergens */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 text-sm">⚠️ Contains: {item.allergens.join(', ')}</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-gray-800">₹{item.price}</span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                )}
              </div>

              {/* Nutrition Info Toggle */}
              {(item.calories || item.allergens) && (
                <button
                  onClick={() => setShowNutrition(!showNutrition)}
                  className="text-orange-500 text-sm font-medium hover:text-orange-700 mb-3"
                >
                  {showNutrition ? 'Hide' : 'View'} Nutritional Info
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-end">
              {item.isAvailable ? (
                <div className="flex flex-col items-end gap-2">
                  {quantity === 0 ? (
                    <div className="flex gap-2">
                      {item.customizations && item.customizations.length > 0 ? (
                        <button
                          onClick={onCustomize}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          Customize
                        </button>
                      ) : (
                        <button
                          onClick={onAddToCart}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(quantity - 1)}
                        className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600"
                      >
                        -
                      </button>
                      <span className="font-semibold min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(quantity + 1)}
                        className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-red-500 text-sm font-medium">Not Available</span>
              )}
            </div>
          </div>

          {/* Nutritional Information */}
          {showNutrition && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Nutritional Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {item.calories && (
                  <div>
                    <span className="text-gray-600">Calories:</span>
                    <span className="ml-2 font-medium">{item.calories} kcal</span>
                  </div>
                )}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Allergens:</span>
                    <span className="ml-2 font-medium">{item.allergens.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customization Preview */}
          {item.customizations && item.customizations.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {item.customizations.length} customization option{item.customizations.length > 1 ? 's' : ''} available
                </span>
                <button
                  onClick={onCustomize}
                  className="text-orange-500 text-sm font-medium hover:text-orange-700"
                >
                  Customize
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard; 