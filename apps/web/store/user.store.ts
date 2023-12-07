import { GetMeQuery } from '@/codegen/graphql';
import { createSlice } from '@reduxjs/toolkit';

export const userStore = createSlice({
  name: 'user',
  initialState: {
    user: null,
  } as { user: GetMeQuery['getMe']['user'] | null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload ?? null;
    },
  },
});

export const { setUser } = userStore.actions;

export default userStore.reducer;
