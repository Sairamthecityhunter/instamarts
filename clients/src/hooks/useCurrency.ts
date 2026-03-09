import { useState, useEffect } from 'react';
import { fetchExchangeRate, convertINRtoUSD, formatUSD } from '../utils/currency';

export const useCurrency = () => {
  const [exchangeRate, setExchangeRate] = useState<number>(0.012);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRate = async () => {
      try {
        const rate = await fetchExchangeRate();
        setExchangeRate(rate);
      } catch (error) {
        console.error('Failed to load exchange rate:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRate();
  }, []);

  const toUSD = (inrAmount: number): number => {
    return convertINRtoUSD(inrAmount, exchangeRate);
  };

  const formatPrice = (inrPrice: number): string => {
    return formatUSD(toUSD(inrPrice));
  };

  return {
    exchangeRate,
    loading,
    toUSD,
    formatPrice,
    refreshRate: async () => {
      setLoading(true);
      const rate = await fetchExchangeRate();
      setExchangeRate(rate);
      setLoading(false);
    },
  };
};

