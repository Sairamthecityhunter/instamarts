import React from 'react';
import { Restaurant } from '../../types/restaurant';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Restaurant Image */}
          <div className="w-48 h-32 rounded-lg overflow-hidden">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Restaurant Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-gray-600 mb-2">
                  {restaurant.cuisine.join(', ')}
                </p>
                
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-semibold">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">🕒</span>
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">₹</span>
                    <span>₹{restaurant.costForTwo} for two</span>
                  </div>
                </div>

                {/* Offers */}
                {restaurant.offers.length > 0 && (
                  <div className="space-y-1">
                    {restaurant.offers.map((offer, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-orange-500 text-sm font-medium">
                          {offer}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pure Veg Badge */}
              {restaurant.isPureVeg && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  🟢 Pure Veg
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader; 