import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { setProducts } from '../store/slices/productsSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ShippingZones from '../components/International/ShippingZones';
import CurrencyConverter from '../components/International/CurrencyConverter';
import CustomsInfo from '../components/International/CustomsInfo';
import { 
  FiSearch, 
  FiMic, 
  FiCamera, 
 
  FiClock, 
  FiTruck, 
  FiStar, 
  FiHeart,
  FiShoppingCart,
  FiUsers,


  FiMessageCircle,

  FiRepeat
} from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  unit: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
}

interface DeliverySlot {
  id: string;
  time: string;
  isGreen: boolean;
  carbonSaved: number;
  price: number;
}

const InstamartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { products: storeProducts } = useSelector((state: RootState) => state.products);
  const [products, setProductsState] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedDietFilter, setSelectedDietFilter] = useState('all');

  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<string>('express');
  const [showGroupOrder, setShowGroupOrder] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentPurchases, setRecentPurchases] = useState<Product[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(2450);
  const [carbonSaved] = useState(12.5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { 
      id: 'all', 
      name: 'All Categories', 
      icon: '🛒',
      subcategories: []
    },
    { 
      id: 'spices', 
      name: 'Spices & Masalas', 
      icon: '🌶️',
      subcategories: ['Whole Spices', 'Ground Spices', 'Garam Masala', 'Regional Masalas', 'Organic Spices', 'Spice Blends']
    },
    { 
      id: 'staples', 
      name: 'Staples & Grains', 
      icon: '🌾',
      subcategories: ['Basmati Rice', 'Regional Rice', 'Lentils & Pulses', 'Cooking Oils', 'Flour & Grains', 'Sugar & Jaggery']
    },
    { 
      id: 'snacks', 
      name: 'Snacks & Namkeens', 
      icon: '🥨',
      subcategories: ['Namkeens', 'Traditional Sweets', 'Chips & Crackers', 'Dry Fruits', 'Ready-to-Eat', 'Frozen Foods']
    },
    { 
      id: 'beverages', 
      name: 'Tea & Coffee', 
      icon: '☕',
      subcategories: ['Assam Tea', 'Darjeeling Tea', 'South Indian Coffee', 'Green Tea', 'Health Drinks', 'Traditional Drinks']
    },
    { 
      id: 'fresh-produce', 
      name: 'Fresh Produce', 
      icon: '🥭',
      subcategories: ['Tropical Fruits', 'Indian Vegetables', 'Fresh Herbs', 'Organic Produce', 'Seasonal Fruits', 'Exotic Vegetables']
    },
    { 
      id: 'dairy', 
      name: 'Dairy Products', 
      icon: '🥛',
      subcategories: ['Paneer & Cheese', 'Milk Products', 'Yogurt & Curd', 'Butter & Ghee', 'Plant-based Alternatives']
    },
    { 
      id: 'personal-care', 
      name: 'Ayurveda & Wellness', 
      icon: '🌿',
      subcategories: ['Ayurvedic Medicine', 'Hair Care', 'Skin Care', 'Immunity Boosters', 'Herbal Teas', 'Traditional Beauty']
    },
    { 
      id: 'kitchenware', 
      name: 'Indian Kitchenware', 
      icon: '🍳',
      subcategories: ['Pressure Cookers', 'Traditional Utensils', 'Storage Containers', 'Spice Boxes', 'Cookware']
    }
  ];

  const dietaryFilters = [
    { id: 'all', name: 'All Products' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'organic', name: 'Organic' },
    { id: 'keto', name: 'Keto-Friendly' },
    { id: 'gluten-free', name: 'Gluten-Free' },
    { id: 'low-sodium', name: 'Low Sodium' }
  ];

  const deliverySlots: DeliverySlot[] = [
    { id: 'standard', time: '7-12 business days', isGreen: false, carbonSaved: 0, price: 15.99 },
    { id: 'expedited', time: '5-8 business days', isGreen: false, carbonSaved: 0, price: 29.99 },
    { id: 'economy', time: '12-18 business days', isGreen: true, carbonSaved: 5.8, price: 9.99 },
    { id: 'bulk', time: '14-21 business days', isGreen: true, carbonSaved: 8.2, price: 7.99 }
  ];

  useEffect(() => {
    loadProducts();
    loadRecentPurchases();
  }, []);

  // Update local state when Redux store products change
  useEffect(() => {
    if (storeProducts.length > 0) {
      setProductsState(storeProducts);
    }
  }, [storeProducts]);


  const loadProducts = async () => {
    setLoading(true);
    try {
      // Check if we have products in Redux store first
      if (storeProducts.length > 0) {
        setProductsState(storeProducts);
        setLoading(false);
        return;
      }

      // Load initial mock products if store is empty
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Organic Turmeric Powder',
          description: 'Premium organic turmeric powder directly from Indian farms',
          price: 320,
          originalPrice: 380,
          image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300',
          category: 'spices',
          brand: 'Organic India',
          unit: '500g',
          rating: 4.8,
          reviewCount: 456,
          inStock: true,
          tags: ['Premium', 'Certified Organic']
        },
        {
          id: '2',
          name: 'Darjeeling Black Tea',
          description: 'Premium first flush Darjeeling tea with delicate muscatel flavor',
          price: 850,
          image: 'https://images.unsplash.com/photo-1594631661960-44d18c4b47e9?w=300',
          category: 'beverages',
          brand: 'Twinings of London',
          unit: '250g',
          rating: 4.9,
          reviewCount: 892,
          inStock: true,
          tags: ['Premium', 'First Flush']
        },
        {
          id: '3',
          name: 'Basmati Rice Premium',
          description: 'Aged 2 years premium basmati rice with long grains and aromatic flavor',
          price: 1850,
          originalPrice: 2100,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          category: 'staples',
          brand: 'India Gate',
          unit: '5kg',
          rating: 4.6,
          reviewCount: 856,
          inStock: true,
          tags: ['Premium', 'Aged 2 Years']
        },
        {
          id: '4',
          name: 'Traditional Brass Tiffin Set',
          description: 'Authentic brass tiffin containers for traditional Indian meals',
          price: 2499,
          originalPrice: 2899,
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300',
          category: 'kitchenware',
          brand: 'Heritage Crafts',
          unit: '4 piece set',
          rating: 4.8,
          reviewCount: 234,
          inStock: true,
          tags: ['Traditional', 'Handcrafted']
        },
        {
          id: '5',
          name: 'Haldiram\'s Aloo Bhujia',
          description: 'Traditional crispy potato snack with authentic Indian spices',
          price: 220,
          originalPrice: 250,
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          category: 'snacks',
          brand: 'Haldiram\'s',
          unit: '400g',
          rating: 4.4,
          reviewCount: 567,
          inStock: true,
          tags: ['Crispy', 'Traditional']
        },
        {
          id: '6',
          name: 'Patanjali Chyawanprash',
          description: 'Traditional Ayurvedic immunity booster with herbs and amla',
          price: 680,
          image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300',
          category: 'personal-care',
          brand: 'Patanjali',
          unit: '1kg',
          rating: 4.5,
          reviewCount: 723,
          inStock: true,
          tags: ['Ayurvedic', 'Immunity Booster']
        },
        {
          id: '7',
          name: 'Fresh Alphonso Mangoes',
          description: 'Premium Alphonso mangoes directly from Maharashtra farms',
          price: 1200,
          originalPrice: 1500,
          image: 'https://images.unsplash.com/photo-1591206369811-4eeb2f03bc95?w=300',
          category: 'fresh-produce',
          brand: 'Farm Fresh',
          unit: '2kg box',
          rating: 4.9,
          reviewCount: 234,
          inStock: true,
          tags: ['Fresh', 'Seasonal', 'Tropical']
        },
        {
          id: '8',
          name: 'Amul Pure Ghee',
          description: 'Traditional cow ghee made from pure milk cream',
          price: 850,
          image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300',
          category: 'dairy',
          brand: 'Amul',
          unit: '1L',
          rating: 4.7,
          reviewCount: 892,
          inStock: true,
          tags: ['Pure', 'Traditional', 'Organic']
        },
        {
          id: '9',
          name: 'Cardamom Green Pods',
          description: 'Premium green cardamom pods from Kerala hills',
          price: 2400,
          originalPrice: 2800,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'Kerala Spices',
          unit: '250g',
          rating: 4.8,
          reviewCount: 156,
          inStock: true,
          tags: ['Premium', 'Whole Spices', 'Aromatic']
        },
        {
          id: '10',
          name: 'Toor Dal Premium',
          description: 'High quality yellow lentils perfect for dal preparation',
          price: 180,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          category: 'staples',
          brand: 'Everest',
          unit: '1kg',
          rating: 4.3,
          reviewCount: 445,
          inStock: true,
          tags: ['Lentils', 'Protein Rich', 'Daily Essential']
        }
      ];

      // Add mock products to Redux store
      dispatch(setProducts(mockProducts));
      setProductsState(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPurchases = () => {
    // Mock recent purchases for "Buy Again" feature
    const recentItems = products.slice(0, 4);
    setRecentPurchases(recentItems);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      product: {
        id: product.id,
        name: product.name,
        description: `${product.brand} ${product.name}`,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        brand: product.brand,
        unit: product.unit,
        inStock: product.inStock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        tags: product.tags
      },
      quantity: 1
    }));
    
    // Add loyalty points
    const pointsEarned = Math.floor(product.price * 0.1);
    setLoyaltyPoints(prev => prev + pointsEarned);
    
    toast.success(`${product.name} added to cart (+${pointsEarned} points)`);
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        toast.success(`Voice search: "${transcript}"`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice search failed');
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      toast.error('Voice search not supported in this browser');
    }
  };

  const handleImageSearch = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock image recognition
      const mockResults = ['milk', 'bananas', 'bread', 'eggs'];
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setSearchQuery(randomResult);
      toast.success(`Image recognized: ${randomResult}`);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Subcategory filtering - check if product matches selected subcategory by tags or name
    const matchesSubcategory = selectedSubcategory === 'all' || 
                               product.tags.some(tag => tag.toLowerCase().includes(selectedSubcategory.toLowerCase())) ||
                               product.name.toLowerCase().includes(selectedSubcategory.toLowerCase());
    
    const matchesDiet = selectedDietFilter === 'all' || 
                       product.tags.some(tag => tag.toLowerCase().includes(selectedDietFilter)) ||
                       (selectedDietFilter === 'organic' && product.tags.includes('Organic'));
    
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesDiet;
  });


  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for groceries, electronics, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <button
              onClick={handleVoiceSearch}
              disabled={isListening}
              className={`p-3 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Voice Search"
            >
              <FiMic className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleImageSearch}
              className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
              title="Image Search"
            >
              <FiCamera className="h-5 w-5" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-white">🇮🇳</span>
                <span>Shipped from India</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white">🇺🇸</span>
                <span>Delivered to USA</span>
              </div>
              <div className="flex items-center gap-2">
                <FiStar className="h-4 w-4" />
                <span>{loyaltyPoints} points</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">🌱</span>
                <span>{carbonSaved}kg CO₂ saved</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDeliveryOptions(!showDeliveryOptions)}
                className="flex items-center gap-2 hover:bg-green-600 px-3 py-1 rounded"
              >
                <FiTruck className="h-4 w-4" />
                <span>Shipping Options</span>
              </button>
              <button
                onClick={() => setShowGroupOrder(!showGroupOrder)}
                className="flex items-center gap-2 hover:bg-green-600 px-3 py-1 rounded"
              >
                <FiUsers className="h-4 w-4" />
                <span>Group Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Options Modal */}
      {showDeliveryOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Choose Shipping Option</h3>
            <div className="space-y-3">
              {deliverySlots.map(slot => (
                <div
                  key={slot.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDeliverySlot === slot.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDeliverySlot(slot.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {slot.time}
                        {slot.isGreen && <span className="text-green-600">🌱</span>}
                      </div>
                      {slot.carbonSaved > 0 && (
                        <div className="text-sm text-green-600">
                          Save {slot.carbonSaved}kg CO₂
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {slot.price === 0 ? (
                        <span className="text-gray-600">Free</span>
                      ) : slot.price > 0 ? (
                        <span className="text-gray-900">+₹{slot.price}</span>
                      ) : (
                        <span className="text-green-600">₹{Math.abs(slot.price)} off</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeliveryOptions(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeliveryOptions(false);
                  toast.success('Shipping option updated');
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubcategory('all'); // Reset subcategory when changing category
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green-100 text-green-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                    
                    {/* Subcategories */}
                    {selectedCategory === category.id && category.subcategories.length > 0 && (
                      <div className="ml-6 mt-2 space-y-1">
                        <button
                          onClick={() => setSelectedSubcategory('all')}
                          className={`w-full text-left text-xs p-2 rounded transition-colors ${
                            selectedSubcategory === 'all'
                              ? 'bg-green-50 text-green-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          All {category.name}
                        </button>
                        {category.subcategories.map(subcategory => (
                          <button
                            key={subcategory}
                            onClick={() => setSelectedSubcategory(subcategory)}
                            className={`w-full text-left text-xs p-2 rounded transition-colors ${
                              selectedSubcategory === subcategory
                                ? 'bg-green-50 text-green-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {subcategory}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Dietary Preferences</h3>
              <div className="space-y-2">
                {dietaryFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedDietFilter(filter.id)}
                    className={`w-full p-2 rounded-lg text-left text-sm transition-colors ${
                      selectedDietFilter === filter.id
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Again */}
            {recentPurchases.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Buy Again</h3>
                <div className="space-y-3">
                  {recentPurchases.slice(0, 3).map(product => (
                    <div key={product.id} className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">₹{product.price}</div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <FiShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Shipping Information */}
            <div className="grid gap-6 mb-6">
              <ShippingZones />
              <CustomsInfo />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowSubscription(!showSubscription)}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FiRepeat className="h-6 w-6 text-green-600" />
                  <span className="text-sm text-gray-700">Subscriptions</span>
                </button>
                <button
                  onClick={() => setShowGroupOrder(!showGroupOrder)}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FiUsers className="h-6 w-6 text-blue-600" />
                  <span className="text-sm text-gray-700">Group Order</span>
                </button>
                <button
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FiMessageCircle className="h-6 w-6 text-purple-600" />
                  <span className="text-sm text-gray-700">Help Chat</span>
                </button>
                <Link
                  to="/premium"
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FiStar className="h-6 w-6 text-yellow-600" />
                  <span className="text-sm text-gray-700">Go Premium</span>
                </Link>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCategory === 'all' 
                    ? 'All Products' 
                    : categories.find(c => c.id === selectedCategory)?.name || 'Products'
                  }
                </h2>
                {selectedSubcategory !== 'all' && (
                  <span className="text-sm text-gray-500">• {selectedSubcategory}</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </div>
            </div>
            

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery 
                    ? `No products match "${searchQuery}"` 
                    : 'No products in this category yet'
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                    setSelectedDietFilter('all');
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.tags.includes('Organic') && (
                      <span className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        🌱 Organic
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                    <button
                      className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                      title="Add to Wishlist"
                    >
                      <FiHeart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand} • {product.unit}</p>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">{product.rating}</span>
                      <span className="text-sm text-gray-400">({product.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <FiClock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">7-12 days</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <CurrencyConverter inrPrice={product.price} />
                        {product.originalPrice && (
                          <div className="text-xs text-gray-500">
                            <CurrencyConverter inrPrice={product.originalPrice} className="line-through" />
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    

                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Instamart Assistant</h3>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">Hi! I'm your Instamart assistant. How can I help you today?</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg ml-8">
                <p className="text-sm">Where is my order?</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">Your order #IM12345 is being prepared and will be delivered in 12 minutes. You can track it in real-time!</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstamartPage;
