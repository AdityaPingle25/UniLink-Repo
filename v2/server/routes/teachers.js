const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const TeacherProfile = require('../models/TeacherProfile');

// GET /api/teachers?division=A  — find teachers assigned to a division
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.division) {
      query.divisions = { $in: [req.query.division] };
    }
    const teachers = await Teacher.find(query).select('-password').sort({ fullName: 1 }).lean();
    
    // Attach profile links to each teacher object
    for (let i = 0; i < teachers.length; i++) {
        const p = await TeacherProfile.findOne({ userId: teachers[i]._id });
        if (p) {
            teachers[i].phone = p.phone || teachers[i].phone;
            teachers[i].socialLinks = p.socialLinks || teachers[i].socialLinks;
        }
    }

    res.json({ success: true, data: teachers });
  } catch (err) {
    console.error('Error fetching teachers:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET /api/teachers/:id  — public teacher profile
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    res.json({ success: true, data: teacher });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// PUT /api/teachers/:id/social  — update social links only
router.put('/:id/social', async (req, res) => {
  try {
    const { socialLinks } = req.body;
    let profile = await TeacherProfile.findOne({ userId: req.params.id });
    if (!profile) {
      profile = new TeacherProfile({ userId: req.params.id });
    }
    profile.socialLinks = socialLinks;
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// PUT /api/teachers/:id/profile — update phone/social details
router.put('/:id/profile', async (req, res) => {
  try {
    const { phone, socialLinks } = req.body;
    let profile = await TeacherProfile.findOne({ userId: req.params.id });
    if (!profile) {
      profile = new TeacherProfile({ userId: req.params.id });
    }
    if (phone !== undefined) profile.phone = phone;
    if (socialLinks !== undefined) profile.socialLinks = socialLinks;
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (err) {
    console.error('Teacher Profile Update Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
