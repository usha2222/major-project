    import React, { useState, useEffect } from 'react';
    import { FaSearch, FaUserGraduate, FaSave, FaTimes, FaExclamationTriangle, FaBook } from 'react-icons/fa';
    import { toast, ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import { useSelector, useDispatch } from 'react-redux';
    import { fetchMarksfeedStudents, fetchMarksfeedSubjects, saveMarks, resetSaveMarksStatus } from '../../store/slices/facultySlice';

    export default function Marksfeed() {
        const dispatch = useDispatch();
        const marksFeedStudents = useSelector(state => state.faculty.marksFeedStudents) || [];
        const marksFeedSubjects = useSelector(state => state.faculty.marksFeedSubjects) || [];
        const marksFeedStudentsLoading = useSelector(state => state.faculty.marksFeedStudentsLoading);
        const marksFeedSubjectsLoading = useSelector(state => state.faculty.marksFeedSubjectsLoading);
        const loading = marksFeedStudentsLoading || marksFeedSubjectsLoading;
        const marksFeedStudentsError = useSelector(state => state.faculty.marksFeedStudentsError);
        const marksFeedSubjectsError = useSelector(state => state.faculty.marksFeedSubjectsError);
        const fetchError = marksFeedStudentsError || marksFeedSubjectsError;
        const saveMarksLoading = useSelector(state => state.faculty.saveMarksLoading);
        const saveMarksError = useSelector(state => state.faculty.saveMarksError);
        const saveMarksSuccess = useSelector(state => state.faculty.saveMarksSuccess);
        const facultyProfile = useSelector(state => state.faculty.profile);

        // Get assigned subject codes from faculty profile
        const assignedSubjectCodes = (facultyProfile?.profileSubjects?.length
        ? facultyProfile.profileSubjects
        : facultyProfile?.subjects) || [];

        // Only show subjects assigned to this faculty
        const assignedSubjects = marksFeedSubjects.filter(subject => assignedSubjectCodes.includes(subject.code));

        const [searchQuery, setSearchQuery] = useState('');
        const [selectedStudent, setSelectedStudent] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedSubject, setSelectedSubject] = useState('');
        const [formData, setFormData] = useState({
            name: '',
            rollNo: '',
            department: '',
            semester: '',
            subjects: {}
        });
        const [errors, setErrors] = useState({});
        const [successMessage, setSuccessMessage] = useState('');

        useEffect(() => {
            dispatch(fetchMarksfeedStudents());
            dispatch(fetchMarksfeedSubjects());
        }, [dispatch]);

        useEffect(() => {
            if (saveMarksSuccess) {
                toast.success('✅ Marks successfully added!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatch(resetSaveMarksStatus());
            }
            if (saveMarksError) {
                toast.error(`❌ Failed to save marks: ${saveMarksError}`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatch(resetSaveMarksStatus());
            }
        }, [saveMarksSuccess, saveMarksError, dispatch]);

        // Form handling
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            if (name.startsWith('subject_')) {
                const subjectCode = name.split('_')[1];
                const field = name.split('_')[2];
                setFormData(prev => ({
                    ...prev,
                    subjects: {
                        ...prev.subjects,
                        [subjectCode]: {
                            ...prev.subjects[subjectCode],
                            [field]: value
                        }
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
            if (errors[name]) {
                setErrors(prev => ({
                    ...prev,
                    [name]: ''
                }));
            }
        };

        const validateForm = (subjectCode) => {
            const newErrors = {};
            const maxMarks = {
                internal1: 20,
                internal2: 20,
                assignment: 10,
                attendance: 10,
                external: 50
            };

            // Marks validation
            Object.keys(maxMarks).forEach(key => {
                const value = formData.subjects[subjectCode]?.[key];
                if (!value) {
                    newErrors[`subject_${subjectCode}_${key}`] = 'Marks are required';
                } else if (isNaN(value) || value < 0 || value > maxMarks[key]) {
                    newErrors[`subject_${subjectCode}_${key}`] = `Marks must be between 0 and ${maxMarks[key]}`;
                }
            });

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSearch = async (e) => {
            e.preventDefault();
            const departmentName = (facultyProfile?.department || '').toLowerCase();
            const eligibleStudents = departmentName
                ? marksFeedStudents.filter(s => (s.department || '').toLowerCase() === departmentName)
                : marksFeedStudents;
            const student = eligibleStudents.find(s => 
                (s.rollNo || '').toLowerCase() === searchQuery.toLowerCase() || 
                (s.name || '').toLowerCase() === searchQuery.toLowerCase()
            );
            if (student) {
                if (departmentName && (student.department || '').toLowerCase() !== departmentName) {
                    setErrors({ search: 'You are not authorized to feed marks for this student (different department).' });
                    return;
                }
                // Fetch existing marks for this student
                let marksheets = [];
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:5000/api/marksheets/student/${student.rollNo}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                    });
                    if (res.ok) {
                        marksheets = await res.json();
                    }
                } catch (err) {
                    // Ignore fetch error, just show empty fields
                }
                // Debug logs
                console.log('Fetched marksheets:', marksheets);
                console.log('marksFeedSubjects:', marksFeedSubjects);
                // Pre-fill formData.subjects with existing marks if available
                const subjectsData = {};
                assignedSubjects.forEach(subject => {
                    // Case-insensitive match for subject code
                    const ms = marksheets.find(m => {
                    const code1 = m.subject?.code || m.subjectCode || '';
                    return code1.toLowerCase() === subject.code.toLowerCase();
                    });
                    if (ms) {
                    subjectsData[subject.code] = {
                        internal1: ms.mid1 !== undefined && ms.mid1 !== null ? String(ms.mid1) : '',
                        internal2: ms.mid2 !== undefined && ms.mid2 !== null ? String(ms.mid2) : '',
                        assignment: ms.assignment !== undefined && ms.assignment !== null ? String(ms.assignment) : '',
                        attendance: ms.attendance !== undefined && ms.attendance !== null ? String(ms.attendance) : '',
                        external: ms.external !== undefined && ms.external !== null ? String(ms.external) : '',
                    };
                    }
                });
                console.log('subjectsData:', subjectsData);
                setSelectedStudent(student);
                setFormData({
                    name: student.name,
                    rollNo: student.rollNo,
                    department: student.department,
                    semester: student.semester,
                    subjects: subjectsData
                });
                setIsModalOpen(true);
            } else {
                setErrors({ search: 'Student not found. Please check the name or roll number.' });
            }
        };

        const handleSaveMarks = async (subjectCode) => {
            if (!validateForm(subjectCode)) return;
            // Ensure faculty and student department match
            if (facultyProfile?.department && selectedStudent?.department &&
                String(facultyProfile.department).toLowerCase() !== String(selectedStudent.department).toLowerCase()) {
                const msg = 'You are not authorized to feed marks for this student (different department).';
                setErrors(prev => ({ ...prev, save: msg }));
                toast.error(`❌ ${msg}`);
                return;
            }
            // Ensure subject is assigned to this faculty
            if (!assignedSubjectCodes.includes(subjectCode)) {
                const msg = 'You are not assigned to this subject.';
                setErrors(prev => ({ ...prev, save: msg }));
                toast.error(`❌ ${msg}`);
                return;
            }
            // Ensure subject belongs to the student's department
            const subjectMeta = marksFeedSubjects.find(s => s.code === subjectCode);
            if (subjectMeta && selectedStudent?.department &&
                String(subjectMeta.department || '').toLowerCase() !== String(selectedStudent.department || '').toLowerCase()) {
                const msg = 'This subject belongs to another department. You cannot feed marks for this student.';
                setErrors(prev => ({ ...prev, save: msg }));
                toast.error(`❌ ${msg}`);
                return;
            }
            const marks = formData.subjects[subjectCode];
            const grade = calculateGrade(marks.internal1, marks.internal2, marks.assignment);
            const payload = {
                rollNo: formData.rollNo,
                subjectCode,
                mid1: Number(marks.internal1),
                mid2: Number(marks.internal2),
                assignment: Number(marks.assignment),
                attendance: Number(marks.attendance),
                external: Number(marks.external),
                grade,
            };
            await dispatch(saveMarks(payload));
        };

        const calculateTotal = (subjectCode) => {
            const marks = formData.subjects[subjectCode] || {};
            const values = [
                parseInt(marks.internal1) || 0,
                parseInt(marks.internal2) || 0,
                parseInt(marks.assignment) || 0,
                parseInt(marks.attendance) || 0,
                parseInt(marks.external) || 0
            ];
            return values.reduce((sum, mark) => sum + mark, 0);
        };

        const calculateGrade = (mid1, mid2, assignment) => {
            const total = mid1 + mid2 + assignment;
            if (total >= 85) return 'A+';
            if (total >= 75) return 'A';
            if (total >= 65) return 'B+';
            if (total >= 55) return 'B';
            if (total >= 45) return 'C';
            return 'F';
        };

        return (
            <div className="min-h-screen bg-gray-50">
                <ToastContainer />
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center space-x-3">
                            <FaUserGraduate className="text-indigo-600 text-2xl" />
                            <h1 className="text-2xl font-bold text-gray-800">Marks Feeding System</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Search Student</h2>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter Student Name or Roll Number
                                </label>
                                <div className="flex space-x-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="e.g., John Doe or CS2023001"
                                        />
                                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                                {errors.search && (
                                    <p className="mt-2 text-sm text-red-600">{errors.search}</p>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-6 shadow-sm" role="alert">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Error Message */}
                    {fetchError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">{fetchError}</span>
                        </div>
                    )}
                    {errors.save && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">{errors.save}</span>
                        </div>
                    )}
                    {/* Loading Spinner */}
                    {loading && (
                        <div className="flex justify-center items-center mb-6">
                            <span className="text-indigo-600">Loading...</span>
                        </div>
                    )}

                    {/* Marks Entry Modal */}
                    {isModalOpen && selectedStudent && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
                            <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Enter Marks for {selectedStudent.name}
                                    </h2>
                                    <button 
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setSelectedStudent(null);
                                        }} 
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                {/* Student Info */}
                                <div className="grid grid-cols-2 gap-1 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Roll Number</p>
                                        <p className="font-medium">{selectedStudent.rollNo}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Department</p>
                                        <p className="font-medium">{selectedStudent.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Semester</p>
                                        <p className="font-medium">Semester {selectedStudent.semester}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{selectedStudent.email}</p>
                                    </div>
                                </div>

                                {/* Subjects List */}
                                <div className="space-y-1">
                                    {assignedSubjects.length === 0 && (
                                        <div className="text-red-600 font-semibold mb-4">
                                            You have no assigned subjects. Please contact admin.
                                        </div>
                                    )}
                                    {assignedSubjects.map((subject) => (
                                        <div key={subject.code} className="bg-gray-50 rounded-lg p-1.5">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {subject.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Code: {subject.code} | Credits: {subject.credits}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedSubject(selectedSubject === subject.code ? '' : subject.code)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {selectedSubject === subject.code ? 'Hide Marks' : 'Show Marks'}
                                                </button>
                                            </div>

                                            {selectedSubject === subject.code && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Mid-sem-1 (20)</label>
                                                            <input
                                                                type="number"
                                                                name={`subject_${subject.code}_internal1`}
                                                                value={formData.subjects[subject.code]?.internal1 || ''}
                                                                onChange={handleInputChange}
                                                                max="20"
                                                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                                                    errors[`subject_${subject.code}_internal1`] ? 'border-red-500' : ''
                                                                }`}
                                                            />
                                                            {errors[`subject_${subject.code}_internal1`] && (
                                                                <p className="mt-1 text-sm text-red-600">{errors[`subject_${subject.code}_internal1`]}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Mid-sem-2 (20)</label>
                                                            <input
                                                                type="number"
                                                                name={`subject_${subject.code}_internal2`}
                                                                value={formData.subjects[subject.code]?.internal2 || ''}
                                                                onChange={handleInputChange}
                                                                max="20"
                                                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                                                    errors[`subject_${subject.code}_internal2`] ? 'border-red-500' : ''
                                                                }`}
                                                            />
                                                            {errors[`subject_${subject.code}_internal2`] && (
                                                                <p className="mt-1 text-sm text-red-600">{errors[`subject_${subject.code}_internal2`]}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Assignment (10)</label>
                                                            <input
                                                                type="number"
                                                                name={`subject_${subject.code}_assignment`}
                                                                value={formData.subjects[subject.code]?.assignment || ''}
                                                                onChange={handleInputChange}
                                                                max="10"
                                                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                                                    errors[`subject_${subject.code}_assignment`] ? 'border-red-500' : ''
                                                                }`}
                                                            />
                                                            {errors[`subject_${subject.code}_assignment`] && (
                                                                <p className="mt-1 text-sm text-red-600">{errors[`subject_${subject.code}_assignment`]}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Attendance (10)</label>
                                                            <input
                                                                type="number"
                                                                name={`subject_${subject.code}_attendance`}
                                                                value={formData.subjects[subject.code]?.attendance || ''}
                                                                onChange={handleInputChange}
                                                                max="10"
                                                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                                                    errors[`subject_${subject.code}_attendance`] ? 'border-red-500' : ''
                                                                }`}
                                                            />
                                                            {errors[`subject_${subject.code}_attendance`] && (
                                                                <p className="mt-1 text-sm text-red-600">{errors[`subject_${subject.code}_attendance`]}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">External (50)</label>
                                                        <input
                                                            type="number"
                                                            name={`subject_${subject.code}_external`}
                                                            value={formData.subjects[subject.code]?.external || ''}
                                                            onChange={handleInputChange}
                                                            max="50"
                                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                                                errors[`subject_${subject.code}_external`] ? 'border-red-500' : ''
                                                            }`}
                                                        />
                                                        {errors[`subject_${subject.code}_external`] && (
                                                            <p className="mt-1 text-sm text-red-600">{errors[`subject_${subject.code}_external`]}</p>
                                                        )}
                                                    </div>

                                                    {/* Total and Grade Preview */}
                                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div>
                                                                <p className="text-sm text-gray-500">Total Marks</p>
                                                                <p className="text-lg font-semibold">{calculateTotal(subject.code)}/110</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Best of Two</p>
                                                                <p className="text-lg font-semibold">{Math.max(Number(formData.subjects[subject.code]?.internal1) || 0, Number(formData.subjects[subject.code]?.internal2) || 0)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Grade</p>
                                                                <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                                                                    calculateGrade(
                                                                        Number(formData.subjects[subject.code]?.internal1) || 0,
                                                                        Number(formData.subjects[subject.code]?.internal2) || 0,
                                                                        Number(formData.subjects[subject.code]?.assignment) || 0
                                                                    ) === 'A+' ? 'bg-green-100 text-green-800' :
                                                                    calculateGrade(
                                                                        Number(formData.subjects[subject.code]?.internal1) || 0,
                                                                        Number(formData.subjects[subject.code]?.internal2) || 0,
                                                                        Number(formData.subjects[subject.code]?.assignment) || 0
                                                                    ) === 'A' ? 'bg-green-100 text-green-800' :
                                                                    calculateGrade(
                                                                        Number(formData.subjects[subject.code]?.internal1) || 0,
                                                                        Number(formData.subjects[subject.code]?.internal2) || 0,
                                                                        Number(formData.subjects[subject.code]?.assignment) || 0
                                                                    ) === 'B+' ? 'bg-blue-100 text-blue-800' :
                                                                    calculateGrade(
                                                                        Number(formData.subjects[subject.code]?.internal1) || 0,
                                                                        Number(formData.subjects[subject.code]?.internal2) || 0,
                                                                        Number(formData.subjects[subject.code]?.assignment) || 0
                                                                    ) === 'B' ? 'bg-blue-100 text-blue-800' :
                                                                    calculateGrade(
                                                                        Number(formData.subjects[subject.code]?.internal1) || 0,
                                                                        Number(formData.subjects[subject.code]?.internal2) || 0,
                                                                        Number(formData.subjects[subject.code]?.assignment) || 0
                                                                    ) === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {calculateGrade(
                                                                        Number(formData.subjects[subject.code]?.internal1) || 0,
                                                                        Number(formData.subjects[subject.code]?.internal2) || 0,
                                                                        Number(formData.subjects[subject.code]?.assignment) || 0
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSaveMarks(subject.code)}
                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
                                                            disabled={loading}
                                                        >
                                                            {loading ? (
                                                                <span className="mr-2">Saving...</span>
                                                            ) : (
                                                                <FaSave className="inline mr-2" />
                                                            )}
                                                            Save Marks
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        );
    }