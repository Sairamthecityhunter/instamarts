import React, { useState, useEffect } from 'react';
import { MenuItem, SelectedCustomizations } from '../../types/restaurant';

interface CustomizationModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, customizations?: any) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomizations>({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedCustomizations, quantity]);

  const calculateTotalPrice = () => {
    let basePrice = item.price;
    let customizationPrice = 0;

    // Calculate customization costs
    Object.values(selectedCustomizations).forEach(customization => {
      Object.entries(customization).forEach(([optionName, isSelected]) => {
        if (isSelected) {
          const option = item.customizations?.flatMap(c => c.options).find(opt => opt.name === optionName);
          if (option) {
            customizationPrice += option.price;
          }
        }
      });
    });

    setTotalPrice((basePrice + customizationPrice) * quantity);
  };

  const handleCustomizationChange = (customizationName: string, optionName: string, isSelected: boolean) => {
    setSelectedCustomizations(prev => ({
      ...prev,
      [customizationName]: {
        ...prev[customizationName],
        [optionName]: isSelected
      }
    }));
  };

  const handleAddToCart = () => {
    const customizations = Object.entries(selectedCustomizations).map(([customizationName, options]) => ({
      name: customizationName,
      selectedOptions: Object.entries(options)
        .filter(([_, isSelected]) => isSelected)
        .map(([optionName]) => optionName)
    })).filter(customization => customization.selectedOptions.length > 0);

    onAddToCart(item, {
      customizations,
      quantity,
      totalPrice
    });
  };

  const getSelectedOptionsCount = (customizationName: string) => {
    return Object.values(selectedCustomizations[customizationName] || {}).filter(Boolean).length;
  };

  const getCustomizationTypeIcon = (type: string) => {
    switch (type) {
      case 'topping': return '🧀';
      case 'spice': return '🌶️';
      case 'quantity': return '📏';
      case 'addon': return '➕';
      default: return '⚙️';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Customize Your Order</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Item Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-bold text-gray-800">₹{item.price}</span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                )}
                {item.calories && (
                  <span className="text-sm text-gray-500">🔥 {item.calories} kcal</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customizations */}
        <div className="p-6">
          {item.customizations?.map((customization, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{getCustomizationTypeIcon(customization.type)}</span>
                <h4 className="font-semibold text-gray-800">{customization.name}</h4>
                {getSelectedOptionsCount(customization.name) > 0 && (
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                    {getSelectedOptionsCount(customization.name)} selected
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {customization.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomizations[customization.name]?.[option.name] || false}
                        onChange={(e) => handleCustomizationChange(customization.name, option.name, e.target.checked)}
                        className="rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{option.name}</div>
                        {option.description && (
                          <div className="text-sm text-gray-600">{option.description}</div>
                        )}
                      </div>
                    </div>
                    {option.price > 0 && (
                      <span className="text-sm font-medium text-gray-800">+₹{option.price}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity Selector */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Quantity</h4>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                -
              </button>
              <span className="font-semibold text-lg min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Special Instructions (Optional)</h4>
            <textarea
              placeholder="Any special requests or instructions..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Frequently Ordered With */}
          {item.frequentlyOrderedWith && item.frequentlyOrderedWith.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Frequently Ordered With</h4>
              <div className="grid grid-cols-2 gap-3">
                {item.frequentlyOrderedWith.slice(0, 4).map((itemId, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="text-sm font-medium text-gray-800">Item {index + 1}</div>
                    <div className="text-xs text-gray-600">₹99</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-600">Total Price:</span>
              <div className="text-2xl font-bold text-gray-800">₹{totalPrice}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Quantity: {quantity}</div>
              <div className="text-sm text-gray-600">
                Base: ₹{item.price} × {quantity}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Add to Cart • ₹{totalPrice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal; 