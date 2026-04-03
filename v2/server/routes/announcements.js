const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { sendNotificationToAllStudents } = require('../utils/emailSender');

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

    // Trigger email notification
    sendNotificationToAllStudents(
      `New Announcement: ${title}`,
      `A new announcement has been posted by ${postedBy} (${department || 'General'})\n\nTitle: ${title}\nDescription: ${description}`,
      `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366F1;">New Campus Announcement</h2>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>From:</strong> ${postedBy} (${department || 'General'})</p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p>${description}</p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">View more on UniLink Dashboard.</p>
      </div>`
    );

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
