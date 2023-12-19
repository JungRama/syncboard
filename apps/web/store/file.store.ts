import { createSlice } from '@reduxjs/toolkit';
import { Editor } from '@tldraw/tldraw';

export const fileStore = createSlice({
  name: 'file',
  initialState: {
    editor: null,
  } as {
    editor: Editor | null;
  },
  reducers: {
    setEditor: (state, action) => {
      state.editor = action.payload ?? null;
    },
  },
});

export const { setEditor } = fileStore.actions;

export default fileStore.reducer;
