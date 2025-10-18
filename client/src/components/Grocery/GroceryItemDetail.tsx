import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-hot-toast';

interface GroceryItemDetailProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    subcategory: string;
    brand: string;
    unit: string;
    inStock: boolean;
    rating: number;
    reviewCount: number;
    tags: string[];
    weight?: string;
    expiry?: string;
    organic?: boolean;
    glutenFree?: boolean;
    vegan?: boolean;
  };
  onClose: () => void;
}

const GroceryItemDetail: React.FC<GroceryItemDetailProps> = ({ item, onClose }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [showNutrition, setShowNutrition] = useState(false);

  const handleAddToCart = () => {
    const product = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      brand: item.brand,
      unit: item.unit,
      inStock: item.inStock,
      rating: item.rating,
      reviewCount: item.reviewCount,
      tags: item.tags
    };
    
    dispatch(addToCart({ product, quantity }));
    toast.success(`${quantity} ${item.name} added to cart`);
    onClose();
  };

  const discountPercentage = item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const getTagBadge = (tag: string) => {
    const badges: { [key: string]: { text: string; color: string; bgColor: string } } = {
      organic: { text: 'Organic', color: 'text-green-800', bgColor: 'bg-green-100' },
      fresh: { text: 'Fresh', color: 'text-blue-800', bgColor: 'bg-blue-100' },
      bestseller: { text: 'Bestseller', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
      premium: { text: 'Premium', color: 'text-purple-800', bgColor: 'bg-purple-100' },
      healthy: { text: 'Healthy', color: 'text-emerald-800', bgColor: 'bg-emerald-100' },
      vegan: { text: 'Vegan', color: 'text-green-800', bgColor: 'bg-green-100' },
      glutenFree: { text: 'Gluten Free', color: 'text-orange-800', bgColor: 'bg-orange-100' }
    };
    return badges[tag] || { text: tag, color: 'text-gray-800', bgColor: 'bg-gray-100' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {!item.inStock && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </div>
                )}
                {item.originalPrice && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {discountPercentage}% OFF
                  </div>
                )}
                {item.organic && (
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Organic
                  </div>
                )}
              </div>

              {/* Product Tags */}
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => {
                  const badge = getTagBadge(tag);
                  return (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bgColor} ${badge.color}`}
                    >
                      {badge.text}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-semibold ml-1">{item.rating}</span>
                    <span className="text-gray-500 ml-1">({item.reviewCount} reviews)</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{item.brand}</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">₹{item.originalPrice}</span>
                  )}
                  <span className="text-gray-500">{item.unit}</span>
                </div>

                {item.weight && (
                  <div className="text-sm text-gray-600 mb-4">
                    Weight: {item.weight}
                  </div>
                )}
              </div>

              {/* Dietary Information */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Dietary Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Organic:</span>
                    <span className={item.organic ? 'text-green-600' : 'text-gray-400'}>
                      {item.organic ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Vegan:</span>
                    <span className={item.vegan ? 'text-green-600' : 'text-gray-400'}>
                      {item.vegan ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Gluten Free:</span>
                    <span className={item.glutenFree ? 'text-green-600' : 'text-gray-400'}>
                      {item.glutenFree ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-900">{item.subcategory}</span>
                  </div>
                </div>
              </div>

              {/* Nutritional Information */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Nutritional Information</h3>
                  <button
                    onClick={() => setShowNutrition(!showNutrition)}
                    className="text-orange-500 text-sm font-medium hover:text-orange-700"
                  >
                    {showNutrition ? 'Hide' : 'View'} Details
                  </button>
                </div>
                
                {showNutrition && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Calories:</span>
                        <span className="ml-2 font-medium">~{Math.round(item.price * 0.1)} kcal per 100g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Protein:</span>
                        <span className="ml-2 font-medium">~{Math.round(item.price * 0.02)}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Carbohydrates:</span>
                        <span className="ml-2 font-medium">~{Math.round(item.price * 0.05)}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fat:</span>
                        <span className="ml-2 font-medium">~{Math.round(item.price * 0.01)}g</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      *Nutritional values are approximate and may vary
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="font-semibold min-w-[40px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600"
                    >
                      +
                    </button>
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
                    disabled={!item.inStock}
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {item.inStock ? `Add to Cart • ₹${item.price * quantity}` : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {/* Mock reviews */}
              {[
                { name: 'Sarah M.', rating: 5, comment: 'Great quality and fresh product!', date: '2 days ago' },
                { name: 'John D.', rating: 4, comment: 'Good value for money, will buy again.', date: '1 week ago' },
                { name: 'Priya S.', rating: 5, comment: 'Excellent product, highly recommended!', date: '2 weeks ago' }
              ].map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{review.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryItemDetail; 