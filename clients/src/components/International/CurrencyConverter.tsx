import React, { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { fetchExchangeRate, convertINRtoUSD, formatUSD } from '../../utils/currency';

interface CurrencyConverterProps {
  inrPrice: number;
  className?: string;
  showINR?: boolean;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ 
  inrPrice, 
  className = '',
  showINR = false 
}) => {
  const [exchangeRate, setExchangeRate] = useState<number>(0.012);
  const [usdPrice, setUsdPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadRate = async () => {
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
      setUsdPrice(convertINRtoUSD(inrPrice, rate));
    };
    loadRate();
  }, [inrPrice]);

  const refreshRate = async () => {
    setLoading(true);
    try {
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
      setUsdPrice(convertINRtoUSD(inrPrice, rate));
    } catch (error) {
      console.error('Failed to refresh exchange rate:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-lg font-bold text-gray-900">
          {formatUSD(usdPrice)}
        </span>
        <span className="text-sm text-gray-500">USD</span>
      </div>
      
      {showINR && (
      <div className="text-xs text-gray-400">
        (₹{inrPrice} INR)
      </div>
      )}
      
      <button
        onClick={refreshRate}
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
