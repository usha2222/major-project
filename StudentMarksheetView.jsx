import React, { useState } from 'react';
import { FaDownload, FaPrint, FaInfoCircle, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { searchStudentAndFetchMarksheet } from '../../store/slices/facultySlice';

const StudentMarksheetView = () => {
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useDispatch();
  const {
    studentMarksheetLoading: loading,
    studentMarksheetError: error,
    studentMarksheetStudent: student,
    studentMarksheetSubjects: subjects = [],
    studentMarksheetSearchPerformed: searchPerformed,
  } = useSelector(state => state.faculty);

  const facultyProfile = useSelector(state => state.faculty.profile);
  const assignedSubjectCodes = (facultyProfile?.profileSubjects?.length
    ? facultyProfile.profileSubjects
    : facultyProfile?.subjects) || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      // Local error for empty input
      // Could dispatch a set error action if desired
      return;
    }
    dispatch(searchStudentAndFetchMarksheet(searchInput));
  };

  const handleDownload = () => {
    console.log('Downloading marksheet...');
    alert('download successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar - only show if no student is found yet */}
        {!student && (
          <form onSubmit={handleSearch} className="flex items-center justify-center mb-8 space-x-2">
            <input
              type="text"
              placeholder="Enter Roll Number or Name"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <FaSearch className="mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        )}

        {/* Show loading spinner/message while searching */}
        {loading && (
          <div className="text-center text-indigo-600 mb-6">Searching...</div>
        )}

        {/* Show error if any */}
        {error && (
          <div className="text-center text-red-500 mb-6">{error}</div>
        )}

        {/* Show marksheet only if a student is found after search */}
        {searchPerformed && !student && !loading && !error && (
          <div className="text-center text-red-500 mb-6">No student found with the given Roll Number or Name.</div>
        )}
        {student && (
        <div className="bg-white rounded-lg shadow-sm p-3 mb-6 print:shadow-none w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">UNIVERSITY NAME</h1>
            <p className="text-gray-600">Department of {student.department}</p>
            <p className="text-gray-600">Semester: {student.semester}</p>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Student Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {student.name}</p>
                <p><span className="font-medium">Roll Number:</span> {student.rollNo || student.rollNumber}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Performance Summary</h2>
              <div className="space-y-2">
                {/* Add SGPA, CGPA, Attendance if needed */}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mb-6 print:hidden">
            <button
              onClick={handleDownload}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <FaDownload className="mr-2" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
            >
              <FaPrint className="mr-2" />
              Print
            </button>
          </div>

          {/* Subjects Table or No Marks Message */}
          {subjects.length === 0 ? (
            <div className="text-center text-yellow-500 mb-6">No marks have been entered for this student yet.</div>
          ) : (
          <div className="overflow-x-auto  w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Roll Number</th>
                  {/* <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Student Name</th> */}
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Subject Code</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase ">Subject Name</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase ">Mid-Sem 1</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase ">Mid-Sem 2</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase ">Best of Two</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase ">Assignment</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase ">External</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.map((subjectMark, index) => {
                  const isEditable = assignedSubjectCodes.includes(subjectMark.subjectCode || subjectMark.subject?.code);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{subjectMark.rollNo}</td>
                      {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{subjectMark.studentName}</td> */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{subjectMark.subjectCode || subjectMark.subject?.code}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{subjectMark.subjectName || subjectMark.subject?.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subjectMark.mid1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subjectMark.mid2}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{Math.max(Number(subjectMark.mid1) || 0, Number(subjectMark.mid2) || 0)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subjectMark.assignment}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subjectMark.attendance}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subjectMark.external}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subjectMark.grade === 'A+' ? 'bg-green-100 text-green-800' :
                          subjectMark.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subjectMark.grade}
                        </span>
                        {!isEditable && (
                          <span className="ml-2 text-gray-400">(Read-only)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}

          {/* Grading Information */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FaInfoCircle className="text-gray-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Grading Information</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">A+ (90-100) - Excellent</p>
                <p className="text-sm text-gray-600">A (80-89) - Very Good</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">B+ (70-79) - Good</p>
                <p className="text-sm text-gray-600">B (60-69) - Above Average</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">C (50-59) - Average</p>
                <p className="text-sm text-gray-600">D (40-49) - Below Average</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">F (Below 40) - Fail</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>This is a computer-generated document and does not require a signature.</p>
            <p className="mt-2">Generated on: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default StudentMarksheetView; 