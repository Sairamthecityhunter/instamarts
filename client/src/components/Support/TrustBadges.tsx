import React from 'react';
import { FiShield, FiLock, FiTruck, FiAward, FiCheckCircle } from 'react-icons/fi';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: <FiLock className="w-5 h-5" />,
      title: 'SSL Secured',
      description: '256-bit encryption',
      color: 'text-green-600'
    },
    {
      icon: <FiShield className="w-5 h-5" />,
      title: 'Stripe Protected',
      description: 'Secure payments',
      color: 'text-blue-600'
    },
    {
      icon: <FiTruck className="w-5 h-5" />,
      title: 'Tracked Shipping',
      description: 'Real-time updates',
      color: 'text-purple-600'
    },
    {
      icon: <FiAward className="w-5 h-5" />,
      title: 'Customs Included',
      description: 'No hidden fees',
      color: 'text-orange-600'
    },
    {
      icon: <FiCheckCircle className="w-5 h-5" />,
      title: '30-Day Returns',
      description: 'Money back guarantee',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">
        🛡️ Trusted by 10,000+ customers
      </h3>
      <div className="grid grid-cols-5 gap-2 text-center">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`${badge.color} mb-1`}>
              {badge.icon}
            </div>
            <div className="text-xs font-medium text-gray-800">
              {badge.title}
            </div>
            <div className="text-xs text-gray-500">
              {badge.description}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-green-500">⭐⭐⭐⭐⭐</span>
            <span>4.8/5 rating</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div>
            <span>🚚 7-15 day delivery</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div>
            <span>🇮🇳➡️🇺🇸 Direct import</span>
          </div>
        </div>
      </div>
    </div>
  );
};
