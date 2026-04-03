const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  type: { type: String, required: true, enum: ['Internship', 'Hackathon'] },
  deadline: { type: String, required: true },
  applyLink: { type: String, required: true },
  description: { type: String, required: true },
  postedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Internship', internshipSchema);
