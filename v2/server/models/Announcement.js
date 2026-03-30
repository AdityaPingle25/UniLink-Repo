const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Academic', 'Administrative', 'Exam', 'Event'] },
  audience: { type: String, default: 'All Students' },
  postedBy: { type: String, required: true }, // Teacher's full name
  department: { type: String }, // Teacher's department
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
