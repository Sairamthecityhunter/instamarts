import React, { useState } from 'react';
import { FiX, FiHeart, FiShare2, FiMinus, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { toast } from 'react-hot-toast';
import CurrencyConverter from '../International/CurrencyConverter';

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

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen) return null;

  const images = (product.images && product.images.length > 0) ? product.images : [product.image];

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
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
        quantity: quantity
      }));
      toast.success(`${quantity} x ${product.name} added to cart`);
    }
    onClose();
  };

  const handleViewFullDetails = () => {
    navigate(`/product/${product.id}`);
    onClose();
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        addedAt: new Date().toISOString(),
      }));
      toast.success('Added to wishlist');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || '',
          url: url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Product link copied!');
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          >
            <FiX className="h-5 w-5 text-gray-700" />
          </button>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discountPercentage > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? 'border-green-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                {product.brand && (
                  <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
                )}
                <p className="text-sm text-gray-600 mb-4">{product.unit}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="text-gray-700 font-medium ml-1">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 text-sm">
                    {product.reviewCount} reviews
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <CurrencyConverter
                    inrPrice={product.price}
                    className="text-3xl font-bold text-gray-900"
                  />
                  {product.originalPrice && (
                    <>
                      <CurrencyConverter
                        inrPrice={product.originalPrice}
                        className="text-xl text-gray-500 line-through"
                      />
                      <span className="text-green-600 font-medium">
                        Save {discountPercentage}%
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-700 mb-4">{product.description}</p>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stock Status */}
                {product.inStock ? (
                  <p className="text-green-600 font-medium mb-4">
                    ✓ In Stock
                    {product.stock && product.stock <= 10 && (
                      <span className="text-orange-600 ml-2">
                        (Only {product.stock} left!)
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-red-600 font-medium mb-4">✗ Out of Stock</p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={product.stock ? quantity >= product.stock : false}
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <FiHeart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
                >
                  <FiShare2 className="h-5 w-5" />
                </button>
              </div>

              {/* View Full Details Button */}
              <button
                onClick={handleViewFullDetails}
                className="w-full text-green-600 hover:text-green-700 font-medium py-2 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
