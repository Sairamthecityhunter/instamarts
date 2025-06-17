import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiClock, FiTruck, FiShield, FiZap } from 'react-icons/fi';
import { RootState } from '../store/store';
import HeroSection from '../components/Home/HeroSection';
import CategoryCarousel from '../components/Home/CategoryCarousel';
import ProductCarousel from '../components/Home/ProductCarousel';
import OffersSection from '../components/Home/OffersSection';
import InstamartPlusPromo from '../components/Home/InstamartPlusPromo';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { categories, featuredProducts, recommendations } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    // Load initial data
    // In a real app, this would trigger API calls
    console.log('Loading homepage data...');
  }, [dispatch]);

  const deliveryPromises = [
    {
      icon: <FiClock className="h-6 w-6" />,
      title: "Under 20 Minutes",
      description: "Lightning fast delivery to your doorstep"
    },
    {
      icon: <FiTruck className="h-6 w-6" />,
      title: "Free Delivery",
      description: "On orders above ₹199"
    },
    {
      icon: <FiShield className="h-6 w-6" />,
      title: "Quality Guaranteed",
      description: "Fresh products, every time"
    },
    {
      icon: <FiZap className="h-6 w-6" />,
      title: "24x7 Available",
      description: "Order anytime, anywhere"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Delivery Promises */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {deliveryPromises.map((promise, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                  {promise.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {promise.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {promise.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <button className="text-primary-600 font-medium hover:text-primary-700">
              View All
            </button>
          </div>
          <CategoryCarousel categories={categories} />
        </div>
      </section>

      {/* Offers Section */}
      <OffersSection />

      {/* Personalized Recommendations */}
      {isAuthenticated && recommendations.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Just for You, {user?.name?.split(' ')[0]}
              </h2>
            </div>
            <ProductCarousel products={recommendations} />
          </div>
        </section>
      )}

      {/* Reorder Section */}
      {isAuthenticated && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Reorder
              </h2>
              <button className="text-primary-600 font-medium hover:text-primary-700">
                View All
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Your frequently ordered items, ready to add to cart
            </p>
            {/* This would show user's frequently ordered items */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Placeholder for reorder items */}
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">No recent orders</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Hot Today</h2>
            <button className="text-primary-600 font-medium hover:text-primary-700">
              View All
            </button>
          </div>
          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      {/* Instamart+ Promotion */}
      {!user?.isInstamartPlus && (
        <InstamartPlusPromo />
      )}

      {/* Fresh Arrivals */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Fresh Arrivals</h2>
            <button className="text-primary-600 font-medium hover:text-primary-700">
              View All
            </button>
          </div>
          <ProductCarousel products={featuredProducts.slice(0, 8)} />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-gradient-bg">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Never miss a deal!
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Get notified about new offers, flash sales, and product launches
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 