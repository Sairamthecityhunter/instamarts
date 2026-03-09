import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface DeliveryInfo {
  estimatedTime: number;
  address: string;
  isExpressDelivery: boolean;
}

interface UIState {
  isLoading: boolean;
  notifications: Notification[];
  sidebar: {
    isOpen: boolean;
    activeTab: 'categories' | 'filters' | 'menu';
  };
  modals: {
    productDetails: {
      isOpen: boolean;
      productId: string | null;
    };
    addressPicker: {
      isOpen: boolean;
    };
    orderTracking: {
      isOpen: boolean;
      orderId: string | null;
    };
  };
  deliveryInfo: DeliveryInfo;
  searchSuggestions: string[];
  showInstallPrompt: boolean;
}

const initialState: UIState = {
  isLoading: false,
  notifications: [],
  sidebar: {
    isOpen: false,
    activeTab: 'categories',
  },
  modals: {
    productDetails: {
      isOpen: false,
      productId: null,
    },
    addressPicker: {
      isOpen: false,
    },
    orderTracking: {
      isOpen: false,
      orderId: null,
    },
  },
  deliveryInfo: {
    estimatedTime: 20,
    address: '',
    isExpressDelivery: false,
  },
  searchSuggestions: [],
  showInstallPrompt: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    toggleSidebar: (state, action: PayloadAction<boolean | undefined>) => {
      state.sidebar.isOpen = action.payload !== undefined ? action.payload : !state.sidebar.isOpen;
    },
    
    setSidebarTab: (state, action: PayloadAction<UIState['sidebar']['activeTab']>) => {
      state.sidebar.activeTab = action.payload;
    },
    
    openProductModal: (state, action: PayloadAction<string>) => {
      state.modals.productDetails.isOpen = true;
      state.modals.productDetails.productId = action.payload;
    },
    
    closeProductModal: (state) => {
      state.modals.productDetails.isOpen = false;
      state.modals.productDetails.productId = null;
    },
    
    openAddressPicker: (state) => {
      state.modals.addressPicker.isOpen = true;
    },
    
    closeAddressPicker: (state) => {
      state.modals.addressPicker.isOpen = false;
    },
    
    openOrderTracking: (state, action: PayloadAction<string>) => {
      state.modals.orderTracking.isOpen = true;
      state.modals.orderTracking.orderId = action.payload;
    },
    
    closeOrderTracking: (state) => {
      state.modals.orderTracking.isOpen = false;
      state.modals.orderTracking.orderId = null;
    },
    
    updateDeliveryInfo: (state, action: PayloadAction<Partial<DeliveryInfo>>) => {
      state.deliveryInfo = { ...state.deliveryInfo, ...action.payload };
    },
    
    setSearchSuggestions: (state, action: PayloadAction<string[]>) => {
      state.searchSuggestions = action.payload;
    },
    
    showInstallPrompt: (state, action: PayloadAction<boolean>) => {
      state.showInstallPrompt = action.payload;
    },
  },
});

export const {
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleSidebar,
  setSidebarTab,
  openProductModal,
  closeProductModal,
  openAddressPicker,
  closeAddressPicker,
  openOrderTracking,
  closeOrderTracking,
  updateDeliveryInfo,
  setSearchSuggestions,
  showInstallPrompt,
} = uiSlice.actions;

export default uiSlice.reducer; 