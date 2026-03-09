import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiEye, FiShare2 } from 'react-icons/fi';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { addToRecentlyViewed } from '../../store/slices/recentlyViewedSlice';
import { RootState } from '../../store/store';
import { toast } from 'react-hot-toast';
import CurrencyConverter from '../International/CurrencyConverter';
import ProductQuickView from './ProductQuickView';

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
  stock?: number; // Available stock quantity
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showQuickView?: boolean;
  showWishlist?: boolean;
  showShare?: boolean;
  showStockIndicator?: boolean;
  showBadges?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showQuickView = true,
  showWishlist = true,
  showShare = true,
  showStockIndicator = true,
  showBadges = true,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

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
        quantity: 1
      }));
      toast.success(`${product.name} added to cart`);
    }
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

  const handleProductClick = () => {
    // Track recently viewed
    dispatch(addToRecentlyViewed({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }));
    navigate(`/product/${product.id}`);
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
        // User cancelled or error
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url);
      toast.success('Product link copied to clipboard!');
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Determine product badges
  const badges = [];
  if (showBadges) {
    if (discountPercentage > 0) {
      badges.push({ label: `${discountPercentage}% OFF`, color: 'bg-red-500' });
    }
    if (product.rating >= 4.5) {
      badges.push({ label: 'Popular', color: 'bg-green-500' });
    }
    // You can add more badge logic here (New, Best Seller, etc.)
  }

  // Stock indicator
  const stockLevel = product.stock || 0;
  const isLowStock = stockLevel > 0 && stockLevel <= 10;
  const isOutOfStock = !product.inStock || stockLevel === 0;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={handleProductClick}
          />

          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {showQuickView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                title="Quick View"
              >
                <FiEye className="h-4 w-4 text-gray-700" />
              </button>
            )}
            {showWishlist && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggle();
                }}
                className={`p-2 rounded-full shadow-md transition-colors ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            )}
            {showShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                title="Share"
              >
                <FiShare2 className="h-4 w-4 text-gray-700" />
              </button>
            )}
          </div>

          {/* Product Badges */}
          {showBadges && badges.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className={`${badge.color} text-white text-xs px-2 py-1 rounded font-medium`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}

          {/* Stock Indicator */}
          {showStockIndicator && isLowStock && !isOutOfStock && (
            <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
              Only {stockLevel} left!
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3
            className="font-semibold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-green-600 transition-colors"
            onClick={handleProductClick}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {product.brand && `${product.brand} • `}{product.unit}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <CurrencyConverter inrPrice={product.price} className="text-lg font-bold" />
              {product.originalPrice && (
                <CurrencyConverter
                  inrPrice={product.originalPrice}
                  className="text-sm text-gray-500 line-through ml-2"
                />
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isOutOfStock ? 'Out' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <ProductQuickView
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
};

export default ProductCard;
