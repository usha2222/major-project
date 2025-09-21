import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    dob: '',
    branch: '',
    semester: '',
    rollNo: '',
    designation: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear API error when user makes changes
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    if (formData.role === 'student') {
      if (!formData.rollNo.trim()) {
        newErrors.rollNo = 'Roll No is required for students';
      }
      if (!formData.branch.trim()) {
        newErrors.branch = 'Branch is required for students';
      }
      if (!formData.semester.trim()) {
        newErrors.semester = 'Semester is required for students';
      } else if (!/^[1-8]$/.test(formData.semester)) {
        newErrors.semester = 'Semester must be a number between 1 and 8';
      }
    }
    
    if (formData.role === 'faculty') {
      if (!formData.designation.trim()) {
        newErrors.designation = 'Designation is required for faculty';
      }
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 5 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setApiError('');
      try {
        await axios.post('http://localhost:5000/api/pending-registrations', {
          role: formData.role,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          dateOfBirth: formData.dob,
          department: formData.branch,
          semester: formData.semester,
          rollNo: formData.role === 'student' ? formData.rollNo : undefined,
          designation: formData.role === 'faculty' ? formData.designation : undefined,
          phoneNumber: formData.phone
        });
        alert('Registration submitted! Please wait for admin approval.');
        navigate('/login');
      } catch (error) {
        console.error('Registration error:', error);
        if (error.response) {
          if (error.response.data.field) {
            setErrors(prev => ({
              ...prev,
              [error.response.data.field]: error.response.data.message
            }));
          } else {
            setApiError(error.response.data.message || error.response.data.error);
          }
        } else {
          setApiError('An error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="text-center mb-0.5">
          <h2 className="text-2xl font-bold text-gray-800">Registration</h2>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Role</label>
            <div className="flex space-x-4">
              {['faculty', 'student'].map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-700 capitalize">
                    {role}
                  </label>
                </div>
              ))}
            </div>
            {errors.role && <p className="text-xs text-red-600">{errors.role}</p>}
          </div>

          {/* Branch Field (always visible) */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className={`block w-full px-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.branch ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your branch (e.g., CSE, ECE)"
            />
            {errors.branch && <p className="text-xs text-red-600">{errors.branch}</p>}
          </div>

          {/* Semester Field (always visible) */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              min="1"
              max="8"
              className={`block w-full px-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.semester ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your semester (1-8)"
            />
            {errors.semester && <p className="text-xs text-red-600">{errors.semester}</p>}
          </div>

          {/* Roll No Field (only for students) */}
          {formData.role === 'student' && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                className={`block w-full px-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.rollNo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your roll number"
              />
              {errors.rollNo && <p className="text-xs text-red-600">{errors.rollNo}</p>}
            </div>
          )}

          {/* Designation Field (only for faculty) */}
          {formData.role === 'faculty' && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={`block w-full px-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.designation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your designation (e.g., Assistant Professor)"
              />
              {errors.designation && <p className="text-xs text-red-600">{errors.designation}</p>}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaUser className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full pl-8 pr-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaEnvelope className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-8 pr-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaPhone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`block w-full pl-8 pr-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaLock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-8 pr-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaLock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-8 pr-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Address Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <div className="relative">
              <div className="absolute top-2 left-2">
                <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`block w-full pl-8 pr-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your address"
                rows="2"
              />
            </div>
            {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
          </div>

          {/* Date of Birth Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <FaCalendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`block w-full pl-8 pr-2 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.dob && <p className="text-xs text-red-600">{errors.dob}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200 font-semibold mt-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register; 