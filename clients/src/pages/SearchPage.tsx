import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  costForTwo: number;
  image: string;
  isPureVeg: boolean;
  offers: string[];
  isOpen: boolean;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: '',
    costForTwo: '',
    deliveryTime: '',
    pureVeg: false,
    offers: false
  });
  const [sortBy, setSortBy] = useState('relevance');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    // Mock search results - in real app, fetch from API
    const mockRestaurants: Restaurant[] = [
      {
        id: '1',
        name: 'Pizza Palace',
        cuisine: ['Italian', 'Pizza', 'Pasta'],
        rating: 4.2,
        deliveryTime: '25-35 min',
        costForTwo: 600,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        isPureVeg: false,
        offers: ['50% OFF up to ₹100'],
        isOpen: true
      },
      {
        id: '2',
        name: 'Burger House',
        cuisine: ['American', 'Burgers', 'Fast Food'],
        rating: 4.0,
        deliveryTime: '20-30 min',
        costForTwo: 400,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
        isPureVeg: false,
        offers: ['Free delivery'],
        isOpen: true
      },
      {
        id: '3',
        name: 'Green Garden',
        cuisine: ['Indian', 'Vegetarian', 'Healthy'],
        rating: 4.5,
        deliveryTime: '30-40 min',
        costForTwo: 500,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        isPureVeg: true,
        offers: ['20% OFF'],
        isOpen: true
      }
    ];

    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setLoading(false);
    }, 1000);
  }, [query]);

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (filters.rating && restaurant.rating < parseFloat(filters.rating)) return false;
    if (filters.costForTwo && restaurant.costForTwo > parseInt(filters.costForTwo)) return false;
    if (filters.pureVeg && !restaurant.isPureVeg) return false;
    if (filters.offers && restaurant.offers.length === 0) return false;
    return true;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'deliveryTime':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      case 'costForTwo':
        return a.costForTwo - b.costForTwo;
      default:
        return 0;
    }
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            {sortedRestaurants.length} restaurants found
          </p>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
              
              {/* Rating Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.0">4.0+</option>
                  <option value="3.5">3.5+</option>
                </select>
              </div>

              {/* Cost for Two Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost for Two
                </label>
                <select
                  value={filters.costForTwo}
                  onChange={(e) => setFilters({ ...filters, costForTwo: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Any Price</option>
                  <option value="300">Under ₹300</option>
                  <option value="500">Under ₹500</option>
                  <option value="1000">Under ₹1000</option>
                </select>
              </div>

              {/* Pure Veg Filter */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.pureVeg}
                    onChange={(e) => setFilters({ ...filters, pureVeg: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Pure Veg Only</span>
                </label>
              </div>

              {/* Offers Filter */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.offers}
                    onChange={(e) => setFilters({ ...filters, offers: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Offers Available</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="deliveryTime">Delivery Time</option>
                  <option value="costForTwo">Cost for Two</option>
                </select>
              </div>
            </div>

            {/* Restaurant Cards */}
            <div className="space-y-4">
              {sortedRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurant/${restaurant.id}`}
                  className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {restaurant.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {restaurant.cuisine.join(', ')}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="text-yellow-400">⭐</span>
                              {restaurant.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-gray-500">🕒</span>
                              {restaurant.deliveryTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-gray-500">₹</span>
                              ₹{restaurant.costForTwo} for two
                            </span>
                          </div>
                          {restaurant.offers.length > 0 && (
                            <div className="mt-2">
                              {restaurant.offers.map((offer, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mr-2"
                                >
                                  {offer}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {restaurant.isPureVeg && (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            🟢 Pure Veg
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {sortedRestaurants.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 