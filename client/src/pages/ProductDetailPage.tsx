import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

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
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    setLoading(true);
    try {
      // Mock product data
      const mockProduct: Product = {
        id: id || '1',
        name: 'Organic Basmati Rice Premium',
        description: 'Premium quality aged organic basmati rice sourced directly from the foothills of Himalayas. Each grain is long, aromatic, and fluffy when cooked.',
        price: 285,
        originalPrice: 320,
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=500',
          'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500',
          'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500'
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
        storeName: 'Sharma Grocery Store'
      };

      const mockReviews: Review[] = [
        {
          id: '1',
          userName: 'Priya S.',
          rating: 5,
          comment: 'Excellent quality rice! Very aromatic and fluffy. Worth the price.',
          date: '2024-01-15',
          verified: true
        },
        {
          id: '2',
          userName: 'Rajesh K.',
          rating: 4,
          comment: 'Good quality but packaging could be better. Rice tastes great.',
          date: '2024-01-10',
          verified: true
        },
        {
          id: '3',
          userName: 'Meera P.',
          rating: 5,
          comment: 'Best basmati rice I have bought online. Will definitely reorder.',
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

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category,
        brand: product.brand,
        unit: product.unit,
        inStock: product.inStock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        tags: product.tags
      },
      quantity: quantity
    }));
    
    toast.success(`${quantity} ${product.unit} ${product.name} added to cart`);
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
          <div>
            <div className="mb-4">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <Link to={`/store/${product.storeId}`} className="text-green-600 hover:text-green-700 text-sm">
                {product.storeName}
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-lg font-semibold ml-1">{product.rating}</span>
                <span className="text-gray-500 ml-2">({product.reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
            
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
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">{product.unit} each</span>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {product.inStock ? `Add ₹${product.price * quantity} to Cart` : 'Out of Stock'}
              </button>
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