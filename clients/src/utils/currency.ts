// Currency conversion utility with real-time exchange rates

let exchangeRate: number = 0.012; // Default fallback rate (1 INR = 0.012 USD)
let lastFetchTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

// Fetch real-time exchange rate from API
export const fetchExchangeRate = async (): Promise<number> => {
  const now = Date.now();
  
  // Return cached rate if still valid
  if (now - lastFetchTime < CACHE_DURATION && exchangeRate > 0) {
    return exchangeRate;
  }

  try {
    // Using exchangerate-api.com (free tier, no API key needed)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
    const data = await response.json();
    
    if (data.rates && data.rates.USD) {
      exchangeRate = data.rates.USD;
      lastFetchTime = now;
      return exchangeRate;
    }
  } catch (error) {
    console.error('Failed to fetch exchange rate, using fallback:', error);
    // Try alternative API
    try {
      const response = await fetch('https://api.fixer.io/latest?base=INR&symbols=USD');
      const data = await response.json();
      if (data.rates && data.rates.USD) {
        exchangeRate = data.rates.USD;
        lastFetchTime = now;
        return exchangeRate;
      }
    } catch (error2) {
      console.error('Failed to fetch from alternative API:', error2);
    }
  }

  // Return cached or default rate
  return exchangeRate;
};

// Convert INR to USD
export const convertINRtoUSD = (inrAmount: number, rate?: number): number => {
  const currentRate = rate || exchangeRate;
  return inrAmount * currentRate;
};

// Format price in USD
export const formatUSD = (amount: number, showCents: boolean = true): string => {
  if (showCents) {
    return `$${amount.toFixed(2)}`;
  }
  return `$${Math.round(amount)}`;
};

// Format price with currency symbol
export const formatPrice = (inrPrice: number, showINR: boolean = false): string => {
  const usdPrice = convertINRtoUSD(inrPrice);
  if (showINR) {
    return `${formatUSD(usdPrice)} (₹${inrPrice})`;
  }
  return formatUSD(usdPrice);
};

// Initialize exchange rate on app load
export const initializeExchangeRate = async (): Promise<void> => {
  await fetchExchangeRate();
};

