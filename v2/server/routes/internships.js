const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { sendNotificationToAllStudents } = require('../utils/emailSender');


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

    // Trigger email notification
    sendNotificationToAllStudents(
      `New Opportunity: ${title} (${company})`,
      `A new ${type} has been posted by ${postedBy}.\n\nTitle: ${title}\nCompany: ${company}\nDeadline: ${new Date(deadline).toLocaleDateString()}\nLink: ${applyLink}`,
      `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #059669;">New ${type} Opportunity</h2>
        <p><strong>Role/Event:</strong> ${title}</p>
        <p><strong>Organization:</strong> ${company}</p>
        <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p>${description}</p>
        <a href="${applyLink}" style="display: inline-block; padding: 10px 20px; background: #059669; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Apply Now</a>
      </div>`
    );

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
