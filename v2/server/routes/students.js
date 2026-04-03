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

module.exports = router;
