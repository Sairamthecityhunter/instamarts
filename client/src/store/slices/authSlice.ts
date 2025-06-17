import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isInstamartPlus: boolean;
  addresses: Address[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showAuthModal: boolean;
  authMode: 'login' | 'signup';
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  showAuthModal: false,
  authMode: 'login',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showAuthModal: (state, action: PayloadAction<'login' | 'signup'>) => {
      state.showAuthModal = true;
      state.authMode = action.payload;
    },
    hideAuthModal: (state) => {
      state.showAuthModal = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      if (state.user) {
        state.user.addresses.push(action.payload);
      }
    },
    updateAddress: (state, action: PayloadAction<{ id: string; updates: Partial<Address> }>) => {
      if (state.user) {
        const index = state.user.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.user.addresses[index] = { ...state.user.addresses[index], ...action.payload.updates };
        }
      }
    },
    deleteAddress: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.addresses = state.user.addresses.filter(addr => addr.id !== action.payload);
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  showAuthModal,
  hideAuthModal,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} = authSlice.actions;

export default authSlice.reducer; 