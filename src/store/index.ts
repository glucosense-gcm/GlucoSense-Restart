import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
