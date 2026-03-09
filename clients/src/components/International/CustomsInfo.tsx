import React, { useState } from 'react';
import { FiInfo, FiCheckCircle, FiAlertCircle, FiTruck } from 'react-icons/fi';

const CustomsInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'allowed' | 'restricted' | 'process'>('allowed');

  const allowedItems = [
    'Spices and seasonings (under 5kg)',
    'Dry snacks and namkeens',
    'Tea and coffee (loose or packaged)',
    'Packaged rice, lentils, and grains',
    'Ayurvedic medicines and supplements',
    'Pickles and preserves (vacuum packed)',
    'Incense and religious items',
    'Traditional handicrafts',
    'Packaged sweets (non-dairy)',
    'Books and educational materials'
  ];

  const restrictedItems = [
    'Fresh fruits and vegetables',
    'Dairy products (milk, cheese, ghee)',
    'Meat and poultry products',
    'Seeds and plant materials',
    'Liquids over 1 liter',
    'Homemade food items',
    'Prescription medications',
    'Live plants or flowers',
    'Raw honey and bee products',
    'Items containing alcohol'
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Order Processing',
      description: 'We verify all items meet US import regulations',
      time: '1-2 business days'
    },
    {
      step: 2,
      title: 'Secure Packaging',
      description: 'International shipping compliant packaging with proper labeling',
      time: '1 business day'
    },
    {
      step: 3,
      title: 'Documentation',
      description: 'Complete customs declaration and commercial invoice preparation',
      time: 'Same day'
    },
    {
      step: 4,
      title: 'Shipping & Transit',
      description: 'Express shipping via DHL/FedEx with tracking',
      time: '5-10 business days'
    },
    {
      step: 5,
      title: 'Customs Clearance',
      description: 'Automated clearance for compliant packages (no action needed)',
      time: '1-3 business days'
    },
    {
      step: 6,
      title: 'Final Delivery',
      description: 'Local carrier delivers to your doorstep',
      time: '1-2 business days'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <FiInfo className="h-5 w-5 text-blue-600" />
        Customs & Import Information
      </h3>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('allowed')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'allowed'
              ? 'bg-white text-green-700 shadow'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ✅ Allowed Items
        </button>
        <button
          onClick={() => setActiveTab('restricted')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'restricted'
              ? 'bg-white text-red-700 shadow'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ❌ Restricted Items
        </button>
        <button
          onClick={() => setActiveTab('process')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'process'
              ? 'bg-white text-blue-700 shadow'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📦 Process
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'allowed' && (
        <div>
          <h4 className="font-medium text-green-800 mb-4 flex items-center gap-2">
            <FiCheckCircle className="h-4 w-4" />
            Items We Can Ship to USA
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {allowedItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600">✅</span>
                <span className="text-sm text-green-800">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> All items are properly documented and comply with US FDA and customs regulations. 
              Duties and taxes are included in your shipping cost.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'restricted' && (
        <div>
          <h4 className="font-medium text-red-800 mb-4 flex items-center gap-2">
            <FiAlertCircle className="h-4 w-4" />
            Items We Cannot Ship to USA
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {restrictedItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <span className="text-red-600">❌</span>
                <span className="text-sm text-red-800">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Why these restrictions?</strong> These items are prohibited by US customs regulations, 
              FDA guidelines, or shipping carrier policies. We ensure 100% compliance to guarantee delivery.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'process' && (
        <div>
          <h4 className="font-medium text-blue-800 mb-6 flex items-center gap-2">
            <FiTruck className="h-4 w-4" />
            Your Package Journey: India to USA
          </h4>
          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{step.step}</span>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="w-px h-12 bg-gray-200 ml-4 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-gray-900">{step.title}</h5>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">What's Included in Your Shipping:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Full customs clearance and duty payments</li>
              <li>• Real-time tracking from India to USA</li>
              <li>• Insurance coverage up to $500</li>
              <li>• Customer support in English and Hindi</li>
              <li>• Guaranteed delivery or full refund</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomsInfo;
