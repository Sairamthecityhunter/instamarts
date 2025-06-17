import React from 'react';

const OffersSection: React.FC = () => {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Free Delivery</h3>
            <p className="mb-4">On orders above ₹199</p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded font-medium">
              Shop Now
            </button>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Flash Sale</h3>
            <p className="mb-4">Up to 50% off on fruits</p>
            <button className="bg-white text-green-600 px-4 py-2 rounded font-medium">
              Grab Deal
            </button>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-2">New User</h3>
            <p className="mb-4">Get ₹100 off on first order</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded font-medium">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection; 