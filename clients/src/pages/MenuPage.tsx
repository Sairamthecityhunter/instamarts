import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronRight } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { apiClient } from '../utils/api';
import { getCategoryImage } from '../utils/images';
import ProductCard from '../components/UI/ProductCard';

// Category menu data (same as Header)
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
  images?: string[];
  category: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
  };
  brand: string | null;
  unit: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  stock?: number;
}

const MenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') || null
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    searchParams.get('subcategory') || null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  // Get category data from menu
  const currentCategory = selectedCategory 
    ? categoryMenu.find(cat => cat.id === selectedCategory)
    : null;


  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    
    // Scroll to top when category changes
    if (category) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory && categorySlugMap[selectedCategory]) {
      loadProducts();
    } else {
      setProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy]);

  const loadProducts = async () => {
    if (!selectedCategory || !categorySlugMap[selectedCategory]) {
      setProducts([]);
      return;
    }
    
    const slug = categorySlugMap[selectedCategory];
    setLoading(true);
    try {
      const response = await apiClient.products.getAll({
        category: slug,
        sortBy: sortBy === 'name' ? 'name' : sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? 'price' : 'name',
        sortOrder: sortBy === 'price-high' ? 'desc' : 'asc',
        limit: 100, // Get more products
      });

      // Handle different response structures
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      }
      
      console.log(`Loaded ${productsData.length} products for category: ${slug}`);
      setProducts(productsData);
      
      if (productsData.length === 0) {
        console.warn(`No products found for category: ${slug}`);
        // Don't show error toast for empty results, just log it
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Don't show duplicate error messages - the API interceptor already handles network errors
      // Only show specific error messages for server errors that aren't handled by interceptor
      if (error.response) {
        // Server responded with error status
        // Interceptor handles 401, so we don't need to show it again
        // For other errors, let the interceptor handle it (it already shows toast)
        // We just need to handle the case where products array might be in different format
      } else if (error.request && !error.response) {
        // Network error - interceptor already shows toast, so we don't need to show another
        console.warn('Network error detected - interceptor will show error message');
      }
      
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/menu?category=${categoryId}`);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('subcategory', subcategory.toLowerCase());
    navigate(`/menu?${newSearchParams.toString()}`);
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
    
    // Subcategory filter
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


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Horizontal Scrollable Category Cards */}
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto scrollbar-hide gap-4 pb-2">
            {categoryMenu.map((category) => {
              // Map category names to display names
              const displayName = category.name === 'BEAUTY & COSMETICS' ? 'Beauty' :
                                category.name === 'FRUITS & VEGETABLES' ? 'Fruits & Vegetables' :
                                category.name === 'SNACKS & REFRESHMENTS' ? 'Snacks' :
                                category.name === 'GOODS AND DAIRY' ? 'Dairy' :
                                category.name;
              
              // Get image path for category (use images for all categories)
              const categoryImage = getCategoryImage(category.id);
              const hasImageError = imageErrors[category.id];
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`relative flex-shrink-0 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden w-36 h-40 flex flex-col items-center justify-center ${
                    selectedCategory === category.id ? 'ring-2 ring-green-800' : ''
                  }`}
                  style={categoryImage && !hasImageError ? {
                    backgroundImage: `url(${categoryImage})`,
                    backgroundSize: '100%',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#f8f9fa'
                  } : {
                    backgroundColor: '#ffffff'
                  }}
                >
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
                    {categoryImage && !hasImageError ? (
                      <>
                        {/* Spacer to push name to bottom */}
                        <div></div>
                        {/* Show name at bottom of image */}
                        <span className="text-sm font-bold text-black text-center bg-white bg-opacity-80 px-2 py-1 rounded mb-2">
                          {displayName}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl mb-2">{category.icon}</div>
                        <span className="text-sm font-medium text-gray-700 text-center">
                          {displayName}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Error handler */}
                  {categoryImage && !hasImageError && (
                    <img 
                      src={categoryImage} 
                      alt=""
                      className="hidden"
                      onError={(e) => {
                        console.error('Image failed to load:', categoryImage, e);
                        // Mark image as failed to load, fallback to emoji
                        setImageErrors(prev => ({ ...prev, [category.id]: true }));
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', categoryImage);
                      }}
                    />
                  )}
                </button>
              );
            })}
            {/* Right Arrow Indicator */}
            <div className="flex-shrink-0 flex items-center justify-center w-8">
              <FiChevronRight className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Header - Only show when category is selected */}
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

      {/* Subcategories - Only show when category is selected */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2">
              {currentCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => handleSubcategoryClick(subcategory)}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar - Only show when category is selected */}
        {currentCategory && (
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${currentCategory.name.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Products View - Show when category is selected */}
        {currentCategory && (
          <>
            {/* Sort Options */}
            <div className="mb-6">
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

            {/* Products Grid */}
            {loading ? (
              <LoadingSpinner />
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    showQuickView={true}
                    showWishlist={true}
                    showShare={true}
                    showStockIndicator={true}
                    showBadges={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-gray-400 text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-2">
                  {searchQuery 
                    ? `No products match "${searchQuery}"`
                    : products.length === 0
                    ? `No products available in ${currentCategory.name} yet. Please check if the database has been seeded.`
                    : `No products match your current filters.`
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
                {selectedSubcategory && (
                  <button
                    onClick={() => {
                      const newSearchParams = new URLSearchParams(searchParams);
                      newSearchParams.delete('subcategory');
                      navigate(`/menu?${newSearchParams.toString()}`);
                    }}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium ml-4"
                  >
                    Clear subcategory filter
                  </button>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default MenuPage;
