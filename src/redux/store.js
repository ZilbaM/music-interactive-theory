// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk'; // Import thunk middleware
import rootReducer from './reducers'; // Ensure this path is correct

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
