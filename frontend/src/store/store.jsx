import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './reducers/FileSlice';

const store = configureStore({
  reducer: {
    files: fileReducer,
  },
});

export default store;
