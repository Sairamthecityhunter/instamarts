import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CurrencyConverter from '../components/International/CurrencyConverter';
import { RootState } from '../store/store';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';

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
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { products: storeProducts } = useSelector((state: RootState) => state.products);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    inStock: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  // Update when store products change
  useEffect(() => {
    if (storeProducts.length > 0) {
      setProducts(storeProducts);
      // Update category counts
      const categoryCounts = storeProducts.reduce((acc: { [key: string]: number }, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});

      const updatedCategories = [
        { id: 'all', name: 'All Products', icon: '🛍️', count: storeProducts.length },
        { id: 'spices', name: 'Spices & Masalas', icon: '🌶️', count: categoryCounts['spices'] || 0 },
        { id: 'staples', name: 'Staples & Grains', icon: '🌾', count: categoryCounts['staples'] || 0 },
        { id: 'snacks', name: 'Snacks & Namkeens', icon: '🥨', count: categoryCounts['snacks'] || 0 },
        { id: 'beverages', name: 'Tea & Coffee', icon: '☕', count: categoryCounts['beverages'] || 0 },
        { id: 'fresh-produce', name: 'Fresh Produce', icon: '🥭', count: categoryCounts['fresh-produce'] || 0 },
        { id: 'dairy', name: 'Dairy Products', icon: '🥛', count: categoryCounts['dairy'] || 0 },
        { id: 'personal-care', name: 'Ayurveda & Wellness', icon: '🌿', count: categoryCounts['personal-care'] || 0 },
        { id: 'kitchenware', name: 'Indian Kitchenware', icon: '🍳', count: categoryCounts['kitchenware'] || 0 }
      ];

      setCategories(updatedCategories);
    }
  }, [storeProducts]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Use products from Redux store if available
      if (storeProducts.length > 0) {
        setProducts(storeProducts);
        // Calculate category counts from store products
        const categoryCounts = storeProducts.reduce((acc: { [key: string]: number }, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});

        const updatedCategories = [
          { id: 'all', name: 'All Products', icon: '🛍️', count: storeProducts.length },
          { id: 'spices', name: 'Spices & Masalas', icon: '🌶️', count: categoryCounts['spices'] || 0 },
          { id: 'staples', name: 'Staples & Grains', icon: '🌾', count: categoryCounts['staples'] || 0 },
          { id: 'snacks', name: 'Snacks & Namkeens', icon: '🥨', count: categoryCounts['snacks'] || 0 },
          { id: 'beverages', name: 'Tea & Coffee', icon: '☕', count: categoryCounts['beverages'] || 0 },
          { id: 'fresh-produce', name: 'Fresh Produce', icon: '🥭', count: categoryCounts['fresh-produce'] || 0 },
          { id: 'dairy', name: 'Dairy Products', icon: '🥛', count: categoryCounts['dairy'] || 0 },
          { id: 'personal-care', name: 'Ayurveda & Wellness', icon: '🌿', count: categoryCounts['personal-care'] || 0 },
          { id: 'kitchenware', name: 'Indian Kitchenware', icon: '🍳', count: categoryCounts['kitchenware'] || 0 }
        ];

        setCategories(updatedCategories);
        setIsLoading(false);
        return;
      }
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data.products || []);
      
      // Generate categories from products
      const categoryMap = new Map<string, number>();
      data.products?.forEach((product: Product) => {
        categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
      });
      
      const categoryList: Category[] = [
        { id: 'all', name: 'All Products', icon: '🛍️', count: data.products?.length || 0 },
        ...Array.from(categoryMap.entries()).map(([category, count]) => ({
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          icon: getCategoryIcon(category),
          count,
        })),
      ];
      
      setCategories(categoryList);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      fruits: '🍎',
      vegetables: '🥬',
      dairy: '🥛',
      bakery: '🍞',
      beverages: '🥤',
      snacks: '🍿',
      household: '🧽',
      personal: '🧴',
    };
    return icons[category] || '📦';
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = !filters.brand || product.brand.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesStock = !filters.inStock || product.inStock;
    const matchesPrice = (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
                        (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));
    
    return matchesCategory && matchesSearch && matchesBrand && matchesStock && matchesPrice;
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600">Discover fresh groceries and household essentials</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
            <div>
              <select
                value={filters.brand}
                onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Brands</option>
                {Array.from(new Set(products.map(p => p.brand))).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border text-center transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-100 border-orange-300 text-orange-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs text-gray-500">({category.count})</div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-sm text-gray-600">{sortedProducts.length} products found</p>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                    {product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <CurrencyConverter inrPrice={product.price} className="font-bold" />
                        {product.originalPrice && (
                          <CurrencyConverter inrPrice={product.originalPrice} className="text-sm text-gray-500 line-through ml-2" />
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{product.unit}</span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 