const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const { sendNotificationToAllStudents } = require('../utils/emailSender');


// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get single event by ID
router.get('/test/hello', (req, res) => res.json({ msg: 'HELLO TEST' }));

router.get('/:id', async (req, res) => {
  try {
    console.log(`Hitting /:id with id: ${req.params.id}`);
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    console.error('Error in /:id route:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Create new event (teacher)
router.post('/', async (req, res) => {
  try {
    const { title, description, eventDate, eventTime, venue, category, teamSize, maxRegistrations, bannerImage, prizePool, prizePoolCurrency, postedBy } = req.body;
    if (!title || !description || !eventDate || !eventTime || !venue || !category || !postedBy) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    const newEvent = new Event({
      title, description, eventDate, eventTime, venue, category,
      teamSize: teamSize || 1,
      maxRegistrations: maxRegistrations || 100,
      bannerImage: bannerImage || '',
      prizePool: prizePool || '',
      prizePoolCurrency: prizePoolCurrency || 'INR',
      postedBy
    });
    await newEvent.save();

    // Trigger email notification
    sendNotificationToAllStudents(
      `New Event: ${title}`,
      `A new event has been posted by ${postedBy}.\n\nTitle: ${title}\nDate: ${new Date(eventDate).toLocaleDateString()}\nTime: ${eventTime}\nVenue: ${venue}\nCategory: ${category}`,
      `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #f59e0b;">New Campus Event</h2>
        <p><strong>Event:</strong> ${title}</p>
        <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()} at ${eventTime}</p>
        <p><strong>Venue:</strong> ${venue}</p>
        <p><strong>Category:</strong> ${category}</p>
        ${prizePool ? `<p><strong>Prize Pool:</strong> ${prizePool}</p>` : ''}
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p>${description}</p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">Register now on the UniLink Events portal.</p>
      </div>`
    );

    res.status(201).json({ success: true, data: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Update an event (teacher)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, eventDate, eventTime, venue, category, teamSize, maxRegistrations, bannerImage, prizePool, prizePoolCurrency } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (title) event.title = title;
    if (description) event.description = description;
    if (eventDate) event.eventDate = eventDate;
    if (eventTime) event.eventTime = eventTime;
    if (venue) event.venue = venue;
    if (category) event.category = category;
    if (teamSize) event.teamSize = teamSize;
    if (maxRegistrations) event.maxRegistrations = maxRegistrations;
    if (bannerImage !== undefined) event.bannerImage = bannerImage;
    if (prizePool !== undefined) event.prizePool = prizePool;
    if (prizePoolCurrency) event.prizePoolCurrency = prizePoolCurrency;

    await event.save();
    res.json({ success: true, data: event });
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
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
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
