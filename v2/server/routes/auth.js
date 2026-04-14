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
        branch: student.branch,
        division: student.division,
        phone: student.phone || 'Not set',
        socialLinks: student.socialLinks || []
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
    const { fullName, employeeId, email, password, department, divisions, phone, college } = req.body;

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
      department,
      phone: phone || 'Not set',
      college: college || 'PCCOE, Pune',
      divisions: divisions || []
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
        divisions: newTeacher.divisions,
        phone: newTeacher.phone,
        college: newTeacher.college,
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
        divisions: teacher.divisions,
        phone: teacher.phone || 'Not set',
        college: teacher.college,
        role: teacher.role,
        socialLinks: teacher.socialLinks || []
      }
    });

  } catch (err) {
    console.error('Teacher Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// PUT /api/auth/teacher/:id
router.put('/teacher/:id', async (req, res) => {
  try {
    const { fullName, email, employeeId, department, divisions, phone, college } = req.body;
    
    // Check if email or employeeId is taken by another teacher
    const existing = await Teacher.findOne({ 
      $or: [{ email }, { employeeId }], 
      _id: { $ne: req.params.id } 
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Email or Employee ID already in use.' });
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { fullName, email, employeeId, department, divisions, phone, college },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: teacher._id,
        fullName: teacher.fullName,
        email: teacher.email,
        employeeId: teacher.employeeId,
        department: teacher.department,
        divisions: teacher.divisions,
        phone: teacher.phone,
        college: teacher.college,
        role: teacher.role
      }
    });
  } catch (err) {
    console.error('Teacher Update Error:', err);
    res.status(500).json({ success: false, message: 'Server error during update.' });
  }
});

module.exports = router;
