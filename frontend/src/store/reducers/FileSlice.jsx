import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [],
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    uploadFileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    uploadFileSuccess: (state, action) => {
      state.loading = false;
      state.files.push(action.payload);
    },
    uploadFileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { uploadFileRequest, uploadFileSuccess, uploadFileFail } = fileSlice.actions;

export default fileSlice.reducer;
