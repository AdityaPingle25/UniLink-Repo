const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, prn, email, password, division, year, branch } = req.body;

    // Check if student exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { prn }] });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student with this email or PRN already exists.' });
    }

    // Create new student
    const newStudent = new Student({
      fullName,
      prn,
      email,
      password, // Storing password securely with bcrypt is recommended in production
      division,
      year,
      branch
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      data: {
        id: newStudent._id,
        fullName: newStudent.fullName,
        email: newStudent.email,
        prn: newStudent.prn,
        role: newStudent.role
      }
    });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // We allow login by email or PRN
    const student = await Student.findOne({ 
      $or: [{ email: identifier }, { prn: identifier }] 
    });

    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (student.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    res.json({
      success: true,
      data: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        prn: student.prn,
        role: student.role,
        year: student.year,
        branch: student.branch
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// POST /api/auth/teacher/register
router.post('/teacher/register', async (req, res) => {
  try {
    const { fullName, employeeId, email, password, department } = req.body;

    // Check if teacher exists
    const existingTeacher = await Teacher.findOne({ $or: [{ email }, { employeeId }] });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: 'Teacher with this email or Employee ID already exists.' });
    }

    // Create new teacher
    const newTeacher = new Teacher({
      fullName,
      employeeId,
      email,
      password,
      department
    });

    await newTeacher.save();

    res.status(201).json({
      success: true,
      data: {
        id: newTeacher._id,
        fullName: newTeacher.fullName,
        email: newTeacher.email,
        employeeId: newTeacher.employeeId,
        department: newTeacher.department,
        role: newTeacher.role
      }
    });

  } catch (err) {
    console.error('Teacher Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/teacher/login
router.post('/teacher/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const teacher = await Teacher.findOne({ 
      $or: [{ email: identifier }, { employeeId: identifier }] 
    });

    if (!teacher) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (teacher.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    res.json({
      success: true,
      data: {
        id: teacher._id,
        fullName: teacher.fullName,
        email: teacher.email,
        employeeId: teacher.employeeId,
        department: teacher.department,
        role: teacher.role
      }
    });

  } catch (err) {
    console.error('Teacher Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

module.exports = router;
