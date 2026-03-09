import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

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

interface ProductRecommendationsProps {
  title?: string;
  products: Product[];
  productId?: string; // Current product ID to exclude
  limit?: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  title = 'You May Also Like',
  products,
  productId,
  limit = 4,
}) => {
  // Filter out current product if productId is provided
  const filteredProducts = productId
    ? products.filter(p => p.id !== productId)
    : products;

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, limit).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showQuickView={true}
              showWishlist={true}
              showShare={false}
              showStockIndicator={true}
              showBadges={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendations;
