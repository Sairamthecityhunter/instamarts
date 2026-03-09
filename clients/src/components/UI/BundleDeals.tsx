import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import CurrencyConverter from '../International/CurrencyConverter';

interface BundleProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface BundleDeal {
  id: string;
  title: string;
  products: BundleProduct[];
  bundlePrice: number;
  originalPrice: number;
  savings: number;
  image?: string;
}

interface BundleDealsProps {
  bundles: BundleDeal[];
}

const BundleDeals: React.FC<BundleDealsProps> = ({ bundles }) => {
  const dispatch = useDispatch();

  const handleAddBundle = (bundle: BundleDeal) => {
    bundle.products.forEach((product) => {
      dispatch(addToCart({
        product: {
          id: product.id,
          name: product.name,
          description: '',
          price: product.price,
          image: product.image,
          category: '',
          brand: '',
          unit: '',
          inStock: true,
          rating: 0,
          reviewCount: 0,
          tags: [],
        },
        quantity: product.quantity,
      }));
    });
    toast.success(`Bundle "${bundle.title}" added to cart!`);
  };

  if (bundles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Bought Together</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <div key={bundle.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{bundle.title}</h3>
              
              {/* Products in Bundle */}
              <div className="space-y-3 mb-4">
                {bundle.products.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-3">
                    {index < bundle.products.length - 1 && (
                      <span className="text-gray-400">+</span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-600">Qty: {product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Bundle Price:</span>
                  <div className="text-right">
                    <CurrencyConverter
                      inrPrice={bundle.bundlePrice}
                      className="text-xl font-bold text-green-600"
                    />
                    <CurrencyConverter
                      inrPrice={bundle.originalPrice}
                      className="text-sm text-gray-500 line-through ml-2"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-green-600 font-medium">
                    You Save: ₹{bundle.savings}
                  </span>
                </div>
                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Add Bundle to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BundleDeals;
