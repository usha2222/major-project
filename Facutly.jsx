import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFaculty, addFaculty, editFaculty, deleteFaculty } from '../../store/slices/adminSlice';

const Faculty = () => {
  const dispatch = useDispatch();
  const faculty = useSelector(state => state.admin.faculties);
  const loading = useSelector(state => state.admin.facultiesLoading);
  const error = useSelector(state => state.admin.facultiesError);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    semester: '',
    phone: '',
    status: 'Active',
    address: '',
    designation: '',
    dob: '',
  });

  useEffect(() => {
    dispatch(fetchFaculty());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (value === '' || /^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'email', 'department', 'semester', 'address', 'designation', 'dob'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    const validDepartments = ['CSE', 'ME' ,'EE', 'DSE', 'CE'];
    if (!validDepartments.includes(formData.department)) {
      toast.error('Please select a valid department');
      return;
    }
    const validSemesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);
    if (!validSemesters.includes(formData.semester)) {
      toast.error('Please select a valid semester');
      return;
    }
    const facultyData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      department: formData.department,
      semester: formData.semester,
      phone: formData.phone ? formData.phone.trim() : '',
      status: formData.status,
      address: formData.address,
      designation: formData.designation,
      dob: formData.dob,
    };
    try {
      if (isEditMode && selectedFaculty) {
        await dispatch(editFaculty({ id: selectedFaculty._id, facultyData }));
        toast.success('Faculty updated successfully');
      } else {
        await dispatch(addFaculty(facultyData));
        toast.success('Faculty added successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Error saving faculty');
    }
    handleCloseModal();
  };

  const handleEdit = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setFormData({
      name: facultyMember.name || '',
      email: facultyMember.email || '',
      department: facultyMember.department || '',
      semester: facultyMember.semester || '',
      phone: facultyMember.phone || '',
      status: facultyMember.status || 'Active',
      address: facultyMember.address || '',
      designation: facultyMember.designation || '',
      dob: facultyMember.dob ? facultyMember.dob.substring(0, 10) : '',
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteFaculty(selectedFaculty._id));
      toast.success('Faculty deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Error deleting faculty');
    }
    setIsDeleteModalOpen(false);
    setSelectedFaculty(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedFaculty(null);
    setFormData({
      name: '',
      email: '',
      department: '',
      semester: '',
      phone: '',
      status: 'Active',
      address: '',
      designation: '',
      dob: '',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Faculty Management</h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage and create faculty records for the marks feeding system
            </p>
          </div>
        </div>
        {/* Faculty Table */}
        <div className="bg-white rounded-xl shadow-sm max-w-6xl ">
          <div className=" max-w-full overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Semester
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Designation
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      DOB
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Address
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {faculty.map((facultyMember) => (
                    <tr key={facultyMember._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                        {facultyMember.name}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                        {facultyMember.department}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                        {facultyMember.semester}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                        {facultyMember.designation}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                        {facultyMember.dob}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                        {facultyMember.address}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600">
                        <div className="flex flex-col">
                          <span className="text-gray-900">{facultyMember.email}</span>
                          <span className="text-gray-500 text-xs">{facultyMember.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(facultyMember.status || 'Active')}`}>
                          {facultyMember.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(facultyMember)}
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(facultyMember)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* Add/Edit Faculty Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isEditMode ? 'Edit Faculty' : 'Add New Faculty'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter faculty's full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="h-8 text-sm font-normal mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE(Computer science Engineering)</option>
                    <option value="ME">ME(Mechanical Engineering)</option>
                    <option value="CE">CE(Civil Engineering)</option>
                    <option value="EE">EE(Electrical Engineering)</option>
                    <option value="DSE">DSE(Data Science Engineering)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="h-8 text-sm font-normal mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={`Semester ${sem}`}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="h-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter designation (e.g., Assistant Professor)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="h-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter 10-digit phone number"
                    pattern="[0-9]{10}"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="h-8 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {isEditMode ? 'Update Faculty' : 'Add Faculty'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete {selectedFaculty?.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedFaculty(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Faculty;