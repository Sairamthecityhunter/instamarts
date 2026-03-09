import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

interface FlashSaleProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: number;
  stock?: number;
  inStock: boolean;
}

interface FlashSaleProps {
  title?: string;
  endTime: Date;
  products: FlashSaleProduct[];
}

const FlashSale: React.FC<FlashSaleProps> = ({
  title = 'Flash Sale',
  endTime,
  products,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance < 0) {
        setIsActive(false);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (!isActive || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Ends in:</span>
              <div className="flex items-center gap-2">
                <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
                  <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-xs ml-1">H</span>
                </div>
                <span>:</span>
                <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
                  <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-xs ml-1">M</span>
                </div>
                <span>:</span>
                <div className="bg-white bg-opacity-20 px-2 py-1 rounded">
                  <span className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-xs ml-1">S</span>
                </div>
              </div>
            </div>
          </div>
          <Link
            to="/flash-sale"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((product) => (
            <div key={product.id} className="relative">
              <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                {product.discount}% OFF
              </div>
              <ProductCard
                product={{
                  id: product.id,
                  name: product.name,
                  description: null,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.image,
                  category: { id: '', name: '', slug: '' },
                  brand: null,
                  unit: '',
                  inStock: product.inStock,
                  rating: 0,
                  reviewCount: 0,
                  tags: [],
                  stock: product.stock,
                }}
                showQuickView={true}
                showWishlist={true}
                showShare={false}
                showStockIndicator={true}
                showBadges={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
