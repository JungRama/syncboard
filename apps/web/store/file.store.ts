import { createSlice } from '@reduxjs/toolkit';
import { Editor } from '@tldraw/tldraw';

export const fileStore = createSlice({
  name: 'file',
  initialState: {
    editor: null,
    fileItemView: 'GRID',
    favorites: [],
  } as {
    editor: Editor | null;
    fileItemView: 'GRID' | 'LIST';
    favorites: any[];
  },
  reducers: {
    setEditor: (state, action) => {
      state.editor = action.payload ?? null;
    },
    setFileItemView: (state, action) => {
      state.fileItemView = action.payload ?? 'GRID';
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload ?? null;
    },
  },
});

export const { setEditor, setFileItemView, setFavorites } = fileStore.actions;

export default fileStore.reducer;
