import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useCurrency } from '../hooks/useCurrency';

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
  const { formatPrice } = useCurrency();
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
          id: '6',
          name: 'Devotional Mart',
          description: 'Pooja stores, Incense & items',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=400',
          rating: 4.8,
          reviewCount: 875,
          deliveryTime: '15-25 mins',
          category: 'traditional',
          isOpen: true,
          distance: '1.1 km',
          minOrder: 150,
          deliveryFee: 0,
          specialties: ['Pooja Essentials', 'Incense & Dhoop', 'Idols & Statues']
        },
        {
          id: '7',
          name: 'Sacred Offerings',
          description: 'Pooja stores, Incense & items',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
          rating: 4.7,
          reviewCount: 690,
          deliveryTime: '20-30 mins',
          category: 'traditional',
          isOpen: true,
          distance: '2 km',
          minOrder: 100,
          deliveryFee: 30,
          specialties: ['Idols & Statues', 'Incense & Books', 'Pooja Items']
        },
        {
          id: '8',
          name: 'Divine Pooja Store',
          description: 'Religious stores & spiritual items',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
          rating: 4.6,
          reviewCount: 790,
          deliveryTime: '25-35 mins',
          category: 'traditional',
          isOpen: true,
          distance: '1.5 km',
          minOrder: 100,
          deliveryFee: 40,
          specialties: ['Flowers & Leaves', 'Brass Pooja Sets', 'Spiritual Items']
        },
        {
          id: '9',
          name: 'Spiritual Bazaar',
          description: 'Religious items stores',
          image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400',
          rating: 4.5,
          reviewCount: 685,
          deliveryTime: '15-25 mins',
          category: 'traditional',
          isOpen: true,
          distance: '2.3 km',
          minOrder: 120,
          deliveryFee: 0,
          specialties: ['Rudraksha Beads', 'Spiritual Books', 'Pooja Accessories']
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
          id: '10',
          name: 'Mega Supermarket',
          description: 'Large selection of groceries, household items, and more',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
          rating: 4.4,
          reviewCount: 1120,
          deliveryTime: '25-35 mins',
          category: 'supermarket',
          isOpen: true,
          distance: '3.2 km',
          minOrder: 200,
          deliveryFee: 30,
          specialties: ['Beverages', 'Frozen Foods', 'Personal Care']
        },
        {
          id: '11',
          name: 'City Mart',
          description: 'Convenient supermarket with wide variety of products',
          image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
          rating: 4.2,
          reviewCount: 756,
          deliveryTime: '18-28 mins',
          category: 'supermarket',
          isOpen: true,
          distance: '1.8 km',
          minOrder: 120,
          deliveryFee: 20,
          specialties: ['Snacks', 'Dairy Products', 'Bakery Items']
        },
        {
          id: '12',
          name: 'Express Superstore',
          description: 'Quick delivery supermarket for all your daily needs',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
          rating: 4.5,
          reviewCount: 934,
          deliveryTime: '15-25 mins',
          category: 'supermarket',
          isOpen: true,
          distance: '1.5 km',
          minOrder: 100,
          deliveryFee: 15,
          specialties: ['Ready-to-Eat', 'Beverages', 'Cleaning Supplies']
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
          id: '13',
          name: 'Gourmet Indian Foods',
          description: 'Specialty Indian ingredients and gourmet products',
          image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
          rating: 4.6,
          reviewCount: 678,
          deliveryTime: '35-45 mins',
          category: 'specialty',
          isOpen: true,
          distance: '4.1 km',
          minOrder: 250,
          deliveryFee: 50,
          specialties: ['Premium Rice', 'Exotic Spices', 'Gourmet Items']
        },
        {
          id: '14',
          name: 'Organic Harvest',
          description: '100% organic Indian groceries and specialty items',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
          rating: 4.8,
          reviewCount: 892,
          deliveryTime: '30-40 mins',
          category: 'specialty',
          isOpen: true,
          distance: '3.8 km',
          minOrder: 300,
          deliveryFee: 45,
          specialties: ['Organic Products', 'Health Foods', 'Natural Items']
        },
        {
          id: '15',
          name: 'Regional Specialties Store',
          description: 'Authentic regional Indian foods and specialty items',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=400',
          rating: 4.5,
          reviewCount: 523,
          deliveryTime: '40-50 mins',
          category: 'specialty',
          isOpen: true,
          distance: '5.2 km',
          minOrder: 180,
          deliveryFee: 55,
          specialties: ['Regional Foods', 'Traditional Items', 'Authentic Products']
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
          isOpen: true,
          distance: '0.8 km',
          minOrder: 80,
          deliveryFee: 0,
          specialties: ['Organic Vegetables', 'Seasonal Fruits', 'Fresh Herbs']
        },
        {
          id: '16',
          name: 'Green Valley Produce',
          description: 'Fresh organic vegetables and fruits from local farms',
          image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
          rating: 4.6,
          reviewCount: 645,
          deliveryTime: '20-30 mins',
          category: 'fresh',
          isOpen: true,
          distance: '2.5 km',
          minOrder: 100,
          deliveryFee: 20,
          specialties: ['Organic Produce', 'Local Vegetables', 'Fresh Fruits']
        },
        {
          id: '17',
          name: 'Daily Fresh Market',
          description: 'Daily fresh vegetables, fruits, and herbs',
          image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
          rating: 4.3,
          reviewCount: 512,
          deliveryTime: '12-22 mins',
          category: 'fresh',
          isOpen: true,
          distance: '1.2 km',
          minOrder: 90,
          deliveryFee: 15,
          specialties: ['Fresh Vegetables', 'Tropical Fruits', 'Fresh Herbs']
        },
        {
          id: '18',
          name: 'Farm to Door',
          description: 'Direct from farm fresh produce delivered to your door',
          image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
          rating: 4.7,
          reviewCount: 834,
          deliveryTime: '25-35 mins',
          category: 'fresh',
          isOpen: true,
          distance: '3.0 km',
          minOrder: 150,
          deliveryFee: 25,
          specialties: ['Farm Fresh', 'Seasonal Produce', 'Organic Options']
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
        },
        {
          id: '19',
          name: 'Mithai House',
          description: 'Authentic Indian sweets and traditional desserts',
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
          rating: 4.5,
          reviewCount: 678,
          deliveryTime: '30-40 mins',
          category: 'sweets',
          isOpen: true,
          distance: '3.5 km',
          minOrder: 150,
          deliveryFee: 35,
          specialties: ['Gulab Jamun', 'Rasgulla', 'Barfi', 'Ladoo']
        },
        {
          id: '20',
          name: 'Namkeen Express',
          description: 'Crispy namkeens and savory snacks',
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=400',
          rating: 4.4,
          reviewCount: 589,
          deliveryTime: '25-35 mins',
          category: 'sweets',
          isOpen: true,
          distance: '2.8 km',
          minOrder: 100,
          deliveryFee: 25,
          specialties: ['Bhujia', 'Mixture', 'Chips', 'Kurkure']
        },
        {
          id: '21',
          name: 'Sweet Delights',
          description: 'Fresh Indian sweets and confectionery',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
          rating: 4.6,
          reviewCount: 745,
          deliveryTime: '20-30 mins',
          category: 'sweets',
          isOpen: true,
          distance: '2.2 km',
          minOrder: 130,
          deliveryFee: 20,
          specialties: ['Kaju Katli', 'Peda', 'Jalebi', 'Halwa']
        },
        {
          id: '22',
          name: 'Snack Zone',
          description: 'Wide variety of Indian snacks and namkeens',
          image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
          rating: 4.3,
          reviewCount: 432,
          deliveryTime: '18-28 mins',
          category: 'sweets',
          isOpen: true,
          distance: '1.9 km',
          minOrder: 110,
          deliveryFee: 18,
          specialties: ['Packaged Snacks', 'Fresh Namkeens', 'Dry Fruits']
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
    .filter(store => {
      // Filter by category
      if (selectedCategory !== 'all' && store.category !== selectedCategory) {
        return false;
      }
      // Filter by search query
      if (searchQuery && !store.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          // Extract first number from delivery time (e.g., "25-35 mins" -> 25)
          const aTime = parseInt(a.deliveryTime.split('-')[0]) || 0;
          const bTime = parseInt(b.deliveryTime.split('-')[0]) || 0;
          return aTime - bTime;
        case 'distance':
          // Extract number from distance (e.g., "1.2 km" -> 1.2)
          const aDist = parseFloat(a.distance.replace(' km', '')) || 0;
          const bDist = parseFloat(b.distance.replace(' km', '')) || 0;
          return aDist - bDist;
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
            {selectedCategory === 'all' 
              ? `Choose from ${stores.length} trusted grocery stores in your area`
              : `Showing ${filteredStores.length} ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase() || ''} store${filteredStores.length !== 1 ? 's' : ''}`
            }
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
                    ? selectedCategory === 'traditional'
                      ? 'bg-purple-600 text-white'
                      : 'bg-green-600 text-white'
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
                      Min order: {formatPrice(store.minOrder)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {store.deliveryFee === 0 ? 'Free delivery' : `${formatPrice(store.deliveryFee)} delivery`}
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