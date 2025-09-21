import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaUserGraduate, FaBook, FaUniversity, FaTimes, FaUser, FaPlus } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudents, addStudent, deleteStudent } from '../../store/slices/adminSlice';
import { toast } from 'react-toastify';

const Student = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    department: '',
    semester: '',
    email: '',
    phone: '',
    status: 'Active',
    address: '',
    dob: '',
  });
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedYearData, setSelectedYearData] = useState(null);
  const [expandedDept, setExpandedDept] = useState({});
  const [openDept, setOpenDept] = useState('');
  const [openSemester, setOpenSemester] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showYearModal, setShowYearModal] = useState(false);

  const dispatch = useDispatch();
  const students = useSelector(state => state.admin.students);
  const loading = useSelector(state => state.admin.studentsLoading);
  const error = useSelector(state => state.admin.studentsError);

  // Helper function to normalize department names for matching
  const normalizeDepartmentForMatching = (dept) => {
    if (!dept) return '';
    const deptLower = dept.trim().toLowerCase();
    
    // Map common variations to standard department names
    const departmentMap = {
      'cse': 'computer science',
      'cs': 'computer science',
      'computer science': 'computer science',
      'computer': 'computer science',
      'ds': 'data science',
      'data science': 'data science',
      'data': 'data science',
      'ce': 'civil engineering',
      'civil': 'civil engineering',
      'civil engineering': 'civil engineering',
      'me': 'mechanical engineering',
      'mechanical': 'mechanical engineering',
      'mechanical engineering': 'mechanical engineering',
      'ee': 'electrical engineering',
      'electrical': 'electrical engineering',
      'electrical engineering': 'electrical engineering',
      'electronics': 'electrical engineering',
      'mkt': 'marketing',
      'marketing': 'marketing',
      'fin': 'finance',
      'finance': 'finance',
      'hr': 'human resources',
      'human resources': 'human resources',
      'human resource': 'human resources',
      'ops': 'operations',
      'operations': 'operations',
      'sd': 'software development',
      'software development': 'software development',
      'software': 'software development',
      'wd': 'web development',
      'web development': 'web development',
      'web': 'web development',
      'db': 'database management',
      'database management': 'database management',
      'database': 'database management',
      'cc': 'cloud computing',
      'cloud computing': 'cloud computing',
      'cloud': 'cloud computing'
    };
    
    return departmentMap[deptLower] || deptLower;
  };

  useEffect(() => {
    dispatch(fetchStudents());
    const refreshHandler = () => {
      dispatch(fetchStudents());
    };
    window.addEventListener('studentListShouldRefresh', refreshHandler);
    return () => {
      window.removeEventListener('studentListShouldRefresh', refreshHandler);
    };
  }, [dispatch]);

  const courses = [
    {
      name: 'B.Tech',
      description: 'Bachelor of Technology',
      icon: <FaUserGraduate className="h-8 w-8" />, 
      departments: [
        { name: 'Computer Science', code: 'CS' },
        { name: 'Data Science', code: 'DS' },
        { name: 'Civil Engineering', code: 'CE' },
        { name: 'Mechanical Engineering', code: 'ME' },
        { name: 'Electrical Engineering', code: 'EE' }
      ]
    },
    {
      name: 'MBA',
      description: 'Master of Business Administration',
      icon: <FaBook className="h-8 w-8" />, 
      departments: [
        { name: 'Marketing', code: 'MKT' },
        { name: 'Finance', code: 'FIN' },
        { name: 'Human Resources', code: 'HR' },
        { name: 'Operations', code: 'OPS' }
      ]
    },
    {
      name: 'MCA',
      description: 'Master of Computer Applications',
      icon: <FaUniversity className="h-8 w-8" />, 
      departments: [
        { name: 'Software Development', code: 'SD' },
        { name: 'Web Development', code: 'WD' },
        { name: 'Database Management', code: 'DB' },
        { name: 'Cloud Computing', code: 'CC' }
      ]
    }
  ];

  const toggleDepartment = (courseName, deptCode) => {
    setExpandedDept(prev => ({
      ...prev,
      [`${courseName}-${deptCode}`]: !prev[`${courseName}-${deptCode}`]
    }));
  };

  const getCourseYears = (courseName) => {
    switch (courseName) {
      case 'B.Tech':
        return [1, 2, 3, 4, 5, 6, 7, 8];
      case 'MBA':
      case 'MCA':
        return [1, 2, 3, 4];
      default:
        return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addStudent({ ...formData, semester: Number(formData.semester) }));
      setIsModalOpen(false);
      setFormData({
        rollNo: '',
        name: '',
        department: '',
        semester: '',
        email: '',
        phone: '',
        status: 'Active',
        address: '',
        dob: '',
      });
      toast.success('Student added successfully!');
    } catch (error) {
      toast.error('Failed to add student');
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await dispatch(deleteStudent(studentId));
        toast.success('Student deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Graduated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSemesterClick = (courseName, deptName, semester) => {
    const studentsInSemester = students.filter(
      (s) => {
        const studentDept = normalizeDepartmentForMatching(s.department);
        const cardDept = normalizeDepartmentForMatching(deptName);
        return studentDept === cardDept && Number(s.semester) === semester;
      }
    );
    setSelectedYearData({
      courseName,
      deptName,
      semester,
      students: studentsInSemester
    });
    setShowYearModal(true);
  };

  const renderYearContent = (courseName, deptName, semester) => {
    const studentsInSemester = students.filter(
      (s) => {
        const studentDept = normalizeDepartmentForMatching(s.department);
        const cardDept = normalizeDepartmentForMatching(deptName);
        return studentDept === cardDept && Number(s.semester) === semester;
      }
    );
    return (
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"
        onClick={() => handleSemesterClick(courseName, deptName, semester)}
      >
        <span className="font-medium text-gray-900">Semester {semester}</span>
        {studentsInSemester.length > 0 && (
          <span className="text-lg font-semibold text-gray-800">
            {studentsInSemester.length} Students
          </span>
        )}
      </div>
    );
  };

  const grouped = students.reduce((acc, student) => {
    const dept = student.department || 'Other';
    const sem = student.semester || 'Other';
    if (!acc[dept]) acc[dept] = {};
    if (!acc[dept][sem]) acc[dept][sem] = [];
    acc[dept][sem].push(student);
    return acc;
  }, {});

  const toggleDept = (dept) => {
    setOpenDept(openDept === dept ? '' : dept);
  };

  const toggleSemester = (dept, sem) => {
    setOpenSemester((prev) => ({
      ...prev,
      [dept]: prev[dept] === sem ? '' : sem
    }));
  };

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setSelectedStudent(null);
    setShowStudentModal(false);
  };

  const closeYearModal = () => {
    setSelectedYearData(null);
    setShowYearModal(false);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Student Management</h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage and create student records for the marks feeding system
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-8 items-start">
          {courses.map((course) => (
            <div key={course.name} className="bg-white rounded-xl shadow-lg overflow-hidden h-fit">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
                <div className="flex items-center space-x-6">
                  <div className="text-white">
                    {course.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{course.name}</h3>
                    <p className="text-blue-100">{course.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {course.departments.map((dept) => (
                    <div key={dept.code} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleDepartment(course.name, dept.code)}
                        className="w-full flex justify-between items-center p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-700">{dept.name}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {dept.code}
                          </span>
                        </div>
                        {expandedDept[`${course.name}-${dept.code}`] ? (
                          <FaChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <FaChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedDept[`${course.name}-${dept.code}`] && (
                        <div className="p-1 bg-white border-t">
                          <div className="grid grid-cols-1 gap-1">
                            {getCourseYears(course.name).map((semester) => (
                              <div
                                key={semester}
                                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                              >
                                {renderYearContent(course.name, dept.name, semester)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Add Student Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Student
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    className="h-8 p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter roll number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-8 p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="h-8 p-1 text-sm font-normal mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {courses.flatMap(course => course.departments).map(dept => (
                      <option key={dept.name} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="h-8 p-1 text-sm font-normal mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-8 p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter email"
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
                    className="h-8 p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="h-8 p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-8 p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter address"
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
                    className="h-8 p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Student List Modal */}
        
        {showYearModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedYearData?.courseName} - {selectedYearData?.deptName}
                  </h3>
                  <p className="text-sm text-gray-500">Semester {selectedYearData?.semester}</p>
                </div>
                <button
                  onClick={closeYearModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                {selectedYearData?.students.map((student) => (
                  <div
                    key={student._id || student.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FaUser className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                          <p className="text-sm text-gray-500">Semester: {student.semester}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                        <button
                          onClick={() => openStudentModal(student)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(student._id || student.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {selectedYearData?.students.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No students found in this semester
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              onClick={closeStudentModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Student Details</h2>
            <div className="space-y-2">
              <div><span className="font-semibold">Name:</span> {selectedStudent.name}</div>
              <div><span className="font-semibold">Roll No:</span> {selectedStudent.rollNo}</div>
              <div><span className="font-semibold">Department:</span> {selectedStudent.department}</div>
              <div><span className="font-semibold">Semester:</span> {selectedStudent.semester}</div>
              <div><span className="font-semibold">Email:</span> {selectedStudent.email}</div>
              <div><span className="font-semibold">Phone:</span> {selectedStudent.phone}</div>
              <div><span className="font-semibold">Address:</span> {selectedStudent.address}</div>
              <div><span className="font-semibold">Date of Birth:</span> {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : 'N/A'}</div>
              <div><span className="font-semibold">Status:</span> {selectedStudent.status}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
