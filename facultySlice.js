import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import FacultyProfileService from '../../services/facultyProfileService.js';
import axios from 'axios';

const initialState = {
  profile: null,
  marksFeed: [],
  dashboardData: null,
  studentMarksheet: null,
};

export const fetchFacultyProfile = createAsyncThunk('faculty/fetchFacultyProfile', async (userId, { rejectWithValue }) => {
  try {
    const data = await FacultyProfileService.getFacultyProfileByUserId(userId);
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch faculty profile');
  }
});

export const updateFacultyProfile = createAsyncThunk('faculty/updateFacultyProfile', async ({ facultyId, dataToSave }, { rejectWithValue }) => {
  try {
    await FacultyProfileService.updateFacultyProfile(facultyId, dataToSave);
    // Refetch updated profile
    const data = await FacultyProfileService.getFacultyProfileByUserId(facultyId);
    return data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update faculty profile');
  } 
});

export const fetchMarksfeedStudents = createAsyncThunk('faculty/fetchMarksfeedStudents', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/students');
    return res.data;
  } catch (err) {
    return rejectWithValue('Failed to fetch students');
  }
});

export const fetchMarksfeedSubjects = createAsyncThunk('faculty/fetchMarksfeedSubjects', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/subjects');
    return res.data;
  } catch (err) {
    return rejectWithValue('Failed to fetch subjects');
  }
});

export const saveMarks = createAsyncThunk('faculty/saveMarks', async (payload, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/marksheets', payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to save marks');
  }
});

export const searchStudentAndFetchMarksheet = createAsyncThunk(
  'faculty/searchStudentAndFetchMarksheet',
  async (searchInput, { rejectWithValue }) => {
    const API_BASE = 'http://localhost:5000';
    try {
      // First, find the student
      const res = await axios.get(`${API_BASE}/api/marksheets/search`, { params: { query: searchInput.trim() } });
      if (!res.data.student) {
        return rejectWithValue('No student found with the given Roll Number, Name, or Email.');
      }
      const student = res.data.student;
      // Then, fetch marks by rollNo or rollNumber
      const roll = student.rollNo || student.rollNumber;
      const token = localStorage.getItem('token');
      const marksRes = await axios.get(`${API_BASE}/api/marksheets/student/${roll}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return { student, subjects: marksRes.data };
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return rejectWithValue('No student found with the given Roll Number, Name, or Email.');
      } else if (err.response && err.response.data && err.response.data.error) {
        return rejectWithValue(err.response.data.error);
      } else {
        return rejectWithValue('An error occurred while searching.');
      }
    }
  }
);

const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setMarksFeed: (state, action) => {
      state.marksFeed = action.payload;
    },
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setStudentMarksheet: (state, action) => {
      state.studentMarksheet = action.payload;
    },
    resetSaveMarksStatus: (state) => {
      state.saveMarksSuccess = false;
      state.saveMarksError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacultyProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchFacultyProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchFacultyProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      .addCase(updateFacultyProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateFacultyProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateFacultyProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      .addCase(fetchMarksfeedStudents.pending, (state) => {
        state.marksFeedStudentsLoading = true;
        state.marksFeedStudentsError = null;
      })
      .addCase(fetchMarksfeedStudents.fulfilled, (state, action) => {
        state.marksFeedStudentsLoading = false;
        state.marksFeedStudents = action.payload;
      })
      .addCase(fetchMarksfeedStudents.rejected, (state, action) => {
        state.marksFeedStudentsLoading = false;
        state.marksFeedStudentsError = action.payload;
      })
      .addCase(fetchMarksfeedSubjects.pending, (state) => {
        state.marksFeedSubjectsLoading = true;
        state.marksFeedSubjectsError = null;
      })
      .addCase(fetchMarksfeedSubjects.fulfilled, (state, action) => {
        state.marksFeedSubjectsLoading = false;
        state.marksFeedSubjects = action.payload;
      })
      .addCase(fetchMarksfeedSubjects.rejected, (state, action) => {
        state.marksFeedSubjectsLoading = false;
        state.marksFeedSubjectsError = action.payload;
      })
      .addCase(saveMarks.pending, (state) => {
        state.saveMarksLoading = true;
        state.saveMarksError = null;
      })
      .addCase(saveMarks.fulfilled, (state, action) => {
        state.saveMarksLoading = false;
        state.saveMarksSuccess = true;
      })
      .addCase(saveMarks.rejected, (state, action) => {
        state.saveMarksLoading = false;
        state.saveMarksError = action.payload;
      })
      .addCase(searchStudentAndFetchMarksheet.pending, (state) => {
        state.studentMarksheetLoading = true;
        state.studentMarksheetError = '';
        state.studentMarksheetStudent = null;
        state.studentMarksheetSubjects = [];
        state.studentMarksheetSearchPerformed = false;
      })
      .addCase(searchStudentAndFetchMarksheet.fulfilled, (state, action) => {
        state.studentMarksheetLoading = false;
        state.studentMarksheetStudent = action.payload.student;
        state.studentMarksheetSubjects = action.payload.subjects;
        state.studentMarksheetError = '';
        state.studentMarksheetSearchPerformed = true;
      })
      .addCase(searchStudentAndFetchMarksheet.rejected, (state, action) => {
        state.studentMarksheetLoading = false;
        state.studentMarksheetError = action.payload;
        state.studentMarksheetStudent = null;
        state.studentMarksheetSubjects = [];
        state.studentMarksheetSearchPerformed = true;
      });
  },
});

export const {
  setProfile,
  setMarksFeed,
  setDashboardData,
  setStudentMarksheet,
  resetSaveMarksStatus,
} = facultySlice.actions;
export default facultySlice.reducer; 