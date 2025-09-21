import React, { useState } from 'react';
import { FaUser, FaBook, FaChartBar, FaFileAlt, FaSearch, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FacultyProfile from './FacultyProfile';
import Marksfeed from './Marksfeed';
import StudentMarksheetView from './StudentMarksheetView';
import { useSelector } from 'react-redux';

const FacultyDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('profile');
  const navigate = useNavigate();

  // Get faculty profile from Redux
  const facultyProfile = useSelector(state => state.faculty.profile);
  const facultyName = facultyProfile?.name || JSON.parse(localStorage.getItem('user') || '{}').name || 'Faculty Member';

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'marks', label: 'Marks Feed', icon: FaFileAlt },
    { id: 'reports', label: 'Generate Report', icon: FaChartBar },
    // {id:'view' ,label:'View studentList',icon:FaChartBar}
  ];  

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return (
          <FacultyProfile/>
        );

      case 'marks':
        return (
          
              <div>
                <Marksfeed/>
          </div>
        );

      case 'reports':
        return (
         <div>
          <StudentMarksheetView/>
         </div>
        );
       
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Faculty Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                <FaBell className="text-xl" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{facultyName}</span>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-300 ml-2"
                title="Logout"
              >
                <FaSignOutAlt className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white rounded-xl shadow-lg p-4">
            <nav className="space-y-5 ">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (  
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full  flex items-center px-4 py-3 text-xl font-medium rounded-lg transition-all duration-200 ${
                      activeMenu === item.id
                        ? 'bg-indigo-50 text-indigo-600 '
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
