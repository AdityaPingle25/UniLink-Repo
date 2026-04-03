const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const { sendNotificationToAllStudents } = require('../utils/emailSender');


// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ deadline: 1 });
    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Post a new assignment
router.post('/', async (req, res) => {
  try {
    const { title, subject, deadline, isTeamProject, postedBy, department } = req.body;
    
    if (!title || !subject || !deadline) {
      return res.status(400).json({ success: false, message: 'Please provide title, subject, and deadline' });
    }

    const assignment = new Assignment({
      title,
      subject,
      deadline,
      isTeamProject: isTeamProject || false,
      postedBy: postedBy || 'Unknown Teacher',
      department: department || 'Unknown'
    });

    await assignment.save();

    // Trigger email notification
    sendNotificationToAllStudents(
      `New Assignment: ${title}`,
      `A new assignment has been posted by ${postedBy} for ${subject}.\n\nTitle: ${title}\nDeadline: ${new Date(deadline).toLocaleString()}\nType: ${isTeamProject ? 'Team Project' : 'Individual'}`,
      `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #e11d48;">New Assignment Posted</h2>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Task:</strong> ${title}</p>
        <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleString()}</p>
        <p><strong>Type:</strong> ${isTeamProject ? 'Team Project' : 'Individual'}</p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; margin-top: 20px;">Submit your work via the UniLink Assignment portal.</p>
      </div>`
    );

    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
});

// Delete an assignment
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Submit assignment
router.post('/:id/submit', async (req, res) => {
  try {
    const { studentName, submissionLink } = req.body;
    
    // Check if assignment exists
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const submission = new AssignmentSubmission({
      assignmentId: req.params.id,
      studentName: studentName || 'Student',
      submissionLink: submissionLink || ''
    });

    await submission.save();
    res.status(201).json({ success: true, message: 'Assignment submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
});

// Get submissions for an assignment
router.get('/:id/submissions', async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ assignmentId: req.params.id }).sort({ submittedAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
});

module.exports = router;
