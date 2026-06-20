import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';

/**
 * This is the main store for the app. It uses Redux Toolkit to create a store with a single slice.
 * The slice is responsible for managing the UI state of the app.
 * @returns {void}
 * @description This is the main store for the app. It uses Redux Toolkit to create a store with a single slice.
 */
export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
});

// These types help with TS throughout the app:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
