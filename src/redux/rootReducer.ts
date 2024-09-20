import {combineReducers} from '@reduxjs/toolkit';
import acc2kSlice from './slices/acc2kSlice';

export const rootReducer = combineReducers({
  acc2kSlice,
});
