import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { setProducts } from '../store/slices/productsSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import CurrencyConverter from '../components/International/CurrencyConverter';
import GroceriesCarousel from '../components/Grocery/GroceriesCarousel';
import RecentlyViewed from '../components/UI/RecentlyViewed';

interface FeaturedProduct {
  id: string;
  name: string;
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
  isOrganic?: boolean;
}

interface GroceryCategory {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  description: string;
  featured: boolean;
}

interface Store {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  specialties: string[];
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { products: storeProducts } = useSelector((state: RootState) => state.products);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [categories, setCategories] = useState<GroceryCategory[]>([]);
  const [topStores, setTopStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyAdProducts, setWeeklyAdProducts] = useState<FeaturedProduct[]>([]);
  const [staplesProducts, setStaplesProducts] = useState<FeaturedProduct[]>([]);
  const [spicesProducts, setSpicesProducts] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    loadHomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      // Featured Indian Grocery Categories
      const mockCategories: GroceryCategory[] = [
        {
          id: 'staples',
          name: 'Staples & Grains',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          itemCount: 85,
          description: 'Rice, wheat flour, lentils, cooking oils',
          featured: true
        },
        {
          id: 'spices',
          name: 'Spices & Masalas',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          itemCount: 120,
          description: 'Authentic Indian spices and masala blends',
          featured: true
        },
        {
          id: 'fresh-produce',
          name: 'Fresh Produce',
          image: 'https://images.unsplash.com/photo-1546470427-e92bb2f8e4b0?w=300',
          itemCount: 75,
          description: 'Farm-fresh vegetables and fruits',
          featured: true
        },
        {
          id: 'snacks',
          name: 'Snacks & Namkeens',
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          itemCount: 95,
          description: 'Traditional Indian snacks and sweets',
          featured: true
        },
        {
          id: 'dairy',
          name: 'Dairy Products',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
          itemCount: 45,
          description: 'Fresh milk, paneer, and dairy products',
          featured: false
        },
        {
          id: 'beverages',
          name: 'Beverages',
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300',
          itemCount: 65,
          description: 'Tea, coffee, and traditional drinks',
          featured: false
        }
      ];

      // Featured Products
      const mockFeaturedProducts: FeaturedProduct[] = [
        {
          id: '1',
          name: 'Basmati Rice Premium',
          price: 285,
          originalPrice: 320,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          category: 'staples',
          brand: 'India Gate',
          unit: '5kg',
          rating: 4.6,
          reviewCount: 1248,
          inStock: true,
          tags: ['Premium', 'Aged', 'Aromatic'],
          isOrganic: true
        },
        {
          id: '2',
          name: 'Garam Masala Powder',
          price: 95,
          originalPrice: 110,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'MDH',
          unit: '100g',
          rating: 4.4,
          reviewCount: 856,
          inStock: true,
          tags: ['Authentic', 'Fresh', 'Traditional']
        },
        {
          id: '3',
          name: 'Fresh Tomatoes',
          price: 40,
          image: 'https://images.unsplash.com/photo-1546470427-e92bb2f8e4b0?w=300',
          category: 'fresh-produce',
          brand: 'Fresh Farm',
          unit: '1kg',
          rating: 4.2,
          reviewCount: 234,
          inStock: true,
          tags: ['Fresh', 'Farm Direct']
        },
        {
          id: '4',
          name: 'Haldiram\'s Bhujia',
          price: 45,
          originalPrice: 50,
          image: 'https://images.unsplash.com/photo-1599599810694-57a2ca3bf6f1?w=300',
          category: 'snacks',
          brand: 'Haldiram\'s',
          unit: '150g',
          rating: 4.4,
          reviewCount: 567,
          inStock: true,
          tags: ['Crispy', 'Spicy', 'Traditional']
        }
      ];

      // Top Stores
      const mockStores: Store[] = [
        {
          id: '1',
          name: 'Sharma Grocery Store',
          image: 'https://images.unsplash.com/photo-1555982105-d25af4182e4e?w=300',
          rating: 4.5,
          deliveryTime: '25-35 mins',
          specialties: ['Fresh Vegetables', 'Spices', 'Regional Specialties']
        },
        {
          id: '2',
          name: 'Spice Paradise',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          rating: 4.7,
          deliveryTime: '30-40 mins',
          specialties: ['Premium Spices', 'Organic Products', 'Masala Blends']
        },
        {
          id: '3',
          name: 'Fresh Farm Market',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300',
          rating: 4.4,
          deliveryTime: '15-25 mins',
          specialties: ['Organic Vegetables', 'Fresh Fruits', 'Daily Harvest']
        }
      ];

      setCategories(mockCategories);
      
      // Use store products if available, otherwise use mock products
      if (storeProducts.length > 0) {
        // Convert store products to featured products format
        const featuredFromStore = storeProducts.slice(0, 4).map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
          brand: product.brand,
          unit: product.unit,
          rating: product.rating,
          reviewCount: product.reviewCount,
          inStock: product.inStock,
          tags: product.tags,
          isOrganic: product.tags.includes('Organic')
        }));
        setFeaturedProducts([...featuredFromStore, ...mockFeaturedProducts]);
      } else {
        setFeaturedProducts(mockFeaturedProducts);
        // Add mock products to store for future use
        const storeProducts = mockFeaturedProducts.map(product => ({
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
        }));
        dispatch(setProducts(storeProducts));
      }
      
      // Weekly Ad Products (on sale)
      const mockWeeklyAdProducts: FeaturedProduct[] = [
        {
          id: 'wa2',
          name: 'Red Mango',
          price: 75,
          originalPrice: 135,
          image: 'https://images.unsplash.com/photo-1605027990121-cbae7f59c4e5?w=300',
          category: 'fresh-produce',
          brand: 'Tropical',
          unit: '1 lb',
          rating: 4.6,
          reviewCount: 189,
          inStock: true,
          tags: ['Fresh', 'Sale']
        },
        {
          id: 'wa1',
          name: 'Hass Avocado (Large)',
          price: 75,
          originalPrice: 260,
          image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300',
          category: 'fresh-produce',
          brand: 'Fresh Farm',
          unit: '1 lb',
          rating: 4.5,
          reviewCount: 234,
          inStock: true,
          tags: ['Fresh', 'Sale']
        },
        {
          id: 'wa3',
          name: 'Frosted Flakes Cereal',
          price: 300,
          originalPrice: 1050,
          image: 'https://images.unsplash.com/photo-1618202133209-5475d14473b3?w=300',
          category: 'snacks',
          brand: 'Kellogg\'s',
          unit: '2 ct',
          rating: 4.4,
          reviewCount: 567,
          inStock: true,
          tags: ['Sale', 'Breakfast']
        },
        {
          id: 'wa4',
          name: 'Club Original Crackers',
          price: 225,
          originalPrice: 485,
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300',
          category: 'snacks',
          brand: 'Club',
          unit: '13.7 oz',
          rating: 4.3,
          reviewCount: 342,
          inStock: true,
          tags: ['Sale', 'Snacks']
        },
        {
          id: 'wa5',
          name: 'Granny Smith Apple',
          price: 54,
          originalPrice: 110,
          image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=300',
          category: 'fresh-produce',
          brand: 'Fresh Farm',
          unit: '1 lb',
          rating: 4.5,
          reviewCount: 456,
          inStock: true,
          tags: ['Fresh', 'Sale']
        },
        {
          id: 'wa6',
          name: 'Pearl Milling Syrup',
          price: 265,
          originalPrice: 475,
          image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300',
          category: 'staples',
          brand: 'Pearl Milling',
          unit: '24 fl oz',
          rating: 4.2,
          reviewCount: 278,
          inStock: true,
          tags: ['Sale', 'Breakfast']
        }
      ];
      setWeeklyAdProducts(mockWeeklyAdProducts);

      // Staples & Grains Products
      const mockStaplesProducts: FeaturedProduct[] = [
        {
          id: 'st1',
          name: 'Basmati Rice Premium',
          price: 285,
          originalPrice: 320,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=300',
          category: 'staples',
          brand: 'India Gate',
          unit: '5kg',
          rating: 4.6,
          reviewCount: 1248,
          inStock: true,
          tags: ['Premium', 'Aged']
        },
        {
          id: 'st2',
          name: 'Toor Dal (Split Pigeon Peas)',
          price: 120,
          image: 'https://images.unsplash.com/photo-1606923829573-5c7b3b5e5b5b?w=300',
          category: 'staples',
          brand: 'Tata',
          unit: '1kg',
          rating: 4.5,
          reviewCount: 856,
          inStock: true,
          tags: ['Premium']
        },
        {
          id: 'st3',
          name: 'Mustard Oil',
          price: 180,
          originalPrice: 200,
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacb8fa73f?w=300',
          category: 'staples',
          brand: 'Fortune',
          unit: '1L',
          rating: 4.4,
          reviewCount: 634,
          inStock: true,
          tags: ['Pure', 'Cold Pressed']
        },
        {
          id: 'st4',
          name: 'Wheat Flour (Atta)',
          price: 95,
          image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300',
          category: 'staples',
          brand: 'Aashirvaad',
          unit: '5kg',
          rating: 4.5,
          reviewCount: 923,
          inStock: true,
          tags: ['Whole Wheat']
        },
        {
          id: 'st5',
          name: 'Chana Dal (Split Chickpeas)',
          price: 110,
          image: 'https://images.unsplash.com/photo-1606923829573-5c7b3b5e5b5b?w=300',
          category: 'staples',
          brand: 'Tata',
          unit: '1kg',
          rating: 4.4,
          reviewCount: 567,
          inStock: true,
          tags: ['Premium']
        },
        {
          id: 'st6',
          name: 'Sugar (White)',
          price: 45,
          image: 'https://images.unsplash.com/photo-1611250502910-0e0b2b0e0b0b?w=300',
          category: 'staples',
          brand: 'Madhur',
          unit: '1kg',
          rating: 4.3,
          reviewCount: 234,
          inStock: true,
          tags: ['Pure']
        }
      ];
      setStaplesProducts(mockStaplesProducts);

      // Spices & Masalas Products
      const mockSpicesProducts: FeaturedProduct[] = [
        {
          id: 'sp1',
          name: 'Garam Masala Powder',
          price: 95,
          originalPrice: 110,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'MDH',
          unit: '100g',
          rating: 4.4,
          reviewCount: 856,
          inStock: true,
          tags: ['Authentic', 'Fresh']
        },
        {
          id: 'sp2',
          name: 'Turmeric Powder (Haldi)',
          price: 85,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'Everest',
          unit: '200g',
          rating: 4.5,
          reviewCount: 1023,
          inStock: true,
          tags: ['Pure', 'Organic']
        },
        {
          id: 'sp3',
          name: 'Red Chili Powder',
          price: 75,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'MDH',
          unit: '200g',
          rating: 4.3,
          reviewCount: 678,
          inStock: true,
          tags: ['Hot', 'Spicy']
        },
        {
          id: 'sp4',
          name: 'Cumin Seeds (Jeera)',
          price: 120,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'Everest',
          unit: '200g',
          rating: 4.6,
          reviewCount: 789,
          inStock: true,
          tags: ['Whole', 'Premium']
        },
        {
          id: 'sp5',
          name: 'Coriander Powder',
          price: 80,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'MDH',
          unit: '200g',
          rating: 4.4,
          reviewCount: 567,
          inStock: true,
          tags: ['Fresh', 'Aromatic']
        },
        {
          id: 'sp6',
          name: 'Cardamom Green Pods',
          price: 450,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
          category: 'spices',
          brand: 'Everest',
          unit: '50g',
          rating: 4.7,
          reviewCount: 456,
          inStock: true,
          tags: ['Premium', 'Whole']
        }
      ];
      setSpicesProducts(mockSpicesProducts);
      
      setTopStores(mockStores);
    } catch (error) {
      console.error('Error loading home data:', error);
      toast.error('Failed to load home data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: FeaturedProduct) => {
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
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-5xl font-bold">
                  Welcome to <span className="text-yellow-300">FreshBazaar</span>
                </h1>
                <button
                  onClick={() => window.location.href = '/instamart'}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <span className="text-lg">⚡</span>
                  Select Here
                </button>
              </div>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Bringing authentic Indian products from India to USA. From traditional spices to regional specialties,
                we deliver the taste of India directly to your American doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/groceries"
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                >
                  Shop Groceries
                </Link>
                <Link
                  to="/stores"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors text-center"
                >
                  Browse Stores
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-8 text-green-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇮🇳</span>
                  <span>Shipped from India</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇺🇸</span>
                  <span>Delivered to USA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  <span>Customs included</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
                alt="Fresh Indian Groceries"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-gray-900 px-6 py-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Products Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Groceries Section - Below Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop the Weekly Ad */}
        <div className="mb-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Shop the Weekly Ad!</h2>
              <p className="text-gray-600 text-sm md:text-base">Sale ends in 5 days</p>
            </div>
            <Link
              to="/groceries?category=snacks"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm md:text-base"
            >
              View all (900+)
              <span>→</span>
            </Link>
          </div>

          {/* Products Carousel */}
          <GroceriesCarousel
            title=""
            subtitle=""
            products={weeklyAdProducts}
            viewAllLink="/groceries?category=snacks"
            scrollToRight={true}
            marquee={true}
            marqueeSpeed={30}
            marqueeDirection="right"
          />
        </div>

        {/* Staples & Grains */}
        <GroceriesCarousel
          title="Shop All Things Staples & Grains"
          subtitle="Essential Indian staples for your kitchen"
          products={staplesProducts}
          viewAllLink="/groceries?groceryCategory=staples"
          viewAllCount={85}
          marquee={true}
          marqueeSpeed={30}
          marqueeDirection="left"
        />

        {/* Spices & Masalas */}
        <GroceriesCarousel
          title="Shop All Things Spices & Masalas"
          subtitle="Authentic Indian spices and masala blends"
          products={spicesProducts}
          viewAllLink="/groceries?groceryCategory=spices"
          viewAllCount={120}
        />
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 text-lg">
            Discover authentic Indian groceries across our curated categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.filter(cat => cat.featured).map(category => (
            <Link
              key={category.id}
              to={`/groceries/${category.id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <span className="text-green-600 text-sm font-medium">
                  {category.itemCount} items →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Products</h2>
              <p className="text-gray-600">Popular choices among our customers</p>
            </div>
            <Link
              to="/groceries"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.isOrganic && (
                    <span className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      🌱 Organic
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.brand} • {product.unit}</p>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                    <span className="text-sm text-gray-400">({product.reviewCount})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <CurrencyConverter inrPrice={product.price} className="text-lg font-bold" />
                      {product.originalPrice && (
                        <CurrencyConverter inrPrice={product.originalPrice} className="text-sm text-gray-500 line-through ml-2" />
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
        </div>
      </div>

      {/* Top Stores */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Stores Near You</h2>
          <p className="text-gray-600">Trusted local stores with the freshest groceries</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {topStores.map(store => (
            <Link
              key={store.id}
              to={`/store/${store.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{store.name}</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-green-600 font-semibold">★ {store.rating}</span>
                  </div>
                  <span className="text-gray-600 text-sm">{store.deliveryTime}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {store.specialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewed />

      {/* CTA Section */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Taste India?</h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of customers who trust Instamart for authentic Indian products delivered to USA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/groceries"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Shopping
              </Link>
              <Link
                to="/premium"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Get Premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 