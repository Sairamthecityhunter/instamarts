import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// Get API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Important for httpOnly cookies
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add access token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (access token)
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the access token using refresh token from cookie
        const refreshResponse = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data;

        // Store new access token
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Redirect to login if not already on auth page
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        
        toast.error('Session expired. Please login again.');
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = (error.response.data as any)?.error || (error.response.data as any)?.message || error.message || 'An error occurred';
      
      // Don't show toast for 401 errors (handled above)
      // For 404, show a more specific message
      // For 500, show server error message
      if (status !== 401) {
        if (status === 404) {
          // 404 errors are usually handled by the component, don't show generic error
          console.warn('Resource not found:', error.config?.url);
        } else if (status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(message);
        }
      }
    } else if (error.request) {
      // Network error - request was made but no response received
      // Check if it's a timeout or connection error
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Request timeout. Please try again.');
      } else {
        toast.error('Network error. Please check your connection and ensure the server is running.');
      }
    } else {
      // Error setting up the request
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // Auth
  auth: {
    register: (data: { name: string; email: string; phone?: string; password: string }) =>
      api.post('/auth/register', data),
    
    login: (data: { email: string; password: string }) =>
      api.post('/auth/login', data),
    
    logout: () =>
      api.post('/auth/logout'),
    
    logoutAll: () =>
      api.post('/auth/logout-all'),
    
    refresh: () =>
      api.post('/auth/refresh', {}, { withCredentials: true }),
    
    getMe: () =>
      api.get('/auth/me'),
    
    updateProfile: (data: { name?: string; phone?: string; avatar?: string }) =>
      api.put('/auth/me', data),
    
    sendOTP: (data: { phone: string }) =>
      api.post('/auth/send-otp', data),
    
    verifyOTP: (data: { phone: string; otp: string }) =>
      api.post('/auth/verify-otp', data),
  },

  // Products
  products: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    }) =>
      api.get('/products', { params }),
    
    getById: (id: string) =>
      api.get(`/products/${id}`),
    
    getCategories: () =>
      api.get('/products/categories/list'),
    
    getFeatured: (limit?: number) =>
      api.get('/products/featured/list', { params: { limit } }),
    
    getRecommendations: (userId: string, limit?: number) =>
      api.get(`/products/recommendations/${userId}`, { params: { limit } }),
    
    getSearchSuggestions: (query: string) =>
      api.get('/products/search/suggestions', { params: { q: query } }),
  },

  // Cart
  cart: {
    getItems: () =>
      api.get('/cart'),
    
    addItem: (data: { productId: string; quantity: number }) =>
      api.post('/cart', data),
    
    updateItem: (itemId: string, data: { quantity: number }) =>
      api.put(`/cart/${itemId}`, data),
    
    removeItem: (itemId: string) =>
      api.delete(`/cart/${itemId}`),
    
    clearCart: () =>
      api.delete('/cart'),
  },

  // Orders
  orders: {
    getAll: () =>
      api.get('/orders'),
    
    getById: (orderId: string) =>
      api.get(`/orders/${orderId}`),
    
    create: (data: {
      items: Array<{ productId: string; quantity: number }>;
      shippingAddress: any;
      paymentMethod: string;
      deliveryInstructions?: string;
    }) =>
      api.post('/orders', data),
    
    cancel: (orderId: string) =>
      api.post(`/orders/${orderId}/cancel`),
  },

  // Addresses
  addresses: {
    getAll: () =>
      api.get('/addresses'),
    
    getById: (addressId: string) =>
      api.get(`/addresses/${addressId}`),
    
    create: (data: {
      type: string;
      address: string;
      city: string;
      state?: string;
      pincode: string;
      country?: string;
      coordinates?: { lat: number; lng: number };
      isDefault?: boolean;
    }) =>
      api.post('/addresses', data),
    
    update: (addressId: string, data: any) =>
      api.put(`/addresses/${addressId}`, data),
    
    delete: (addressId: string) =>
      api.delete(`/addresses/${addressId}`),
  },

  // Contact
  contact: {
    sendMessage: (data: {
      firstName: string;
      lastName: string;
      email: string;
      subject: string;
      message: string;
    }) =>
      api.post('/contact', data),
  },
};

export default api;

