import { configureStore } from '@reduxjs/toolkit';
import ContractReducer from './features/contractSlice';

export const store = configureStore({
  reducer: {
    app: ContractReducer,
  },
})