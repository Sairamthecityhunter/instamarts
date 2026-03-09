import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import productsSlice from './slices/productsSlice';
import uiSlice from './slices/uiSlice';
import ordersSlice from './slices/ordersSlice';
import wishlistSlice from './slices/wishlistSlice';
import recentlyViewedSlice from './slices/recentlyViewedSlice';
import shoppingListsSlice from './slices/shoppingListsSlice';
import priceAlertsSlice from './slices/priceAlertsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productsSlice,
    ui: uiSlice,
    orders: ordersSlice,
    wishlist: wishlistSlice,
    recentlyViewed: recentlyViewedSlice,
    shoppingLists: shoppingListsSlice,
    priceAlerts: priceAlertsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 