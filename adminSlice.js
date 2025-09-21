import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  dashboardStats: null,
  departments: [],
  subjects: [],
  semesters: [],
  pendingRegistrations: [],
  students: [],
  faculties: [],
};

export const fetchStudents = createAsyncThunk('admin/fetchStudents', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/students');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch students');
  }
});

export const addStudent = createAsyncThunk('admin/addStudent', async (studentData, { rejectWithValue }) => {
  try {
    await axios.post('http://localhost:5000/api/students', studentData);
    // Refetch students after adding
    const res = await axios.get('http://localhost:5000/api/students');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to add student');
  }
});

export const deleteStudent = createAsyncThunk('admin/deleteStudent', async (studentId, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/students/${studentId}`);
    // Refetch students after deleting
    const res = await axios.get('http://localhost:5000/api/students');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete student');
  }
});

export const fetchSubjects = createAsyncThunk('admin/fetchSubjects', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/subjects');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch subjects');
  }
});

export const addSubject = createAsyncThunk('admin/addSubject', async (subjectData, { rejectWithValue }) => {
  try {
    await axios.post('http://localhost:5000/api/subjects', subjectData);
    const res = await axios.get('http://localhost:5000/api/subjects');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to add subject');
  }
});

export const editSubject = createAsyncThunk('admin/editSubject', async ({ id, subjectData }, { rejectWithValue }) => {
  try {
    await axios.put(`http://localhost:5000/api/subjects/${id}`, subjectData);
    const res = await axios.get('http://localhost:5000/api/subjects');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to edit subject');
  }
});

export const deleteSubject = createAsyncThunk('admin/deleteSubject', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/subjects/${id}`);
    const res = await axios.get('http://localhost:5000/api/subjects');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete subject');
  }
});

export const fetchSemesters = createAsyncThunk('admin/fetchSemesters', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/semesters');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch semesters');
  }
});

export const addSemester = createAsyncThunk('admin/addSemester', async (semesterData, { rejectWithValue }) => {
  try {
    await axios.post('http://localhost:5000/api/semesters', semesterData);
    const res = await axios.get('http://localhost:5000/api/semesters');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to add semester');
  }
});

export const editSemester = createAsyncThunk('admin/editSemester', async ({ id, semesterData }, { rejectWithValue }) => {
  try {
    await axios.put(`http://localhost:5000/api/semesters/${id}`, semesterData);
    const res = await axios.get('http://localhost:5000/api/semesters');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to edit semester');
  }
});

export const deleteSemester = createAsyncThunk('admin/deleteSemester', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/semesters/${id}`);
    const res = await axios.get('http://localhost:5000/api/semesters');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete semester');
  }
});

export const fetchDepartments = createAsyncThunk('admin/fetchDepartments', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/departments');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch departments');
  }
});

export const addDepartment = createAsyncThunk('admin/addDepartment', async (departmentData, { rejectWithValue }) => {
  try {
    await axios.post('http://localhost:5000/api/departments', departmentData);
    const res = await axios.get('http://localhost:5000/api/departments');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to add department');
  }
});

export const editDepartment = createAsyncThunk('admin/editDepartment', async ({ id, departmentData }, { rejectWithValue }) => {
  try {
    await axios.put(`http://localhost:5000/api/departments/${id}`, departmentData);
    const res = await axios.get('http://localhost:5000/api/departments');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to edit department');
  }
});

export const deleteDepartment = createAsyncThunk('admin/deleteDepartment', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/departments/${id}`);
    const res = await axios.get('http://localhost:5000/api/departments');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete department');
  }
});

export const fetchFaculty = createAsyncThunk('admin/fetchFaculty', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/users?role=faculty');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch faculty');
  }
});

export const addFaculty = createAsyncThunk('admin/addFaculty', async (facultyData, { rejectWithValue }) => {
  try {
    await axios.post('http://localhost:5000/api/faculty', facultyData);
    const res = await axios.get('http://localhost:5000/api/users?role=faculty');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to add faculty');
  }
});

export const editFaculty = createAsyncThunk('admin/editFaculty', async ({ id, facultyData }, { rejectWithValue }) => {
  try {
    await axios.put(`http://localhost:5000/api/users/${id}`, facultyData);
    const res = await axios.get('http://localhost:5000/api/users?role=faculty');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to edit faculty');
  }
});

export const deleteFaculty = createAsyncThunk('admin/deleteFaculty', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    const res = await axios.get('http://localhost:5000/api/users?role=faculty');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete faculty');
  }
});

export const fetchPendingRegistrations = createAsyncThunk('admin/fetchPendingRegistrations', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/pending-registrations');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch pending registrations');
  }
});

export const approvePendingRegistration = createAsyncThunk('admin/approvePendingRegistration', async (id, { rejectWithValue }) => {
  try {
    await axios.post(`http://localhost:5000/api/pending-registrations/${id}/approve`);
    const res = await axios.get('http://localhost:5000/api/pending-registrations');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to approve registration');
  }
});

export const rejectPendingRegistration = createAsyncThunk('admin/rejectPendingRegistration', async (id, { rejectWithValue }) => {
  try {
    await axios.post(`http://localhost:5000/api/pending-registrations/${id}/reject`);
    const res = await axios.get('http://localhost:5000/api/pending-registrations');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to reject registration');
  }
});

export const fetchDashboardStats = createAsyncThunk('admin/fetchDashboardStats', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('http://localhost:5000/api/dashboard-stats');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch dashboard stats');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
    setSemesters: (state, action) => {
      state.semesters = action.payload;
    },
    setPendingRegistrations: (state, action) => {
      state.pendingRegistrations = action.payload;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setFaculties: (state, action) => {
      state.faculties = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.studentsLoading = true;
        state.studentsError = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.studentsLoading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.studentsLoading = false;
        state.studentsError = action.payload;
      })
      .addCase(addStudent.pending, (state) => {
        state.studentsLoading = true;
        state.studentsError = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.studentsLoading = false;
        state.students = action.payload;
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.studentsLoading = false;
        state.studentsError = action.payload;
      })
      .addCase(deleteStudent.pending, (state) => {
        state.studentsLoading = true;
        state.studentsError = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.studentsLoading = false;
        state.students = action.payload;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.studentsLoading = false;
        state.studentsError = action.payload;
      })
      .addCase(fetchSubjects.pending, (state) => {
        state.subjectsLoading = true;
        state.subjectsError = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjectsLoading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.subjectsLoading = false;
        state.subjectsError = action.payload;
      })
      .addCase(addSubject.pending, (state) => {
        state.subjectsLoading = true;
        state.subjectsError = null;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.subjectsLoading = false;
        state.subjects = action.payload;
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.subjectsLoading = false;
        state.subjectsError = action.payload;
      })
      .addCase(editSubject.pending, (state) => {
        state.subjectsLoading = true;
        state.subjectsError = null;
      })
      .addCase(editSubject.fulfilled, (state, action) => {
        state.subjectsLoading = false;
        state.subjects = action.payload;
      })
      .addCase(editSubject.rejected, (state, action) => {
        state.subjectsLoading = false;
        state.subjectsError = action.payload;
      })
      .addCase(deleteSubject.pending, (state) => {
        state.subjectsLoading = true;
        state.subjectsError = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjectsLoading = false;
        state.subjects = action.payload;
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.subjectsLoading = false;
        state.subjectsError = action.payload;
      })
      .addCase(fetchSemesters.pending, (state) => {
        state.semestersLoading = true;
        state.semestersError = null;
      })
      .addCase(fetchSemesters.fulfilled, (state, action) => {
        state.semestersLoading = false;
        state.semesters = action.payload;
      })
      .addCase(fetchSemesters.rejected, (state, action) => {
        state.semestersLoading = false;
        state.semestersError = action.payload;
      })
      .addCase(addSemester.pending, (state) => {
        state.semestersLoading = true;
        state.semestersError = null;
      })
      .addCase(addSemester.fulfilled, (state, action) => {
        state.semestersLoading = false;
        state.semesters = action.payload;
      })
      .addCase(addSemester.rejected, (state, action) => {
        state.semestersLoading = false;
        state.semestersError = action.payload;
      })
      .addCase(editSemester.pending, (state) => {
        state.semestersLoading = true;
        state.semestersError = null;
      })
      .addCase(editSemester.fulfilled, (state, action) => {
        state.semestersLoading = false;
        state.semesters = action.payload;
      })
      .addCase(editSemester.rejected, (state, action) => {
        state.semestersLoading = false;
        state.semestersError = action.payload;
      })
      .addCase(deleteSemester.pending, (state) => {
        state.semestersLoading = true;
        state.semestersError = null;
      })
      .addCase(deleteSemester.fulfilled, (state, action) => {
        state.semestersLoading = false;
        state.semesters = action.payload;
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        state.semestersLoading = false;
        state.semestersError = action.payload;
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.departmentsLoading = true;
        state.departmentsError = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departmentsLoading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.departmentsLoading = false;
        state.departmentsError = action.payload;
      })
      .addCase(addDepartment.pending, (state) => {
        state.departmentsLoading = true;
        state.departmentsError = null;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.departmentsLoading = false;
        state.departments = action.payload;
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.departmentsLoading = false;
        state.departmentsError = action.payload;
      })
      .addCase(editDepartment.pending, (state) => {
        state.departmentsLoading = true;
        state.departmentsError = null;
      })
      .addCase(editDepartment.fulfilled, (state, action) => {
        state.departmentsLoading = false;
        state.departments = action.payload;
      })
      .addCase(editDepartment.rejected, (state, action) => {
        state.departmentsLoading = false;
        state.departmentsError = action.payload;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.departmentsLoading = true;
        state.departmentsError = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departmentsLoading = false;
        state.departments = action.payload;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.departmentsLoading = false;
        state.departmentsError = action.payload;
      })
      .addCase(fetchFaculty.pending, (state) => {
        state.facultiesLoading = true;
        state.facultiesError = null;
      })
      .addCase(fetchFaculty.fulfilled, (state, action) => {
        state.facultiesLoading = false;
        state.faculties = action.payload;
      })
      .addCase(fetchFaculty.rejected, (state, action) => {
        state.facultiesLoading = false;
        state.facultiesError = action.payload;
      })
      .addCase(addFaculty.pending, (state) => {
        state.facultiesLoading = true;
        state.facultiesError = null;
      })
      .addCase(addFaculty.fulfilled, (state, action) => {
        state.facultiesLoading = false;
        state.faculties = action.payload;
      })
      .addCase(addFaculty.rejected, (state, action) => {
        state.facultiesLoading = false;
        state.facultiesError = action.payload;
      })
      .addCase(editFaculty.pending, (state) => {
        state.facultiesLoading = true;
        state.facultiesError = null;
      })
      .addCase(editFaculty.fulfilled, (state, action) => {
        state.facultiesLoading = false;
        state.faculties = action.payload;
      })
      .addCase(editFaculty.rejected, (state, action) => {
        state.facultiesLoading = false;
        state.facultiesError = action.payload;
      })
      .addCase(deleteFaculty.pending, (state) => {
        state.facultiesLoading = true;
        state.facultiesError = null;
      })
      .addCase(deleteFaculty.fulfilled, (state, action) => {
        state.facultiesLoading = false;
        state.faculties = action.payload;
      })
      .addCase(deleteFaculty.rejected, (state, action) => {
        state.facultiesLoading = false;
        state.facultiesError = action.payload;
      })
      .addCase(fetchPendingRegistrations.pending, (state) => {
        state.pendingRegistrationsLoading = true;
        state.pendingRegistrationsError = null;
      })
      .addCase(fetchPendingRegistrations.fulfilled, (state, action) => {
        state.pendingRegistrationsLoading = false;
        state.pendingRegistrations = action.payload;
      })
      .addCase(fetchPendingRegistrations.rejected, (state, action) => {
        state.pendingRegistrationsLoading = false;
        state.pendingRegistrationsError = action.payload;
      })
      .addCase(approvePendingRegistration.pending, (state) => {
        state.pendingRegistrationsLoading = true;
        state.pendingRegistrationsError = null;
      })
      .addCase(approvePendingRegistration.fulfilled, (state, action) => {
        state.pendingRegistrationsLoading = false;
        state.pendingRegistrations = action.payload;
      })
      .addCase(approvePendingRegistration.rejected, (state, action) => {
        state.pendingRegistrationsLoading = false;
        state.pendingRegistrationsError = action.payload;
      })
      .addCase(rejectPendingRegistration.pending, (state) => {
        state.pendingRegistrationsLoading = true;
        state.pendingRegistrationsError = null;
      })
      .addCase(rejectPendingRegistration.fulfilled, (state, action) => {
        state.pendingRegistrationsLoading = false;
        state.pendingRegistrations = action.payload;
      })
      .addCase(rejectPendingRegistration.rejected, (state, action) => {
        state.pendingRegistrationsLoading = false;
        state.pendingRegistrationsError = action.payload;
      })
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardStatsLoading = true;
        state.dashboardStatsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStatsLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardStatsLoading = false;
        state.dashboardStatsError = action.payload;
      });
  },
});

export const {
  setDashboardStats,
  setDepartments,
  setSubjects,
  setSemesters,
  setPendingRegistrations,
  setStudents,
  setFaculties,
} = adminSlice.actions;
export default adminSlice.reducer; 