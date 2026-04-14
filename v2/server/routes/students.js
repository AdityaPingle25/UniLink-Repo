const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students (optionally filter by divisions)
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.divisions) {
      const divisions = req.query.divisions.split(',');
      query.division = { $in: divisions };
    }

    const students = await Student.find(query).select('-password').sort({ fullName: 1 });
    res.json({ success: true, data: students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Update student profile
router.put('/:id', async (req, res) => {
  try {
    const { fullName, email, prn, division, year, branch, phone } = req.body;

    // Check if email or PRN is taken by another student
    const existing = await Student.findOne({
      $or: [{ email }, { prn }],
      _id: { $ne: req.params.id }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email or PRN already in use by another student.' });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (prn) updateData.prn = prn;
    if (division) updateData.division = division;
    if (year) updateData.year = year;
    if (branch) updateData.branch = branch;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        prn: student.prn,
        division: student.division,
        year: student.year,
        branch: student.branch,
        role: student.role
      }
    });
  } catch (err) {
    console.error('Student Update Error:', err);
    res.status(500).json({ success: false, message: 'Server error during update.' });
  }
});

// Update or merge Student Profile specifically (phone, socialLinks)
router.put('/:id/profile', async (req, res) => {
  try {
    const { phone, socialLinks } = req.body;
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    if (phone !== undefined) student.phone = phone;
    if (socialLinks !== undefined) student.socialLinks = socialLinks;

    await student.save();

    res.json({ success: true, data: student });
  } catch (err) {
    console.error('Student Profile Update Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
