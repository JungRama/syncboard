import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user.store';
import fileReducer from './file.store';
import navigationReducer from './navigation.store';

export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
