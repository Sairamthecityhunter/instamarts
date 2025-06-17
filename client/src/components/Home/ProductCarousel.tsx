import React from 'react';

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

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-card p-4">
          <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">₹{product.price}</span>
            <button className="bg-primary-500 text-white px-3 py-1 rounded text-sm">Add</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCarousel; 