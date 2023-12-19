import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user.store';
import fileReducer from './file.store';

export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
