import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaIdCard, FaEdit, FaSave, FaTimes, FaBook, FaChevronDown, FaChevronUp, FaGraduationCap, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFacultyProfile, updateFacultyProfile } from '../../store/slices/facultySlice';
import FacultyProfileService from '../../services/facultyProfileService.js';

// Utility to update localStorage user._id (case-insensitive email match)
async function autoFixUserIdByEmail(email) {
  try {
    const response = await fetch('http://localhost:5000/api/users?role=faculty');
    const users = await response.json();
    // Case-insensitive email match
    const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (user && user._id) {
      let localUser = JSON.parse(localStorage.getItem('user') || '{}');
      localUser._id = user._id;
      localStorage.setItem('user', JSON.stringify(localUser));
      window.location.reload();
    }
  } catch (err) {
    // ignore
  }
}

const FacultyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector(state => state.faculty.profile);
  const loading = useSelector(state => state.faculty.profileLoading);
  const error = useSelector(state => state.faculty.profileError);

  const [isEditing, setIsEditing] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [allSubjects, setAllSubjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    address: '',
    dob: '',
    designation: '',
    qualification: '',
    experience: '',
    joiningDate: '',
    subjects: []
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user._id && user.role === 'faculty') {
      dispatch(fetchFacultyProfile(user._id));
    }
    const fetchSubjects = async () => {
      try {
        const subjects = await FacultyProfileService.fetchAllSubjects();
        setAllSubjects(subjects);
      } catch (err) {
        // ignore error
      }
    };
    fetchSubjects();
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        department: profile.department || '',
        address: profile.address || '',
        dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '',
        designation: profile.designation || '',
        qualification: profile.qualification || '',
        experience: profile.experience || '',
        joiningDate: profile.joiningDate ? new Date(profile.joiningDate).toISOString().split('T')[0] : '',
        subjects: profile.subjects || [],
        profileSubjects: profile.profileSubjects || [],
        facultyId: profile.facultyId || null
      });
    }
  }, [profile]);

  // Automatically attempt to fix user ID if error is detected after profile fetch
  useEffect(() => {
    if (error && error.includes('User not found') && formData.email) {
      autoFixUserIdByEmail(formData.email);
    }
    // eslint-disable-next-line
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject !== subjectToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user._id) throw new Error('User not found. Please login again.');
      const facultyId = formData.facultyId || user._id;
      const dataToSave = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        phone: formData.phone,
        address: formData.address,
        designation: formData.designation,
        dob: formData.dob,
        semester: formData.semester,
        qualification: formData.qualification,
        experience: formData.experience,
        joiningDate: formData.joiningDate,
        profileSubjects: formData.subjects,
        subjects: formData.subjects
      };
      await dispatch(updateFacultyProfile({ facultyId, dataToSave }));
      setIsEditing(false);
      alert('Profile updated successfully!');
      // Try to auto-fix userId if error is present after update
      setTimeout(() => {
        if (error && error.includes('User not found')) {
          autoFixUserIdByEmail(formData.email);
        }
      }, 500);
    } catch (err) {
      alert(`Error saving profile: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getSubjectName = (code) => {
    const subj = allSubjects.find((s) => s.code === code);
    return subj ? subj.name : code;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <FaUser className="text-white text-4xl" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ''}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-gray-800 border rounded px-2 py-1"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{formData?.name || 'Faculty Member'}</h2>
              )}
              <p className="text-gray-600">Faculty</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setFormData({ ...formData });
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {isEditing ? (
                <>
                  <FaTimes className="mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" />
                  Edit Profile
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
              title="Logout"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData?.email || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                ) : (
                  <p className="font-medium">{profile?.email || 'Not available'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaPhone className="text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData?.phone || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                ) : (
                  <p className="font-medium">{profile?.phone || 'Not available'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaBuilding className="text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Department</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData?.department || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                ) : (
                  <p className="font-medium">{profile?.department || 'Not available'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaBuilding className="text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData?.address || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                ) : (
                  <p className="font-medium">{profile?.address || 'Not available'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Date of Birth</p>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={formData?.dob ? new Date(formData.dob).toISOString().substr(0, 10) : ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                ) : (
                  <p className="font-medium">{profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'Not available'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Designation</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="designation"
                    value={formData?.designation || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                ) : (
                  <p className="font-medium">{profile?.designation || 'Not available'}</p>
                )}
              </div>
            </div>

            {/* Additional Info Button */}
            <button
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center">
                <FaGraduationCap className="text-gray-400 mr-2" />
                Additional Information
              </span>
              {showAdditionalInfo ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Additional Info Section */}
            {showAdditionalInfo && (
              <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaGraduationCap className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Qualification</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="qualification"
                        value={formData?.qualification || ''}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                        placeholder="Enter your qualifications"
                      />
                    ) : (
                      <p className="font-medium">{profile?.qualification || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Experience</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        value={formData?.experience || ''}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                        placeholder="Enter your experience"
                      />
                    ) : (
                      <p className="font-medium">{profile?.experience || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Joining Date</p>
                    {isEditing ? (
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData?.joiningDate || ''}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      <p className="font-medium">
                        {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Subjects Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaBook className="mr-2" />
                Subjects
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Enter subject name"
                      className="flex-1 border rounded px-2 py-1"
                    />
                    <button
                      onClick={handleAddSubject}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData?.subjects?.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{subject}</span>
                        <button
                          onClick={() => handleRemoveSubject(subject)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {profile?.profileSubjects && profile.profileSubjects.length > 0 ? (
                    profile.profileSubjects.map((subject, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                        <FaBook className="text-gray-400" />
                        <span>{getSubjectName(subject)}</span>
                      </div>
                    ))
                  ) : profile?.subjects && profile.subjects.length > 0 ? (
                    profile.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                        <FaBook className="text-gray-400" />
                        <span>{getSubjectName(subject)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No subjects assigned</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyProfile;