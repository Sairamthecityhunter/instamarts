import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecentlyViewedItem {
  id: string;
  name: string;
  price: number;
  image: string;
  viewedAt: string;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  maxItems: number;
}

const initialState: RecentlyViewedState = {
  items: JSON.parse(localStorage.getItem('recentlyViewed') || '[]'),
  maxItems: 20,
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addToRecentlyViewed: (state, action: PayloadAction<Omit<RecentlyViewedItem, 'viewedAt'>>) => {
      // Remove if already exists
      state.items = state.items.filter(item => item.id !== action.payload.id);
      
      // Add to beginning
      state.items.unshift({
        ...action.payload,
        viewedAt: new Date().toISOString(),
      });
      
      // Keep only maxItems
      if (state.items.length > state.maxItems) {
        state.items = state.items.slice(0, state.maxItems);
      }
      
      localStorage.setItem('recentlyViewed', JSON.stringify(state.items));
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
      localStorage.removeItem('recentlyViewed');
    },
  },
});

export const { addToRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
