import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  dashboard: null,
  marks: [],
  profile: null,
};

export const fetchStudentDashboard = createAsyncThunk('student/fetchStudentDashboard', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/student-dashboard/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch student data.');
  }
});

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setDashboard: (state, action) => {
      state.dashboard = action.payload;
    },
    setMarks: (state, action) => {
      state.marks = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = '';
      })
      .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload.studentInfo;
        state.marks = action.payload.subjects;
      })
      .addCase(fetchStudentDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      });
  },
});

export const {
  setDashboard,
  setMarks,
  setProfile,
} = studentSlice.actions;
export default studentSlice.reducer; 