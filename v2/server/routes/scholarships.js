const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const { sendNotificationToAllStudents } = require('../utils/emailSender');


// Get all scholarships
router.get('/', async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json({ success: true, data: scholarships });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Create new scholarship
router.post('/', async (req, res) => {
  try {
    const { title, description, amount, deadline, category, applyLink, postedBy } = req.body;

    if (!title || !description || !amount || !deadline || !category || !applyLink || !postedBy) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const newScholarship = new Scholarship({ title, description, amount, deadline, category, applyLink, postedBy });
    await newScholarship.save();

    // Trigger email notification
    sendNotificationToAllStudents(
      `New Scholarship: ${title}`,
      `A new scholarship has been posted by ${postedBy}.\n\nTitle: ${title}\nAmount: ${amount}\nCategory: ${category}\nDeadline: ${new Date(deadline).toLocaleDateString()}\nLink: ${applyLink}`,
      `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0284c7;">New Scholarship Available</h2>
        <p><strong>Scholarship:</strong> ${title}</p>
        <p><strong>Amount:</strong> ${amount}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p>${description}</p>
        <a href="${applyLink}" style="display: inline-block; padding: 10px 20px; background: #0284c7; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Apply Now</a>
      </div>`
    );

    res.status(201).json({ success: true, data: newScholarship });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete a scholarship
router.delete('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    await scholarship.deleteOne();
    res.json({ success: true, message: 'Scholarship removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
