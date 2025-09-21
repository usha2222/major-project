import React, { useState, useEffect } from 'react';
import DepartmentPage from '../admin/DepartmentPage';
import Semester from '../admin/Semester';
import Subject from '../admin/Subject';
import Student from '../admin/Student';
import Faculty from '../admin/Facutly';
import PendingRegistrations from './PendingRegistrations';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardStats } from '../../store/slices/adminSlice';
import { updateProfile } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const dispatch = useDispatch();
  const dashboardStats = useSelector(state => state.admin.dashboardStats);
  const statsLoading = useSelector(state => state.admin.dashboardStatsLoading);
  const statsError = useSelector(state => state.admin.dashboardStatsError);
  const authUser = useSelector(state => state.auth.user);

  // Debug: Log user data when it changes
  useEffect(() => {
    console.log('Current authUser:', authUser);
  }, [authUser]);

  // Debug: Log when profile modal opens
  useEffect(() => {
    if (isProfileOpen) {
      console.log('Profile modal opened, authUser:', authUser);
    }
  }, [isProfileOpen, authUser]);

  // Initialize edit form data when profile opens or user data changes
  useEffect(() => {
    if (authUser) {
      setEditFormData({
        name: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        address: authUser.address || '',
        dob: authUser.dob ? new Date(authUser.dob).toISOString().split('T')[0] : '',
        department: authUser.department || '',
        designation: authUser.designation || ''
      });
    }
  }, [authUser]);

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Basic validation
      if (!editFormData.name || !editFormData.email) {
        toast.error('Name and Email are required fields');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      console.log('Updating profile for user:', authUser._id);
      console.log('Update data:', editFormData);
      
      const response = await fetch(`http://localhost:5000/api/users/${authUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Profile updated successfully:', updatedUser);
        
        // Update Redux state with new user data
        dispatch(updateProfile(editFormData));
        
        // Close edit mode
        setIsEditMode(false);
        
        // Show success message
        toast.success('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', response.status, errorData);
        toast.error(`Failed to update profile: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(`Error updating profile: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form data to original values
    if (authUser) {
      setEditFormData({
        name: authUser.name || '',
        email: authUser.email || '',
        phone: authUser.phone || '',
        address: authUser.address || '',
        dob: authUser.dob ? new Date(authUser.dob).toISOString().split('T')[0] : '',
        department: authUser.department || '',
        designation: authUser.designation || ''
      });
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: 'pending-registrations', label: 'Pending Registrations', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'semester', label: 'Semester', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'subject', label: 'Subject', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { id: 'student', label: 'Student', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { id: 'faculty', label: 'Faculty', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { id: 'department', label: 'Department', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )},
  ];

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Stats Cards */}
            {statsLoading ? (
              <div className="col-span-4 text-center py-8">Loading...</div>
            ) : statsError ? (
              <div className="col-span-4 text-center py-8 text-red-600">{statsError}</div>
            ) : dashboardStats ? (
              <>
                <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-50">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-xl">Total Students</h3>
                      <p className="text-2xl font-semibold text-gray-800">{dashboardStats.totalStudents}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-50">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-xl">Total Faculty</h3>
                      <p className="text-2xl font-semibold text-gray-800 ">{dashboardStats.totalFaculty}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-50">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-xl">Departments</h3>
                      <p className="text-2xl font-semibold text-gray-800">{dashboardStats.departments}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-50">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-xl">Subjects</h3>
                      <p className="text-2xl font-semibold text-gray-800">{dashboardStats.subjects}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        );
      case 'pending-registrations':
        return <PendingRegistrations />;
      case 'semester':
        return <Semester />;
      case 'subject':
        return <Subject />;
      case 'student':
        return <Student />;
      case 'faculty':
        return <Faculty />;
      case 'department':
        return <DepartmentPage />;
      default:
        return null;
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg ${isSidebarOpen ? 'w-75' : 'w-20'} transition-all duration-300 ease-in-out`}>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isSidebarOpen && <h1 className="text-xl font-bold text-indigo-600">Admin Panel</h1>}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveMenu(item.id)}
              className={`flex text-xl items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${
                activeMenu === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            {activeMenu}
          </h2>
          <div className="ml-auto flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setProfileOpen(true)}>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
    {/* Profile Modal */}
    {isProfileOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Admin Profile</h3>
            <div className="flex items-center space-x-2">
              {!isEditMode && (
                <button 
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </button>
              )}
              <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setProfileOpen(false)}>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {authUser ? (
            <div className="space-y-3">
              {isEditMode ? (
                // Edit Mode Form
                <>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => handleEditInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => handleEditInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => handleEditInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Address</label>
                    <textarea
                      value={editFormData.address}
                      onChange={(e) => handleEditInputChange('address', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editFormData.dob}
                      onChange={(e) => handleEditInputChange('dob', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Department</label>
                    <input
                      type="text"
                      value={editFormData.department}
                      onChange={(e) => handleEditInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Designation</label>
                    <input
                      type="text"
                      value={editFormData.designation}
                      onChange={(e) => handleEditInputChange('designation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-900 font-medium">{authUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{authUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-900 font-medium capitalize">{authUser.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900 font-medium">{authUser.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900 font-medium">{authUser.address || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-gray-900 font-medium">
                      {authUser.dob ? (new Date(authUser.dob)).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  {authUser.department && (
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-gray-900 font-medium">{authUser.department}</p>
                    </div>
                  )}
                  {authUser.designation && (
                    <div>
                      <p className="text-sm text-gray-500">Designation</p>
                      <p className="text-gray-900 font-medium">{authUser.designation}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-600">No profile data found.</div>
          )}
          <div className="mt-6 flex justify-end space-x-2">
            {isEditMode ? (
              <>
                <button 
                  className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={handleSaveProfile}
                >
                  Save
                </button>
              </>
            ) : (
              <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => setProfileOpen(false)}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AdminDashboard;