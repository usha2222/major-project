import express from 'express';
import Student from '../models/Student.js';
import Marksheet from '../models/Marksheet.js';
import authenticateToken from '../middleware/auth.js';
import Faculty from '../models/Faculty.js';

const router = express.Router();

// Search student by rollNo, rollNumber, name, or email and return their marksheet
router.get('/search', async (req, res) => {
  let { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });
  query = query.trim(); // Trim input for more robust search
  try {
    // Debug: log all students
    const allStudents = await Student.find({});
    console.log('All students:', allStudents);

    // First, try exact match (case-insensitive)
    let student = await Student.findOne({
      $or: [
        { rollNo: { $regex: `^${query}$`, $options: 'i' } },
        { rollNumber: { $regex: `^${query}$`, $options: 'i' } },
        { name: query }, // Case-sensitive, exact match
        { email: { $regex: `^${query}$`, $options: 'i' } }
      ]
    });

    // Remove partial match fallback for name
    if (!student) {
      return res.status(404).json({ error: 'Student not found', allStudents });
    }
    const subjects = await Marksheet.find({ student: student._id }).populate('subject');
    res.json({ student, subjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to list all students for debugging
router.get('/allstudents', async (req, res) => {
  try {
    const allStudents = await Student.find({});
    res.json({ allStudents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/marksheets - Add or update marks for a student and subject
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { rollNo, rollNumber, subjectCode, mid1, mid2, assignment, attendance, external, grade, email } = req.body;
    console.log('POST /api/marksheets payload:', req.body);
    if (!rollNo && !rollNumber && !email) return res.status(400).json({ error: 'rollNo, rollNumber, or email is required' });
    if (!subjectCode) return res.status(400).json({ error: 'subjectCode is required' });
    // Get logged-in faculty
    const faculty = await Faculty.findOne({ user: req.user.id });
    console.log('Found faculty:', faculty);
    if (!faculty) return res.status(403).json({ error: 'Faculty not found or not authorized' });
    if (!faculty.subjects.includes(subjectCode)) {
      return res.status(403).json({ error: 'You are not authorized to feed marks for this subject' });
    }
    // Find student by rollNo or rollNumber (case-insensitive), or by email
    let student = await Student.findOne({
      $or: [
        rollNo ? { rollNo: { $regex: `^${rollNo}$`, $options: 'i' } } : null,
        rollNumber ? { rollNumber: { $regex: `^${rollNumber}$`, $options: 'i' } } : null,
        email ? { email: { $regex: `^${email}$`, $options: 'i' } } : null
      ].filter(Boolean)
    });
    console.log('Found student:', student);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    // Find subject by code (case-insensitive)
    const Subject = (await import('../models/Subject.js')).default;
    const subject = await Subject.findOne({ code: { $regex: `^${subjectCode}$`, $options: 'i' } });
    console.log('Found subject:', subject);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    // Upsert marksheet with denormalized fields
    const marksheet = await Marksheet.findOneAndUpdate(
      { student: student._id, subject: subject._id },
      {
        student: student._id,
        subject: subject._id,
        studentName: student.name,
        rollNo: student.rollNo,
        subjectName: subject.name,
        subjectCode: subject.code,
        mid1, mid2, assignment, attendance, external, grade
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ message: 'Marksheet saved', marksheet });
  } catch (err) {
    console.error('Error in POST /api/marksheets:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// GET /api/marksheets/student/:rollNo - Get all marks for a student by roll number
router.get('/student/:rollNo', authenticateToken, async (req, res) => {
  try {
    const { rollNo } = req.params;
    const student = await Student.findOne({
      $or: [
        { rollNo: rollNo },
        { rollNumber: rollNo }
      ]
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    // Always return all marksheets for the student, regardless of faculty assignment
    let marksheets = await Marksheet.find({ student: student._id }).populate('subject');
    res.json(marksheets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: Add a /ping route for health check
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

export default router; 