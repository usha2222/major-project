import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/student-dashboard`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchStudentDashboard() {
  const res = await axios.get(`${API_BASE}/me`, { headers: getAuthHeaders() });
  return res.data;
} 