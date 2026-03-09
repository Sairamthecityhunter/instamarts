import React, { useState, useEffect } from 'react';
import { FiTruck, FiPackage, FiClock } from 'react-icons/fi';

interface ShippingRate {
  carrier: string;
  service: string;
  rate: number;
  currency: string;
  deliveryDays: string;
  tracking: boolean;
}

interface ShippingAPIProps {
  weight: number; // in kg
  destination: string; // US state code
  value: number; // package value in USD
  onRateSelected: (rate: ShippingRate) => void;
}

export const ShippingAPI: React.FC<ShippingAPIProps> = ({ 
  weight, 
  destination, 
  value, 
  onRateSelected 
}) => {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRate, setSelectedRate] = useState<string>('');

  // Mock shipping rates (replace with real API calls)
  const mockShippingRates: ShippingRate[] = [
    {
      carrier: 'DHL Express',
      service: 'Express Worldwide',
      rate: calculateDHLRate(weight, value),
      currency: 'USD',
      deliveryDays: '3-5 business days',
      tracking: true
    },
    {
      carrier: 'FedEx',
      service: 'International Priority',
      rate: calculateFedExRate(weight, value),
      currency: 'USD', 
      deliveryDays: '4-7 business days',
      tracking: true
    },
    {
      carrier: 'UPS',
      service: 'Worldwide Express',
      rate: calculateUPSRate(weight, value),
      currency: 'USD',
      deliveryDays: '5-8 business days', 
      tracking: true
    },
    {
      carrier: 'India Post',
      service: 'Speed Post International',
      rate: calculateIndiaPostRate(weight, value),
      currency: 'USD',
      deliveryDays: '10-15 business days',
      tracking: true
    }
  ];

  function calculateDHLRate(weight: number, value: number): number {
    // DHL rate calculation logic
    const baseRate = 25;
    const weightRate = weight * 8;
    const valueRate = value * 0.02;
    return Math.round((baseRate + weightRate + valueRate) * 100) / 100;
  }

  function calculateFedExRate(weight: number, value: number): number {
    // FedEx rate calculation logic  
    const baseRate = 22;
    const weightRate = weight * 7.5;
    const valueRate = value * 0.018;
    return Math.round((baseRate + weightRate + valueRate) * 100) / 100;
  }

  function calculateUPSRate(weight: number, value: number): number {
    // UPS rate calculation logic
    const baseRate = 20;
    const weightRate = weight * 7;
    const valueRate = value * 0.016;
    return Math.round((baseRate + weightRate + valueRate) * 100) / 100;
  }

  function calculateIndiaPostRate(weight: number, value: number): number {
    // India Post rate calculation logic
    const baseRate = 12;
    const weightRate = weight * 4;
    const valueRate = value * 0.01;
    return Math.round((baseRate + weightRate + valueRate) * 100) / 100;
  }

  useEffect(() => {
    fetchShippingRates();
  }, [weight, destination, value]);

  const fetchShippingRates = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, replace with real API calls:
      // const dhlRates = await fetchDHLRates(weight, destination, value);
      // const fedexRates = await fetchFedExRates(weight, destination, value);
      // const upsRates = await fetchUPSRates(weight, destination, value);
      
      setRates(mockShippingRates);
      
      // Auto-select the most economical option
      const cheapestRate = mockShippingRates.reduce((prev, current) => 
        prev.rate < current.rate ? prev : current
      );
      setSelectedRate(`${cheapestRate.carrier}-${cheapestRate.service}`);
      onRateSelected(cheapestRate);
      
    } catch (error) {
      console.error('Failed to fetch shipping rates:', error);
      // Fallback to default rate
      const fallbackRate: ShippingRate = {
        carrier: 'Standard International',
        service: 'Economy Shipping',
        rate: 15.99,
        currency: 'USD',
        deliveryDays: '7-15 business days',
        tracking: true
      };
      setRates([fallbackRate]);
      setSelectedRate(`${fallbackRate.carrier}-${fallbackRate.service}`);
      onRateSelected(fallbackRate);
    } finally {
      setLoading(false);
    }
  };

  const handleRateSelection = (rate: ShippingRate) => {
    setSelectedRate(`${rate.carrier}-${rate.service}`);
    onRateSelected(rate);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiTruck className="text-blue-600" />
          Calculating Shipping Rates...
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between items-center p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-32 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FiTruck className="text-blue-600" />
        Shipping Options (India to {destination})
      </h3>
      
      <div className="space-y-3">
        {rates.map((rate, index) => (
          <label
            key={index}
            className={`flex justify-between items-center p-3 border rounded cursor-pointer transition-colors ${
              selectedRate === `${rate.carrier}-${rate.service}`
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="shipping"
              value={`${rate.carrier}-${rate.service}`}
              checked={selectedRate === `${rate.carrier}-${rate.service}`}
              onChange={() => handleRateSelection(rate)}
              className="sr-only"
            />
            
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {rate.carrier === 'DHL Express' && <span className="text-2xl">🟡</span>}
                {rate.carrier === 'FedEx' && <span className="text-2xl">🟣</span>}
                {rate.carrier === 'UPS' && <span className="text-2xl">🟤</span>}
                {rate.carrier === 'India Post' && <span className="text-2xl">🇮🇳</span>}
              </div>
              
              <div>
                <div className="font-medium text-gray-900">
                  {rate.carrier} - {rate.service}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {rate.deliveryDays}
                  </span>
                  {rate.tracking && (
                    <span className="flex items-center gap-1">
                      <FiPackage className="w-3 h-3" />
                      Tracking included
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                ${rate.rate}
              </div>
              <div className="text-xs text-gray-500">
                {rate.currency}
              </div>
            </div>
          </label>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
        <div className="flex items-start gap-2">
          <div className="text-green-600 mt-0.5">✓</div>
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">All shipping options include:</p>
            <ul className="text-xs space-y-1">
              <li>• Customs clearance and documentation</li>
              <li>• Insurance up to package value</li>
              <li>• Real-time tracking updates</li>
              <li>• Delivery to your doorstep</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Real API integration functions (for future implementation)
export const fetchDHLRates = async (weight: number, destination: string, value: number) => {
  // DHL API integration
  const response = await fetch('/api/shipping/dhl/rates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weight, destination, value })
  });
  return response.json();
};

export const fetchFedExRates = async (weight: number, destination: string, value: number) => {
  // FedEx API integration
  const response = await fetch('/api/shipping/fedex/rates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weight, destination, value })
  });
  return response.json();
};

export const fetchUPSRates = async (weight: number, destination: string, value: number) => {
  // UPS API integration
  const response = await fetch('/api/shipping/ups/rates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weight, destination, value })
  });
  return response.json();
};
