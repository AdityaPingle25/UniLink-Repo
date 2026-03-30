const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// POST /api/announcements
router.post('/', async (req, res) => {
  try {
    const { title, description, audience, postedBy, department } = req.body;

    const newAnnouncement = new Announcement({
      title,
      description,
      audience,
      postedBy,
      department
    });

    await newAnnouncement.save();
    res.status(201).json({ success: true, data: newAnnouncement });
  } catch (error) {
    console.error('Error posting announcement:', error);
    res.status(500).json({ success: false, message: 'Server error while posting announcement' });
  }
});

// GET /api/announcements
router.get('/', async (req, res) => {
  try {
    // Sort by newest first
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ success: false, message: 'Server error fetching announcements' });
  }
});

module.exports = router;
