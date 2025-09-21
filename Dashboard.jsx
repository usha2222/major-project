import React, { useEffect } from 'react';
import { FaDownload, FaPrint } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudentDashboard } from '../../store/slices/studentSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const studentInfo = useSelector(state => state.student.dashboard);
  const subjects = useSelector(state => state.student.marks) || [];
  const loading = useSelector(state => state.student.dashboardLoading);
  const error = useSelector(state => state.student.dashboardError);

  useEffect(() => {
    dispatch(fetchStudentDashboard());
  }, [dispatch]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Download successful!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Print and Download Buttons at the very top */}
        <div className="flex justify-end space-x-2 mb-4 print:hidden">
          <button
            onClick={handleDownload}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <FaDownload className="mr-2" />
            Save
          </button>
          <button
            onClick={handlePrint}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
          >
            <FaPrint className="mr-2" />
            Print
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Student Dashboard</h2>
          {studentInfo && (
            <p className="mt-2 text-sm text-gray-600">
              Welcome back, {studentInfo.name}
            </p>
          )}
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg">{error}</div>
        ) : !studentInfo ? (
          <div className="text-center text-gray-500 text-lg">No student information available.</div>
        ) : (
          <>
            {/* Student Info - simple block */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                <div><span className="font-medium">Name:</span> {studentInfo.name || '-'}</div>
                <div><span className="font-medium">Roll No:</span> {studentInfo.rollNo || '-'}</div>
                <div><span className="font-medium">Department:</span> {studentInfo.department || '-'}</div>
                <div><span className="font-medium">Semester:</span> {studentInfo.semester || '-'}</div>
                <div><span className="font-medium">Email:</span> {studentInfo.email || '-'}</div>
                <div><span className="font-medium">Phone:</span> {studentInfo.phone || '-'}</div>
              </div>
            </div>

            {/* Marksheet Table (StudentMarksheetView style) */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Marksheet</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject Code</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject Name</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Mid-Sem 1</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Mid-Sem 2</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Best of Two</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Assignment</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">External</th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(subjects || []).map((subject, idx) => (
                      <tr key={subject.id || idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{studentInfo.rollNo || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{subject.code || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{subject.name || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subject.mid1 ?? '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subject.mid2 ?? '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subject.bestOfTwo ?? '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subject.assignment ?? '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subject.attendance ?? '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{subject.external ?? '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            subject.grade === 'A+' ? 'bg-green-100 text-green-800' :
                            subject.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subject.grade || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grading Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                {/* Use the same icon as StudentMarksheetView */}
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20.5C6.753 20.5 2 15.747 2 10.5S6.753.5 12 .5s10 4.753 10 10-4.753 10-10 10z" /></svg>
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
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard; 