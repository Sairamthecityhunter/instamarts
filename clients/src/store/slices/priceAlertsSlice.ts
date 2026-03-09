import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  currentPrice: number;
  targetPrice: number;
  createdAt: string;
  notified: boolean;
}

interface PriceAlertsState {
  alerts: PriceAlert[];
}

const initialState: PriceAlertsState = {
  alerts: JSON.parse(localStorage.getItem('priceAlerts') || '[]'),
};

const priceAlertsSlice = createSlice({
  name: 'priceAlerts',
  initialState,
  reducers: {
    addPriceAlert: (state, action: PayloadAction<Omit<PriceAlert, 'id' | 'createdAt' | 'notified'>>) => {
      const existingAlert = state.alerts.find(
        alert => alert.productId === action.payload.productId
      );
      
      if (existingAlert) {
        existingAlert.targetPrice = action.payload.targetPrice;
        existingAlert.currentPrice = action.payload.currentPrice;
      } else {
        state.alerts.push({
          ...action.payload,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          notified: false,
        });
      }
      
      localStorage.setItem('priceAlerts', JSON.stringify(state.alerts));
    },
    removePriceAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
      localStorage.setItem('priceAlerts', JSON.stringify(state.alerts));
    },
    markAsNotified: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.notified = true;
        localStorage.setItem('priceAlerts', JSON.stringify(state.alerts));
      }
    },
    clearPriceAlerts: (state) => {
      state.alerts = [];
      localStorage.removeItem('priceAlerts');
    },
  },
});

export const { addPriceAlert, removePriceAlert, markAsNotified, clearPriceAlerts } =
  priceAlertsSlice.actions;

export default priceAlertsSlice.reducer;
