import React from 'react';

const InstamartPlusPromo: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Join Instamart+
        </h2>
        <p className="text-xl text-orange-100 mb-8">
          Free delivery, exclusive deals, and priority support
        </p>
        <div className="bg-white rounded-lg p-6 text-gray-900 inline-block">
          <h3 className="text-2xl font-bold mb-4">₹99/month</h3>
          <ul className="text-left mb-6">
            <li className="flex items-center mb-2">
              <span className="text-green-500 mr-2">✓</span>
              Free delivery on all orders
            </li>
            <li className="flex items-center mb-2">
              <span className="text-green-500 mr-2">✓</span>
              Exclusive member-only deals
            </li>
            <li className="flex items-center mb-2">
              <span className="text-green-500 mr-2">✓</span>
              Priority delivery slots
            </li>
          </ul>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default InstamartPlusPromo; 