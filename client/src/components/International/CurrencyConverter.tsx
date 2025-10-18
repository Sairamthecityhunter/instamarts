import React, { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

interface CurrencyConverterProps {
  inrPrice: number;
  className?: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ inrPrice, className = '' }) => {
  const [exchangeRate, setExchangeRate] = useState<number>(0.012); // 1 INR = 0.012 USD (approximate)
  const [usdPrice, setUsdPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setUsdPrice(inrPrice * exchangeRate);
  }, [inrPrice, exchangeRate]);

  const fetchExchangeRate = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch from a currency API
      // For demo, we'll use a mock rate
      const mockRate = 0.012 + (Math.random() - 0.5) * 0.001; // Simulate small fluctuations
      setExchangeRate(mockRate);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-lg font-bold text-gray-900">
          ${usdPrice.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500">USD</span>
      </div>
      
      <div className="text-xs text-gray-400">
        (₹{inrPrice} INR)
      </div>
      
      <button
        onClick={fetchExchangeRate}
        disabled={loading}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        title="Refresh exchange rate"
      >
        <FiRefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default CurrencyConverter;
