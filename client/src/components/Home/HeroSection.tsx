import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-bg text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Groceries in <span className="text-orange-200">20 minutes</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Fresh groceries and essentials delivered to your doorstep. Lightning fast, every time.
        </p>
        <button className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
          Start Shopping
        </button>
      </div>
    </section>
  );
};

export default HeroSection; 