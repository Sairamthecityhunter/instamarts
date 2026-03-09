import React, { useState } from 'react';
import { FiMapPin, FiTruck, FiDollarSign, FiClock, FiInfo } from 'react-icons/fi';

interface ShippingZone {
  id: string;
  name: string;
  states: string[];
  estimatedDays: string;
  shippingCost: number;
  freeShippingThreshold: number;
  restrictions: string[];
}

const ShippingZones: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('west-coast');

  const shippingZones: ShippingZone[] = [
    {
      id: 'west-coast',
      name: 'West Coast',
      states: ['California', 'Oregon', 'Washington', 'Nevada', 'Arizona'],
      estimatedDays: '7-10 business days',
      shippingCost: 15.99,
      freeShippingThreshold: 150,
      restrictions: ['No fresh dairy products', 'Spices under 5kg limit']
    },
    {
      id: 'east-coast',
      name: 'East Coast',
      states: ['New York', 'New Jersey', 'Pennsylvania', 'Massachusetts', 'Connecticut', 'Maryland', 'Virginia'],
      estimatedDays: '8-12 business days',
      shippingCost: 18.99,
      freeShippingThreshold: 175,
      restrictions: ['No fresh dairy products', 'Spices under 5kg limit']
    },
    {
      id: 'midwest',
      name: 'Midwest',
      states: ['Illinois', 'Michigan', 'Ohio', 'Indiana', 'Wisconsin', 'Minnesota', 'Iowa'],
      estimatedDays: '10-14 business days',
      shippingCost: 22.99,
      freeShippingThreshold: 200,
      restrictions: ['No fresh dairy products', 'Spices under 5kg limit', 'No liquid items over 1L']
    },
    {
      id: 'south',
      name: 'Southern States',
      states: ['Texas', 'Florida', 'Georgia', 'North Carolina', 'Tennessee', 'Louisiana', 'Alabama'],
      estimatedDays: '9-13 business days',
      shippingCost: 19.99,
      freeShippingThreshold: 180,
      restrictions: ['No fresh dairy products', 'Spices under 5kg limit']
    }
  ];

  const selectedZoneData = shippingZones.find(zone => zone.id === selectedZone);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <FiMapPin className="h-5 w-5 text-green-600" />
        USA Shipping Zones
      </h3>

      {/* Zone Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {shippingZones.map(zone => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            className={`p-3 rounded-lg border-2 transition-colors text-left ${
              selectedZone === zone.id
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium text-sm">{zone.name}</div>
            <div className="text-xs text-gray-500 mt-1">{zone.states.length} states</div>
          </button>
        ))}
      </div>

      {/* Selected Zone Details */}
      {selectedZoneData && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">{selectedZoneData.name} Details</h4>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiClock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Delivery Time</div>
                  <div className="font-medium">{selectedZoneData.estimatedDays}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiDollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Shipping Cost</div>
                  <div className="font-medium">${selectedZoneData.shippingCost}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiTruck className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Free Shipping</div>
                  <div className="font-medium">${selectedZoneData.freeShippingThreshold}+</div>
                </div>
              </div>
            </div>
          </div>

          {/* States Covered */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">States Covered:</h5>
            <div className="flex flex-wrap gap-2">
              {selectedZoneData.states.map(state => (
                <span key={state} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {state}
                </span>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          {selectedZoneData.restrictions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiInfo className="h-4 w-4 text-yellow-600" />
                <h5 className="font-medium text-yellow-800">Shipping Restrictions</h5>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {selectedZoneData.restrictions.map((restriction, index) => (
                  <li key={index}>• {restriction}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-medium text-green-800 mb-2">What's Included:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Customs clearance and duties</li>
              <li>• Package tracking from India to USA</li>
              <li>• Secure packaging for international shipping</li>
              <li>• Customer support in English and Hindi</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingZones;
