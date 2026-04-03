const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Create new event (teacher)
router.post('/', async (req, res) => {
  try {
    const { title, description, eventDate, eventTime, venue, category, teamSize, maxRegistrations, postedBy } = req.body;
    if (!title || !description || !eventDate || !eventTime || !venue || !category || !postedBy) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    const newEvent = new Event({ title, description, eventDate, eventTime, venue, category, teamSize: teamSize || 1, maxRegistrations: maxRegistrations || 100, postedBy });
    await newEvent.save();
    res.status(201).json({ success: true, data: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete an event (teacher)
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    await EventRegistration.deleteMany({ eventId: req.params.id });
    await event.deleteOne();
    res.json({ success: true, message: 'Event and its registrations removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Register for an event (student)
router.post('/:id/register', async (req, res) => {
  try {
    const { studentName, studentEmail, studentPhone, teamMembers } = req.body;
    if (!studentName || !studentEmail || !studentPhone) {
      return res.status(400).json({ success: false, message: 'Please provide your name, email, and phone' });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Check if already registered
    const existing = await EventRegistration.findOne({ eventId: req.params.id, studentEmail });
    if (existing) return res.status(400).json({ success: false, message: 'You are already registered for this event' });

    // Check max registrations
    const regCount = await EventRegistration.countDocuments({ eventId: req.params.id });
    if (regCount >= event.maxRegistrations) {
      return res.status(400).json({ success: false, message: 'Event is full, no more spots available' });
    }

    const registration = new EventRegistration({ eventId: req.params.id, studentName, studentEmail, studentPhone, teamMembers: teamMembers || [] });
    await registration.save();
    res.status(201).json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get registrations for a specific event (teacher)
router.get('/:id/registrations', async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.id }).sort({ registeredAt: -1 });
    res.json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get registration count for an event
router.get('/:id/count', async (req, res) => {
  try {
    const count = await EventRegistration.countDocuments({ eventId: req.params.id });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
