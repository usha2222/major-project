const API_BASE_URL = 'http://localhost:5000/api';

class FacultyProfileService {
  // Get faculty profile by user ID (for logged-in faculty)
  static async getFacultyProfileByUserId(userId) {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching faculty profile for userId:', userId);
      let response = await fetch(`${API_BASE_URL}/faculty-profile/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('Server did not return JSON. Response was: ' + text.substring(0, 200));
      }

      if (!response.ok) {
        const errorData = await response.json();
        // If 404 and user not found, try to recover by email
        if (response.status === 404 && errorData.error && errorData.error.includes('User not found')) {
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (localUser.email) {
            // Try to find user by email from /api/users?role=faculty
            const usersRes = await fetch(`${API_BASE_URL}/users?role=faculty`);
            const users = await usersRes.json();
            const user = users.find(u => u.email && u.email.toLowerCase() === localUser.email.toLowerCase());
            if (user && user._id) {
              localUser._id = user._id;
              localStorage.setItem('user', JSON.stringify(localUser));
              // Retry fetch with new userId
              response = await fetch(`${API_BASE_URL}/faculty-profile/user/${user._id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });
              if (response.ok) {
                return await response.json();
              }
            }
          }
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching faculty profile:', error);
      throw error;
    }
  }

  // Get faculty profile by faculty ID
  static async getFacultyProfile(facultyId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/faculty-profile/${facultyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching faculty profile:', error);
      throw error;
    }
  }

  // Update faculty profile
  static async updateFacultyProfile(facultyId, profileData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/faculty-profile/${facultyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating faculty profile:', error);
      throw error;
    }
  }

  // Get all faculty profiles (for admin purposes)
  static async getAllFacultyProfiles() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/faculty-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all faculty profiles:', error);
      throw error;
    }
  }

  // Fetch all subjects (for mapping subject codes to names)
  static async fetchAllSubjects() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all subjects:', error);
      throw error;
    }
  }
}

export default FacultyProfileService; 