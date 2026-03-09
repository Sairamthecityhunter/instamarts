import React, { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CurrencyConverter from '../International/CurrencyConverter';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  description: string | null;
  brand: string | null;
  unit: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  features?: string[];
}

interface ProductComparisonProps {
  maxProducts?: number;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ maxProducts = 3 }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addProduct = (product: Product) => {
    if (products.length >= maxProducts) {
      alert(`You can compare up to ${maxProducts} products`);
      return;
    }
    if (products.find(p => p.id === product.id)) {
      alert('Product already in comparison');
      return;
    }
    setProducts([...products, product]);
    setIsOpen(true);
  };

  const removeProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    if (products.length === 1) {
      setIsOpen(false);
    }
  };

  const clearAll = () => {
    setProducts([]);
    setIsOpen(false);
  };

  if (!isOpen && products.length === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Compare Products ({products.length}/{maxProducts})
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 relative min-w-[200px]">
              <button
                onClick={() => removeProduct(product.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-4 w-4" />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
              <div className="mb-2">
                <CurrencyConverter inrPrice={product.price} className="text-lg font-bold" />
                {product.originalPrice && (
                  <CurrencyConverter
                    inrPrice={product.originalPrice}
                    className="text-sm text-gray-500 line-through ml-2"
                  />
                )}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {product.brand && `${product.brand} • `}{product.unit}
              </div>
              <div className="flex items-center gap-1 text-xs mb-2">
                <span className="text-yellow-400">★</span>
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-400">({product.reviewCount})</span>
              </div>
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="w-full text-sm text-green-600 hover:text-green-700 font-medium py-1 border border-green-600 rounded hover:bg-green-50"
              >
                View Details
              </button>
            </div>
          ))}

          {products.length < maxProducts && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center min-w-[200px]">
              <button className="text-gray-400 hover:text-gray-600">
                <FiPlus className="h-8 w-8" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
