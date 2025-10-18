import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  storeName: string;
  storeImage: string;
  items: OrderItem[];
  total: number;
  status: 'delivered' | 'cancelled' | 'in_progress' | 'confirmed' | 'preparing' | 'out_for_delivery';
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryInstructions?: string;
}

export interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

// LocalStorage helper functions
const ORDERS_STORAGE_KEY = 'freshbazaar_orders';

const getOrdersFromStorage = (): Order[] => {
  try {
    const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
    return [];
  }
};

const saveOrdersToStorage = (orders: Order[]): void => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
};

const initialState: OrdersState = {
  orders: getOrdersFromStorage(),
  isLoading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload); // Add to beginning for recent orders first
      saveOrdersToStorage(state.orders);
      state.isLoading = false;
      state.error = null;
    },
    
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
        if (status === 'delivered') {
          order.deliveryDate = new Date().toISOString();
        }
        saveOrdersToStorage(state.orders);
      }
    },
    
    clearOrders: (state) => {
      state.orders = [];
      saveOrdersToStorage([]);
    },
    
    deleteOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      state.orders = state.orders.filter(order => order.id !== orderId);
      saveOrdersToStorage(state.orders);
    },
    
    loadOrders: (state) => {
      state.orders = getOrdersFromStorage();
    },
  },
});

export const {
  setLoading,
  setError,
  addOrder,
  updateOrderStatus,
  clearOrders,
  deleteOrder,
  loadOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer; 