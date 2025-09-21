import { configureStore } from '@reduxjs/toolkit';
// Import slices here as you create them
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import facultyReducer from './slices/facultySlice';
import studentReducer from './slices/studentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    faculty: facultyReducer,
    student: studentReducer,
    // Add your reducers here
  },
}); 