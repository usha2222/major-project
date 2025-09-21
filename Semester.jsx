import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSemesters, addSemester, editSemester, deleteSemester } from '../../store/slices/adminSlice';

const Semester = () => {
  const dispatch = useDispatch();
  const semesters = useSelector(state => state.admin.semesters);
  const loading = useSelector(state => state.admin.semestersLoading);
  const error = useSelector(state => state.admin.semestersError);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSemesterId, setEditingSemesterId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    academicYear: '',
    startDate: '',
    endDate: '',
    status: 'Upcoming',
    totalSubjects: '',
    totalStudents: '',
    description: ''
  });

  useEffect(() => {
    dispatch(fetchSemesters());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await dispatch(editSemester({ id: editingSemesterId, semesterData: formData }));
      setIsEditing(false);
      setEditingSemesterId(null);
    } else {
      await dispatch(addSemester(formData));
    }
    setIsModalOpen(false);
    setFormData({
      name: '',
      academicYear: '',
      startDate: '',
      endDate: '',
      status: 'Upcoming',
      totalSubjects: '',
      totalStudents: '',
      description: ''
    });
  };

  const handleEdit = (semester) => {
    setIsEditing(true);
    setEditingSemesterId(semester._id);
    setFormData({
      name: semester.name,
      academicYear: semester.academicYear,
      startDate: semester.startDate ? semester.startDate.substring(0, 10) : '',
      endDate: semester.endDate ? semester.endDate.substring(0, 10) : '',
      status: semester.status,
      totalSubjects: semester.totalSubjects,
      totalStudents: semester.totalStudents,
      description: semester.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (semesterId) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      await dispatch(deleteSemester(semesterId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Semester Management</h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage and create academic semesters for the marks feeding system
            </p>
          </div>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditingSemesterId(null);
              setFormData({
                name: '',
                academicYear: '',
                startDate: '',
                endDate: '',
                status: 'Upcoming',
                totalSubjects: '',
                totalStudents: '',
                description: ''
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Semester
          </button>
        </div>

        {/* Semesters Grid */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {semesters.map((semester) => (
              <div key={semester._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{semester.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(semester.status)}`}>
                    {semester.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Academic Year:</span>
                    <span className="text-gray-900">{semester.academicYear}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Start Date:</span>
                    <span className="text-gray-900">{semester.startDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">End Date:</span>
                    <span className="text-gray-900">{semester.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Subjects:</span>
                    <span className="text-gray-900">{semester.totalSubjects}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Students:</span>
                    <span className="text-gray-900">{semester.totalStudents}</span>
                  </div>
                  {semester.description && (
                    <div className="mt-2 text-sm text-gray-600">
                      {semester.description}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button 
                    onClick={() => handleEdit(semester)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(semester._id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Semester Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isEditing ? 'Edit Semester' : 'Create New Semester'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 p-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter Semester Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    className="mt-1 p-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter Academic Year"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="mt-1 p-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="mt-1 p-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 p-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Subjects</label>
                  <input
                    type="number"
                    name="totalSubjects"
                    value={formData.totalSubjects}
                    onChange={handleInputChange}
                    className="mt-1 p-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter Total Subjects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Students</label>
                  <input
                    type="number"
                    name="totalStudents"
                    value={formData.totalStudents}
                    onChange={handleInputChange}
                    className="mt-1 p-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter Total Students"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 p-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter Description"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditing(false);
                      setEditingSemesterId(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {isEditing ? 'Update Semester' : 'Create Semester'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Semester;
