import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import CurrencyConverter from '../components/International/CurrencyConverter';
import LogoMarquee from '../components/Grocery/LogoMarquee';
import { apiClient } from '../utils/api';

// Grocery-specific categories (matching the product form)
const groceryCategories = [
  {
    id: 'spices',
    name: 'Spices & Masalas',
    icon: '🌶️',
    slug: 'grocery',
    subcategories: ['Whole Spices', 'Ground Spices', 'Garam Masala', 'Regional Masalas', 'Organic Spices', 'Spice Blends']
  },
  {
    id: 'staples',
    name: 'Staples & Grains',
    icon: '🌾',
    slug: 'grocery',
    subcategories: ['Basmati Rice', 'Regional Rice', 'Lentils & Pulses', 'Cooking Oils', 'Flour & Grains', 'Sugar & Jaggery']
  },
  {
    id: 'snacks',
    name: 'Snacks & Namkeens',
    icon: '🥨',
    slug: 'snacks',
    subcategories: ['Namkeens', 'Traditional Sweets', 'Chips & Crackers', 'Dry Fruits', 'Ready-to-Eat', 'Frozen Foods']
  },
  {
    id: 'tea-coffee',
    name: 'Tea & Coffee',
    icon: '☕',
    slug: 'roastery',
    subcategories: ['Assam Tea', 'Darjeeling Tea', 'South Indian Coffee', 'Green Tea', 'Health Drinks', 'Traditional Drinks']
  },
  {
    id: 'fresh-produce',
    name: 'Fresh Produce',
    icon: '🥭',
    slug: 'fruits-vegetables',
    subcategories: ['Tropical Fruits', 'Indian Vegetables', 'Fresh Herbs', 'Organic Produce', 'Seasonal Fruits', 'Exotic Vegetables']
  },
  {
    id: 'dairy',
    name: 'Dairy Products',
    icon: '🥛',
    slug: 'dairy-eggs',
    subcategories: ['Paneer & Cheese', 'Milk Products', 'Yogurt & Curd', 'Butter & Ghee', 'Plant-based Alternatives']
  },
  {
    id: 'ayurveda',
    name: 'Ayurveda & Wellness',
    icon: '🌿',
    slug: 'beauty-cosmetics',
    subcategories: ['Ayurvedic Medicine', 'Hair Care', 'Skin Care', 'Immunity Boosters', 'Herbal Teas', 'Traditional Beauty']
  },
  {
    id: 'kitchenware',
    name: 'Indian Kitchenware',
    icon: '🥘',
    slug: 'household',
    subcategories: ['Pressure Cookers', 'Traditional Utensils', 'Storage Containers', 'Spice Boxes', 'Cookware']
  },
];

// Category menu data (same as Header) - keeping for backward compatibility
const categoryMenu = [
  {
    id: 'beauty-cosmetics',
    name: 'BEAUTY & COSMETICS',
    icon: '💄',
    subcategories: ['SKINCARE', 'COSMETICS ITEMS', 'FACE CARE', 'BABY CARE', 'DENTAL CARE', 'PERSONAL CARE', 'HAIR CARE', 'MEDICINE', 'HAND WASH', 'MORE']
  },
  {
    id: 'grocery',
    name: 'GROCERY',
    icon: '🛒',
    subcategories: ['Spices & Masalas', 'Staples & Grains', 'Snacks & Namkeens', 'Beverages', 'Fresh Produce', 'Dairy Products']
  },
  {
    id: 'stationery',
    name: 'STATIONERY',
    icon: '📝',
    subcategories: ['Pens & Pencils', 'Notebooks', 'Office Supplies', 'Art Supplies', 'School Supplies']
  },
  {
    id: 'fruits-vegetables',
    name: 'FRUITS & VEGETABLES',
    icon: '🍎',
    subcategories: ['Fresh Fruits', 'Fresh Vegetables', 'Organic Produce', 'Exotic Fruits', 'Seasonal Vegetables']
  },
  {
    id: 'outdoor',
    name: 'OUTDOOR',
    icon: '⛺',
    subcategories: ['Camping Gear', 'Outdoor Furniture', 'Garden Supplies', 'BBQ & Grilling']
  },
  {
    id: 'household',
    name: 'HOUSEHOLD',
    icon: '🏠',
    subcategories: ['Cleaning Supplies', 'Home Decor', 'Kitchenware', 'Storage Solutions', 'Bedding & Bath']
  },
  {
    id: 'snacks-refreshments',
    name: 'SNACKS & REFRESHMENTS',
    icon: '🥤',
    subcategories: ['Chips & Crackers', 'Beverages', 'Candy & Sweets', 'Energy Drinks', 'Juices']
  },
  {
    id: 'dairy',
    name: 'GOODS AND DAIRY',
    icon: '🥛',
    subcategories: ['Milk Products', 'Cheese', 'Yogurt', 'Butter & Ghee', 'Plant-based Alternatives']
  },
  {
    id: 'roastery',
    name: 'ROASTERY',
    icon: '☕',
    subcategories: ['Coffee Beans', 'Roasted Nuts', 'Coffee Products', 'Tea Selection']
  },
  {
    id: 'fishery',
    name: 'FISHERY',
    icon: '🐟',
    subcategories: ['Fresh Fish', 'Frozen Seafood', 'Canned Fish', 'Fish Products']
  },
  {
    id: 'bakery',
    name: 'BAKERY',
    icon: '🍞',
    subcategories: ['Fresh Bread', 'Pastries', 'Cakes', 'Cookies', 'Traditional Breads']
  },
  {
    id: 'delicatessen',
    name: 'DELICATESSEN',
    icon: '🥗',
    subcategories: ['Cold Cuts', 'Cheese Selection', 'Olives & Pickles', 'Prepared Foods']
  },
  {
    id: 'butchery',
    name: 'BUTCHERY',
    icon: '🥩',
    subcategories: ['Fresh Meat', 'Poultry', 'Lamb & Goat', 'Processed Meats']
  },
];

// Map category IDs to database slugs
const categorySlugMap: { [key: string]: string } = {
  'beauty-cosmetics': 'beauty-cosmetics',
  'grocery': 'grocery',
  'stationery': 'stationery',
  'fruits-vegetables': 'fruits-vegetables',
  'outdoor': 'outdoor',
  'household': 'household',
  'snacks-refreshments': 'snacks',
  'dairy': 'dairy-eggs',
  'roastery': 'roastery',
  'fishery': 'fishery',
  'bakery': 'bakery',
  'delicatessen': 'delicatessen',
  'butchery': 'butchery',
};

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
  brand: string | null;
  unit: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

const GroceryPage: React.FC = () => {
  const { category: categoryId } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('groceryCategory') || categoryId || null
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    searchParams.get('subcategory') || null
  );
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [brandLogos] = useState<Array<{ id: string; name: string; image?: string; url?: string }>>([
    {
      id: 'logo1',
      name: 'Kellogg\'s',
      url: 'https://www.kelloggs.com'
    },
    {
      id: 'logo2',
      name: 'MDH',
      url: 'https://www.mdhspices.com'
    },
    {
      id: 'logo3',
      name: 'India Gate',
      url: 'https://www.indiagate.com'
    },
    {
      id: 'logo4',
      name: 'Haldiram\'s',
      url: 'https://www.haldirams.com'
    },
    {
      id: 'logo5',
      name: 'Tata',
      url: 'https://www.tata.com'
    },
    {
      id: 'logo6',
      name: 'Everest',
      url: 'https://www.everestspices.com'
    },
    {
      id: 'logo7',
      name: 'Aashirvaad',
      url: 'https://www.aashirvaad.com'
    },
    {
      id: 'logo8',
      name: 'Fortune',
      url: 'https://www.fortuneoils.com'
    },
    {
      id: 'logo9',
      name: 'Club',
      url: '#'
    },
    {
      id: 'logo10',
      name: 'Pearl Milling',
      url: '#'
    }
  ]);

  // Get category data from grocery categories or menu
  const currentGroceryCategory = selectedCategory 
    ? groceryCategories.find(cat => cat.id === selectedCategory)
    : null;
  
  const currentCategory = categoryId 
    ? categoryMenu.find(cat => cat.id === categoryId)
    : currentGroceryCategory ? {
        id: currentGroceryCategory.id,
        name: currentGroceryCategory.name,
        icon: currentGroceryCategory.icon,
        subcategories: currentGroceryCategory.subcategories
      }
    : null;

  // Get database slug for API
  const categorySlug = currentGroceryCategory 
    ? currentGroceryCategory.slug 
    : (categoryId ? categorySlugMap[categoryId] : null);

  useEffect(() => {
    const groceryCategory = searchParams.get('groceryCategory');
    const subcategory = searchParams.get('subcategory');
    const urlCategory = categoryId;
    
    if (groceryCategory) {
      setSelectedCategory(groceryCategory);
    } else if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
    
    setSelectedSubcategory(subcategory);
  }, [searchParams, categoryId]);

  useEffect(() => {
    if (categorySlug) {
      loadProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, categorySlug, sortBy]);

  const loadProducts = async () => {
    if (!categorySlug) return;
    
    setLoading(true);
    try {
      const response = await apiClient.products.getAll({
        category: categorySlug,
        sortBy: sortBy === 'name' ? 'name' : sortBy === 'price-low' ? 'price' : 'price',
        sortOrder: sortBy === 'price-high' ? 'desc' : 'asc',
      });

      setProducts(response.data.products || []);
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      product: {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        originalPrice: product.originalPrice || undefined,
        image: product.image,
        category: product.category.name,
        brand: product.brand || '',
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

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Subcategory filter (if implemented in tags or description)
    if (selectedSubcategory) {
      const subcategoryLower = selectedSubcategory.toLowerCase();
      const matchesSubcategory = 
        product.tags.some(tag => tag.toLowerCase().includes(subcategoryLower)) ||
        product.name.toLowerCase().includes(subcategoryLower) ||
        product.description?.toLowerCase().includes(subcategoryLower);
      
      if (!matchesSubcategory) return false;
    }
    
      return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('groceryCategory', categoryId);
    navigate(`/groceries?${newSearchParams.toString()}`);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (selectedCategory) {
      newSearchParams.set('groceryCategory', selectedCategory);
    }
    newSearchParams.set('subcategory', subcategory.toLowerCase());
    navigate(`/groceries?${newSearchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header - Show when no category selected */}
      {!currentCategory && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Groceries</h1>
            <p className="text-gray-600">Select a category to browse products</p>
          </div>
        </div>
      )}

      {/* Category Header */}
      {currentCategory && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="text-5xl mb-4">{currentCategory.icon}</div>
              <h1 className="text-4xl font-bold mb-4">{currentCategory.name}</h1>
              <p className="text-xl text-green-100">
                Browse our selection of {currentCategory.name.toLowerCase()} products
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Featured Brands Marquee */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Brands</h2>
          <LogoMarquee
            logos={brandLogos}
            speed={40}
            direction="right"
          />
        </div>
      </div>

      {/* Subcategories */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {currentCategory.subcategories.map((subcategory) => (
            <button
                key={subcategory}
                onClick={() => {
                  const newSearchParams = new URLSearchParams(searchParams);
                  if (selectedCategory) {
                    newSearchParams.set('groceryCategory', selectedCategory);
                  }
                  if (selectedSubcategory === subcategory.toLowerCase()) {
                    newSearchParams.delete('subcategory');
                    setSelectedSubcategory(null);
                  } else {
                    newSearchParams.set('subcategory', subcategory.toLowerCase());
                    setSelectedSubcategory(subcategory.toLowerCase());
                  }
                  navigate(`/groceries?${newSearchParams.toString()}`);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSubcategory === subcategory.toLowerCase()
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {subcategory}
            </button>
          ))}
        </div>
        </div>
      </div>
      )}

        {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Category and Subcategory Dropdowns */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a category *
                </label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a category</option>
                  {groceryCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory *
                </label>
                <select
                  value={selectedSubcategory || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSubcategoryChange(e.target.value);
                    } else {
                      const newSearchParams = new URLSearchParams(searchParams);
                      if (selectedCategory) {
                        newSearchParams.set('groceryCategory', selectedCategory);
                      }
                      newSearchParams.delete('subcategory');
                      navigate(`/groceries?${newSearchParams.toString()}`);
                    }
                  }}
                  disabled={!selectedCategory}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a subcategory</option>
                  {currentGroceryCategory?.subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory.toLowerCase()}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info Box */}
            {currentGroceryCategory && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Your products will appear in:</span> {currentGroceryCategory.icon} {currentGroceryCategory.name}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  👀 Customers can find it by filtering this category on the Instamart page.
                </p>
              </div>
            )}
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={currentCategory ? `Search ${currentCategory.name.toLowerCase()}...` : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => window.location.href = `/product/${product.id}`}
                  />
                  {product.originalPrice && (
                    <span className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                        Out of Stock
                  </span>
                    </div>
                )}
              </div>
              
              <div className="p-4">
                  <h3 
                    className="font-semibold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-green-600"
                    onClick={() => window.location.href = `/product/${product.id}`}
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.brand && `${product.brand} • `}{product.unit}
                  </p>
                
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
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
                      disabled={!product.inStock}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                      {product.inStock ? 'Add' : 'Out'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No products match "${searchQuery}"`
                : currentCategory 
                  ? `No products available in ${currentCategory.name} yet.`
                  : 'No products available yet.'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Clear search
              </button>
        )}
      </div>
        )}
      </div>
    </div>
  );
};

export default GroceryPage; 
