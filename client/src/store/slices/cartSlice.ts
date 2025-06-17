import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  unit: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  appliedCoupon?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  };
  isLoading: boolean;
  lastUpdated: Date;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  deliveryFee: 29,
  freeDeliveryThreshold: 199,
  isLoading: false,
  lastUpdated: new Date(),
};

const calculateTotals = (state: CartState) => {
  state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  state.totalAmount = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  state.lastUpdated = new Date();
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          addedAt: new Date(),
        });
      }
      
      calculateTotals(state);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      calculateTotals(state);
    },
    
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.product.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      
      calculateTotals(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = undefined;
      calculateTotals(state);
    },
    
    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number; type: 'percentage' | 'fixed' }>) => {
      state.appliedCoupon = action.payload;
    },
    
    removeCoupon: (state) => {
      state.appliedCoupon = undefined;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  setLoading,
} = cartSlice.actions;

export default cartSlice.reducer; 