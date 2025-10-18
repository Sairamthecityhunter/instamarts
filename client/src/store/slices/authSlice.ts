import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isInstamartPlus: boolean;
  addresses: Address[];
  joinDate?: string;
  totalOrders?: number;
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

// Helper functions for localStorage operations
const getUserFromStorage = (): User | null => {
  try {
    const userData = localStorage.getItem('freshbazaar_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    localStorage.removeItem('freshbazaar_user');
    return null;
  }
};

const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('freshbazaar_token');
};

const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem('freshbazaar_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

const saveTokenToStorage = (token: string): void => {
  localStorage.setItem('freshbazaar_token', token);
};

const clearAuthFromStorage = (): void => {
  localStorage.removeItem('freshbazaar_user');
  localStorage.removeItem('freshbazaar_token');
};

// Initialize state with data from localStorage
const storedUser = getUserFromStorage();
const storedToken = getTokenFromStorage();

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!(storedUser && storedToken),
  isLoading: false,
  showAuthModal: false,
  authMode: 'login',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Save to localStorage
      saveUserToStorage(user);
      saveTokenToStorage(token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.showAuthModal = false;
      
      // Clear from localStorage
      clearAuthFromStorage();
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
        // Update localStorage with new user data
        saveUserToStorage(state.user);
      }
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      if (state.user) {
        state.user.addresses.push(action.payload);
        // Update localStorage with new user data
        saveUserToStorage(state.user);
      }
    },
    updateAddress: (state, action: PayloadAction<{ id: string; updates: Partial<Address> }>) => {
      if (state.user) {
        const index = state.user.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.user.addresses[index] = { ...state.user.addresses[index], ...action.payload.updates };
          // Update localStorage with new user data
          saveUserToStorage(state.user);
        }
      }
    },
    deleteAddress: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.addresses = state.user.addresses.filter(addr => addr.id !== action.payload);
        // Update localStorage with new user data
        saveUserToStorage(state.user);
      }
    },
    // New action to clear user data if localStorage is corrupted
    clearCorruptedData: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearAuthFromStorage();
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
  clearCorruptedData,
} = authSlice.actions;

export default authSlice.reducer; 