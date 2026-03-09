import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './cartSlice';

export interface Category {
  id: string;
  name: string;
  image: string;
  icon: string;
  productCount: number;
}

export interface ProductsState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  searchResults: Product[];
  searchQuery: string;
  selectedCategory: string | null;
  filters: {
    priceRange: [number, number];
    brands: string[];
    rating: number;
    inStock: boolean;
  };
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  recommendations: Product[];
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  featuredProducts: [],
  searchResults: [],
  searchQuery: '',
  selectedCategory: null,
  filters: {
    priceRange: [0, 1000],
    brands: [],
    rating: 0,
    inStock: true,
  },
  isLoading: false,
  hasMore: true,
  page: 1,
  recommendations: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    
    appendProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = [...state.products, ...action.payload];
    },
    
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    
    setSearchResults: (state, action: PayloadAction<Product[]>) => {
      state.searchResults = action.payload;
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    
    updateFilters: (state, action: PayloadAction<Partial<ProductsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        priceRange: [0, 1000],
        brands: [],
        rating: 0,
        inStock: true,
      };
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    
    setRecommendations: (state, action: PayloadAction<Product[]>) => {
      state.recommendations = action.payload;
    },
    
    updateProductStock: (state, action: PayloadAction<{ id: string; inStock: boolean }>) => {
      const { id, inStock } = action.payload;
      const product = state.products.find(p => p.id === id);
      if (product) {
        product.inStock = inStock;
      }
    },
    
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload); // Add to beginning of array
      // Update category count if needed
      const category = state.categories.find(c => c.id === action.payload.category);
      if (category) {
        category.productCount += 1;
      }
    },
    
    removeProduct: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const productIndex = state.products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        const product = state.products[productIndex];
        state.products.splice(productIndex, 1);
        
        // Update category count
        const category = state.categories.find(c => c.id === product.category);
        if (category && category.productCount > 0) {
          category.productCount -= 1;
        }
      }
    },
  },
});

export const {
  setProducts,
  appendProducts,
  setCategories,
  setFeaturedProducts,
  setSearchResults,
  setSearchQuery,
  setSelectedCategory,
  updateFilters,
  clearFilters,
  setLoading,
  setHasMore,
  setPage,
  setRecommendations,
  updateProductStock,
  addProduct,
  removeProduct,
} = productsSlice.actions;

export default productsSlice.reducer; 