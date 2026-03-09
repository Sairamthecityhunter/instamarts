import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CurrencyConverter from '../components/International/CurrencyConverter';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import PriceDropAlert from '../components/UI/PriceDropAlert';
import { useCurrency } from '../hooks/useCurrency';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
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
  nutritionalInfo?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  ingredients?: string[];
  storageInstructions?: string;
  storeId: string;
  storeName: string;
  colors?: { name: string; hex: string; available: boolean }[];
  sizes?: { name: string; available: boolean }[];
  modelInfo?: string;
  specialOffer?: { text: string; price: number };
  visitorsToday?: number;
  isBestSeller?: boolean;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProductData = async () => {
    setLoading(true);
    try {
      // Product data mapping - you can expand this with actual API call
      const productsMap: Record<string, Product> = {
        '1': {
          id: '1',
          name: 'Cardamom Green Pods',
          description: 'Premium quality green cardamom pods from Kerala hills. Known for their aromatic flavor and medicinal properties. Perfect for Indian cooking, desserts, and tea.',
          price: 450,
          originalPrice: 500,
          images: [
            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500',
            'https://images.unsplash.com/photo-1505798577917-a65157d3353a?w=500',
            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500',
            'https://images.unsplash.com/photo-1505798577917-a65157d3353a?w=500',
            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500'
          ],
          category: 'spices',
          subcategory: 'cardamom',
          brand: 'Everest',
          unit: '50g',
          inStock: true,
          rating: 4.7,
          reviewCount: 3273,
          tags: ['Premium', 'Kerala', 'Aromatic', 'Whole Spices'],
          weight: '50g',
          expiry: '24 months from packaging',
          organic: false,
          glutenFree: true,
          vegan: true,
          ingredients: ['100% Green Cardamom Pods'],
          storageInstructions: 'Store in an airtight container in a cool, dry place away from direct sunlight',
          storeId: '1',
          storeName: 'Sharma Grocery Store',
          sizes: [
            { name: '50g', available: true },
            { name: '100g', available: true },
            { name: '250g', available: true },
            { name: '500g', available: true }
          ],
          modelInfo: 'Product shown: 50g pack',
          specialOffer: { text: 'Get this for $18.00 only', price: 1500 },
          visitorsToday: 81369,
          isBestSeller: true
        }
      };

      // Default product (fallback)
      const defaultProduct: Product = {
        id: id || '1',
        name: 'Organic Basmati Rice Premium',
        description: 'Premium quality aged organic basmati rice sourced directly from the foothills of Himalayas. Each grain is long, aromatic, and fluffy when cooked.',
        price: 285,
        originalPrice: 320,
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=500',
          'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500',
          'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500',
          'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=500',
          'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500'
        ],
        category: 'staples',
        subcategory: 'rice',
        brand: 'India Gate',
        unit: '5kg',
        inStock: true,
        rating: 4.6,
        reviewCount: 1248,
        tags: ['Organic', 'Premium', 'Himalayan', 'Aged'],
        weight: '5000g',
        expiry: '12 months from packaging',
        organic: true,
        glutenFree: true,
        vegan: true,
        nutritionalInfo: {
          calories: 345,
          protein: '7.5g',
          carbs: '78g',
          fat: '0.7g',
          fiber: '1.4g'
        },
        ingredients: ['100% Organic Basmati Rice'],
        storageInstructions: 'Store in a cool, dry place away from direct sunlight',
        storeId: '1',
        storeName: 'Sharma Grocery Store',
        colors: [
          { name: 'Original', hex: '#F5F5DC', available: true },
          { name: 'Premium', hex: '#FFE4B5', available: true },
          { name: 'Golden', hex: '#FFD700', available: true }
        ],
        sizes: [
          { name: '1kg', available: true },
          { name: '2kg', available: true },
          { name: '5kg', available: true },
          { name: '10kg', available: true }
        ],
        modelInfo: 'Product shown: 5kg pack',
        specialOffer: { text: 'Get this for $18.00 only', price: 1500 },
        visitorsToday: 81369,
        isBestSeller: true
      };

      const mockProduct = productsMap[id || '1'] || defaultProduct;

      // Try to load product from API or use mock data
      // For now, we'll use mock data but you can replace this with actual API call
      
      // Set default selections
      if (mockProduct.colors && mockProduct.colors.length > 0) {
        setSelectedColor(mockProduct.colors[0].name);
      }
      if (mockProduct.sizes && mockProduct.sizes.length > 0) {
        setSelectedSize(mockProduct.sizes[0].name);
      }

      // Reviews based on product
      const reviewsMap: Record<string, Review[]> = {
        '1': [
          {
            id: '1',
            userName: 'Ravi K.',
            rating: 5,
            comment: 'Excellent quality cardamom! Very aromatic and fresh. Perfect for making masala chai. Highly recommended!',
            date: '2024-01-15',
            verified: true
          },
          {
            id: '2',
            userName: 'Priya M.',
            rating: 5,
            comment: 'Best cardamom pods I have ever bought. The aroma is amazing and they are so fresh. Great value for money.',
            date: '2024-01-12',
            verified: true
          },
          {
            id: '3',
            userName: 'Amit S.',
            rating: 4,
            comment: 'Good quality cardamom pods. Fresh and aromatic. Packaging could be better but product is excellent.',
            date: '2024-01-10',
            verified: true
          },
          {
            id: '4',
            userName: 'Sneha R.',
            rating: 5,
            comment: 'Premium quality! Using these in my biryani and the flavor is outstanding. Will definitely order again.',
            date: '2024-01-08',
            verified: false
          }
        ]
      };

      const mockReviews = reviewsMap[id || '1'] || [
        {
          id: '1',
          userName: 'Priya S.',
          rating: 5,
          comment: 'Excellent quality! Very aromatic and fresh. Worth the price.',
          date: '2024-01-15',
          verified: true
        },
        {
          id: '2',
          userName: 'Rajesh K.',
          rating: 4,
          comment: 'Good quality but packaging could be better. Product tastes great.',
          date: '2024-01-10',
          verified: true
        },
        {
          id: '3',
          userName: 'Meera P.',
          rating: 5,
          comment: 'Best product I have bought online. Will definitely reorder.',
          date: '2024-01-08',
          verified: false
        }
      ];

      setProduct(mockProduct);
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error loading product data:', error);
      toast.error('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate price based on selected size - recalculates when selectedSize or product changes
  const { price: displayPrice, originalPrice: displayOriginalPrice } = useMemo(() => {
    if (!product) return { price: 0, originalPrice: undefined };
    
    if (!selectedSize || !product.sizes) {
      return {
        price: product.price,
        originalPrice: product.originalPrice
      };
    }
    
    const baseSize = product.unit; // e.g., "50g" or "5kg"
    const baseWeight = parseFloat(baseSize.replace(/[^0-9.]/g, '')) || 1;
    const selectedWeight = parseFloat(selectedSize.replace(/[^0-9.]/g, '')) || 1;
    
    // Check if base size has kg or g
    const baseUnit = baseSize.toLowerCase().includes('kg') ? 'kg' : 'g';
    const selectedUnitType = selectedSize.toLowerCase().includes('kg') ? 'kg' : 'g';
    
    // Convert to same unit for comparison
    let baseWeightInGrams = baseUnit === 'kg' ? baseWeight * 1000 : baseWeight;
    let selectedWeightInGrams = selectedUnitType === 'kg' ? selectedWeight * 1000 : selectedWeight;
    
    if (baseWeightInGrams > 0 && selectedWeightInGrams > 0) {
      // Calculate price ratio based on weight
      const priceMultiplier = selectedWeightInGrams / baseWeightInGrams;
      return {
        price: Math.round(product.price * priceMultiplier),
        originalPrice: product.originalPrice ? Math.round(product.originalPrice * priceMultiplier) : undefined
      };
    }
    
    return {
      price: product.price,
      originalPrice: product.originalPrice
    };
  }, [product, selectedSize]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Use selected size if available, otherwise use default unit
    const selectedUnit = selectedSize || product.unit;
    
    // Use the calculated display price (already accounts for selected size)
    const finalPrice = displayPrice;
    const finalOriginalPrice = displayOriginalPrice;
    
    // Create product name with size if size is selected
    const productName = selectedSize 
      ? `${product.name} (${selectedSize})`
      : product.name;
    
    dispatch(addToCart({
      product: {
        id: `${product.id}-${selectedSize || product.unit}`, // Unique ID with size
        name: productName,
        description: product.description,
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        image: product.images[0],
        category: product.category,
        brand: product.brand,
        unit: selectedUnit,
        inStock: product.inStock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        tags: product.tags
      },
      quantity: quantity
    }));
    
    toast.success(`${quantity} x ${selectedUnit} ${product.name} added to cart`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <Link to={`/groceries/${product.category}`} className="text-gray-500 hover:text-gray-700 capitalize">
                {product.category}
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Thumbnail Images (Vertical) */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 relative">
              {product.isBestSeller && (
                <span className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  Best Seller
                </span>
              )}
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-[600px] object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="sticky top-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            
            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-lg font-semibold ml-1">{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviewCount})</span>
              <span className="text-green-600">✓</span>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-700 font-medium">Color:</span>
                  <span className="text-gray-900 font-semibold">{selectedColor || product.colors[0].name}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      disabled={!color.available}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-gray-900 ring-2 ring-gray-300 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${!color.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Size:</span>
                    <span className="text-gray-900 font-semibold">{selectedSize || product.sizes[0].name}</span>
                  </div>
                  <button className="text-green-600 hover:text-green-700 text-sm">Size Chart</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      disabled={!size.available}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size.name
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      } ${!size.available ? 'opacity-50 cursor-not-allowed line-through' : 'cursor-pointer'}`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                {product.modelInfo && (
                  <p className="text-sm text-gray-500 mt-2">{product.modelInfo}</p>
                )}
              </div>
            )}
            
            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <CurrencyConverter inrPrice={displayPrice} className="text-3xl font-bold text-gray-900" />
                {displayOriginalPrice && (
                  <>
                    <CurrencyConverter inrPrice={displayOriginalPrice} className="text-xl text-gray-500 line-through" />
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                      {Math.round((1 - displayPrice / displayOriginalPrice) * 100)}% Off
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of taxes</p>
              {selectedSize && (
                <p className="text-xs text-gray-400 mt-1">Price for {selectedSize}</p>
              )}
            </div>
            
            {/* Special Offer */}
            {product.specialOffer && (
              <div className="mb-4 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">Get this for {formatPrice(product.specialOffer.price)} only</p>
                </div>
                <button className="text-white hover:text-gray-100 text-sm font-medium">
                  Tap to know »
                </button>
              </div>
            )}
            
            {/* Sales Activity */}
            {product.visitorsToday && (
              <div className="flex items-center gap-2 mb-6 text-orange-600">
                <span className="text-xl">⚡</span>
                <span className="text-sm font-medium">Selling Fast. {product.visitorsToday.toLocaleString()}+ visitors today.</span>
              </div>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.organic && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">🌱 Organic</span>
              )}
              {product.glutenFree && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Gluten Free</span>
              )}
              {product.vegan && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Vegan</span>
              )}
              {product.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Add to Cart */}
            <div className="mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
              >
                {product.inStock ? `Add to bag` : 'Out of Stock'}
              </button>
            </div>
            
            {/* Shipping and Returns */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <div>
                  <span className="text-gray-700 font-medium">Free Express Shipping PAN India.</span>
                  <button className="text-green-600 hover:text-green-700 ml-1">Learn more</button>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <div>
                  <span className="text-gray-700 font-medium">Easy Returns within 5 days.</span>
                  <button className="text-green-600 hover:text-green-700 ml-1">Returns Details</button>
                </div>
              </div>
            </div>

            {/* Price Drop Alert */}
            <div className="mt-6">
              <PriceDropAlert
                productId={product.id}
                productName={product.name}
                productImage={product.images[0]}
                currentPrice={product.price}
              />
            </div>

            {/* Expandable Sections */}
            <div className="mt-8 space-y-3">
              {/* Fit and Feel */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, fitAndFeel: !prev.fitAndFeel }))}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👖</span>
                    <span className="font-medium text-gray-900">Fit and Feel</span>
                  </div>
                  <span className="text-gray-500 text-xl">{expandedSections.fitAndFeel ? '−' : '+'}</span>
                </button>
                {expandedSections.fitAndFeel && (
                  <div className="mt-3 text-gray-600 text-sm pl-11">
                    <p>Loose-fitting, comfortable design with elastic waistband. Perfect for yoga, casual wear, and everyday activities. The fabric flows naturally with your movements.</p>
                  </div>
                )}
              </div>

              {/* Material and Care */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, materialCare: !prev.materialCare }))}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🧵</span>
                    <span className="font-medium text-gray-900">Material and Care</span>
                  </div>
                  <span className="text-gray-500 text-xl">{expandedSections.materialCare ? '−' : '+'}</span>
                </button>
                {expandedSections.materialCare && (
                  <div className="mt-3 text-gray-600 text-sm pl-11">
                    <p><strong>Material:</strong> {product.organic ? '100% Organic' : 'Premium Quality'} fabric blend</p>
                    <p className="mt-2"><strong>Care Instructions:</strong> {product.storageInstructions || 'Machine wash cold, gentle cycle. Do not bleach. Tumble dry low or air dry.'}</p>
                  </div>
                )}
              </div>

              {/* Returns & Exchange */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, returns: !prev.returns }))}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔄</span>
                    <span className="font-medium text-gray-900">Returns & Exchange</span>
                  </div>
                  <span className="text-gray-500 text-xl">{expandedSections.returns ? '−' : '+'}</span>
                </button>
                {expandedSections.returns && (
                  <div className="mt-3 text-gray-600 text-sm pl-11">
                    <p>Easy returns within 5 days of delivery. Items must be unused, unwashed, and in original packaging. Free return shipping available.</p>
                  </div>
                )}
              </div>

              {/* FAQ's */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, faq: !prev.faq }))}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💬</span>
                    <span className="font-medium text-gray-900">FAQ's</span>
                  </div>
                  <span className="text-gray-500 text-xl">{expandedSections.faq ? '−' : '+'}</span>
                </button>
                {expandedSections.faq && (
                  <div className="mt-3 text-gray-600 text-sm pl-11 space-y-2">
                    <div>
                      <p className="font-medium">Q: What sizes are available?</p>
                      <p>A: We offer sizes from XS to 3XL. Check our size chart for measurements.</p>
                    </div>
                    <div>
                      <p className="font-medium">Q: How long does shipping take?</p>
                      <p>A: Free express shipping takes 2-5 business days PAN India.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-xl">★</span>
                  <span className="text-2xl font-bold text-gray-900">{product.rating}</span>
                  <span className="text-gray-500">/5</span>
                </div>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">{product.reviewCount.toLocaleString()} reviews</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Powered by LOOX</p>
              
              {/* Sample Reviews */}
              {reviews.length > 0 && (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{review.userName}</span>
                          {review.verified && (
                            <span className="text-green-600 text-xs">✓ Verified Purchase</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <p className="text-gray-400 text-xs mt-2">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-12 bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 text-green-600 border-b-2 border-green-600 font-medium">
                Details
              </button>
              <button className="py-4 text-gray-500 hover:text-gray-700">
                Nutrition
              </button>
              <button className="py-4 text-gray-500 hover:text-gray-700">
                Reviews ({reviews.length})
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Product Details */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-gray-600 w-24">Brand:</dt>
                    <dd className="text-gray-900">{product.brand}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-24">Weight:</dt>
                    <dd className="text-gray-900">{product.weight}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-24">Expiry:</dt>
                    <dd className="text-gray-900">{product.expiry}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-600 w-24">Storage:</dt>
                    <dd className="text-gray-900">{product.storageInstructions}</dd>
                  </div>
                </dl>
              </div>
              
              {product.ingredients && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                  <ul className="text-gray-600">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 