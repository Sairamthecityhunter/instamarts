import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  category: string;
  isOpen: boolean;
  distance: string;
  minOrder: number;
  deliveryFee: number;
  specialties: string[];
}

const StoreListPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    try {
      // Mock stores data
      const mockStores: Store[] = [
        {
          id: '1',
          name: 'Sharma Grocery Store',
          description: 'Authentic Indian groceries and fresh produce since 1985',
          image: 'https://images.unsplash.com/photo-1555982105-d25af4182e4e?w=400',
          rating: 4.5,
          reviewCount: 1250,
          deliveryTime: '25-35 mins',
          category: 'traditional',
          isOpen: true,
          distance: '1.2 km',
          minOrder: 100,
          deliveryFee: 0,
          specialties: ['Fresh Vegetables', 'Spices & Masalas', 'Regional Specialties']
        },
        {
          id: '2',
          name: 'Modern Mart',
          description: 'Your one-stop shop for all Indian grocery needs',
          image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400',
          rating: 4.3,
          reviewCount: 890,
          deliveryTime: '20-30 mins',
          category: 'supermarket',
          isOpen: true,
          distance: '2.1 km',
          minOrder: 150,
          deliveryFee: 25,
          specialties: ['Bulk Items', 'Packaged Goods', 'Household Items']
        },
        {
          id: '3',
          name: 'Spice Paradise',
          description: 'Premium spices and masalas from across India',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
          rating: 4.7,
          reviewCount: 567,
          deliveryTime: '30-40 mins',
          category: 'specialty',
          isOpen: true,
          distance: '3.5 km',
          minOrder: 200,
          deliveryFee: 40,
          specialties: ['Whole Spices', 'Ground Masalas', 'Organic Spices']
        },
        {
          id: '4',
          name: 'Fresh Farm Market',
          description: 'Farm-fresh vegetables and fruits daily',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
          rating: 4.4,
          reviewCount: 723,
          deliveryTime: '15-25 mins',
          category: 'fresh',
          isOpen: false,
          distance: '0.8 km',
          minOrder: 80,
          deliveryFee: 0,
          specialties: ['Organic Vegetables', 'Seasonal Fruits', 'Fresh Herbs']
        },
        {
          id: '5',
          name: 'Sweets & Snacks Corner',
          description: 'Traditional Indian sweets and namkeens',
          image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400',
          rating: 4.2,
          reviewCount: 456,
          deliveryTime: '35-45 mins',
          category: 'sweets',
          isOpen: true,
          distance: '4.2 km',
          minOrder: 120,
          deliveryFee: 30,
          specialties: ['Fresh Sweets', 'Namkeens', 'Festival Specials']
        }
      ];

      setStores(mockStores);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Stores', icon: '🏪' },
    { id: 'traditional', name: 'Traditional', icon: '🕉️' },
    { id: 'supermarket', name: 'Supermarket', icon: '🛒' },
    { id: 'specialty', name: 'Specialty', icon: '⭐' },
    { id: 'fresh', name: 'Fresh Market', icon: '🥬' },
    { id: 'sweets', name: 'Sweets & Snacks', icon: '🍯' }
  ];

  const sortOptions = [
    { id: 'rating', name: 'Rating' },
    { id: 'deliveryTime', name: 'Delivery Time' },
    { id: 'distance', name: 'Distance' },
    { id: 'popularity', name: 'Popularity' }
  ];

  const filteredStores = stores
    .filter(store => selectedCategory === 'all' || store.category === selectedCategory)
    .filter(store => store.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'popularity':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Stores Near You</h1>
          <p className="text-gray-600">
            Choose from {stores.length} trusted grocery stores in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            {/* Sort */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    Sort by {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => (
            <Link key={store.id} to={`/store/${store.id}`}>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative">
                  <img 
                    src={store.image} 
                    alt={store.name}
                    className="w-full h-48 object-cover"
                  />
                  {!store.isOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Currently Closed</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      store.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {store.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{store.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{store.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-green-600 font-semibold mr-1">★ {store.rating}</span>
                      <span className="text-gray-500 text-sm">({store.reviewCount})</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600 text-sm">{store.deliveryTime}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600 text-sm">{store.distance}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      Min order: ₹{store.minOrder}
                    </span>
                    <span className="text-sm text-gray-600">
                      {store.deliveryFee === 0 ? 'Free delivery' : `₹${store.deliveryFee} delivery`}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {store.specialties.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {specialty}
                      </span>
                    ))}
                    {store.specialties.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{store.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreListPage; 