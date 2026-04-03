const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true },
  venue: { type: String, required: true },
  category: { type: String, required: true },
  teamSize: { type: Number, default: 1 },
  maxRegistrations: { type: Number, default: 100 },
  postedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
