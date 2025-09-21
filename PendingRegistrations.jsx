import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPendingRegistrations, approvePendingRegistration, rejectPendingRegistration } from '../../store/slices/adminSlice';

const PendingRegistrations = () => {
  const dispatch = useDispatch();
  const pendingRegistrations = useSelector(state => state.admin.pendingRegistrations);
  const isLoading = useSelector(state => state.admin.pendingRegistrationsLoading);
  const error = useSelector(state => state.admin.pendingRegistrationsError);

  useEffect(() => {
    dispatch(fetchPendingRegistrations());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(approvePendingRegistration(id));
      toast.success('Registration approved');
      // Find the approved registration to determine role
      const approved = pendingRegistrations.find(r => r._id === id);
      if (approved?.role === 'student') {
        window.dispatchEvent(new Event('studentListShouldRefresh'));
      } else if (approved?.role === 'faculty') {
        window.dispatchEvent(new Event('facultyListShouldRefresh'));
      }
    } catch (err) {
      toast.error('Failed to approve registration');
    }
  };

  const handleReject = async (id) => {
    try {
      await patch(rejectPendingRegistration(id));
      toast.success('Registration rejected');
    } catch (err) {
      toast.error('Failed to reject registration');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Registrations</h1>
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : pendingRegistrations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No pending registrations</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingRegistrations.map((registration) => (
            <div key={registration._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{registration.name}</h2>
                  <p className="text-gray-600">{registration.email}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                      registration.role === 'student' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {registration.role}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(registration._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(registration._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-800">{registration.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="text-gray-800">{registration.department}</p>
                </div>
                {registration.role === 'student' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Roll Number</p>
                      <p className="text-gray-800">{registration.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Semester</p>
                      <p className="text-gray-800">{registration.semester}</p>
                    </div>
                  </>
                )}
                {registration.role === 'faculty' && (
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="text-gray-800">{registration.designation}</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-gray-800">{registration.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRegistrations; 