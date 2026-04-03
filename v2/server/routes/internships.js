const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');

// Get all internships/hackathons
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.json({ success: true, data: internships });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Create new internship/hackathon
router.post('/', async (req, res) => {
  try {
    const { title, company, type, deadline, applyLink, description, postedBy } = req.body;
    
    if (!title || !company || !type || !deadline || !applyLink || !description || !postedBy) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const newInternship = new Internship({
      title,
      company,
      type,
      deadline,
      applyLink,
      description,
      postedBy
    });

    await newInternship.save();
    res.status(201).json({ success: true, data: newInternship });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete an internship
router.delete('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    
    await internship.deleteOne();
    res.json({ success: true, message: 'Internship removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
