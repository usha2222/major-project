import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments, addDepartment, editDepartment, deleteDepartment } from '../../store/slices/adminSlice';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const DepartmentPage = () => {
  const dispatch = useDispatch();
  const departments = useSelector(state => state.admin.departments);
  const loading = useSelector(state => state.admin.departmentsLoading);
  const error = useSelector(state => state.admin.departmentsError);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    hod: '',
    totalFaculty: '',
    totalStudents: '',
    established: '',
    contact: ''
  });

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleAddDepartment = () => {
    setFormData({
      id: '',
      name: '',
      hod: '',
      totalFaculty: '',
      totalStudents: '',
      established: '',
      contact: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEditDepartment = (dept) => {
    setSelectedDepartment(dept);
    setFormData(dept);
    setIsEditModalOpen(true);
  };

  const handleDeleteDepartment = async (deptId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      await dispatch(deleteDepartment(deptId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAddModalOpen) {
      await dispatch(addDepartment(formData));
      setIsAddModalOpen(false);
    } else {
      await dispatch(editDepartment({ id: selectedDepartment.id, departmentData: formData }));
      setIsEditModalOpen(false);
    }
    setFormData({
      id: '',
      name: '',
      hod: '',
      totalFaculty: '',
      totalStudents: '',
      established: '',
      contact: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Department Management</h2>
          <p className="text-gray-600 mt-2">Manage and organize university departments</p>
        </div>
        <button
          onClick={handleAddDepartment}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Department
        </button>
      </div>

      {/* Department Cards */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 m-9  px-14 gap-16">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{dept.name}</h3>
                  <p className="text-sm text-gray-500">ID: {dept.id}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditDepartment(dept)}
                    className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  HOD: {dept.hod}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Faculty: {dept.totalFaculty}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Students: {dept.totalStudents}
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Department Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? "Add New Department" : "Edit Department"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Department ID</label>
            <input
              placeholder='Enter Department ID'
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="mt-1 text-sm p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department Name</label>
            <input
              placeholder='Enter Department Name'
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 text-sm p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Head of Department</label>
            <input
              placeholder='Enter Head of Department'
              type="text"
              name="hod"
              value={formData.hod}
              onChange={handleChange}
              className="mt-1 text-sm p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Faculty</label>
            <input
              placeholder='Enter Total Faculty'
              type="number"
              name="totalFaculty"
              value={formData.totalFaculty}
              onChange={handleChange}
              className="mt-1 text-sm p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Students</label>
            <input
              placeholder='Enter Total Students'
              type="number"
              name="totalStudents"
              value={formData.totalStudents}
              onChange={handleChange}
              className="mt-1 text-sm p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              {isAddModalOpen ? 'Add Department' : 'Update Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentPage; 