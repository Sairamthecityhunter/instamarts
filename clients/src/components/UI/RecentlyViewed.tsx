import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store/store';

const RecentlyViewed: React.FC = () => {
  const recentlyViewed = useSelector((state: RootState) => state.recentlyViewed.items);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
          <Link
            to="/recently-viewed"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recentlyViewed.slice(0, 6).map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {item.name}
                </h3>
                <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
