import { createSlice } from '@reduxjs/toolkit';

export const navigationStore = createSlice({
  name: 'navigation',
  initialState: {
    showSidebar: false,
  } as {
    showSidebar: boolean;
  },
  reducers: {
    toogleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const { toogleSidebar } = navigationStore.actions;

export default navigationStore.reducer;
