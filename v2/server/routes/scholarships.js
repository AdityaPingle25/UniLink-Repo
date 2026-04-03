const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');

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
