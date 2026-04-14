const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  audience: { type: String, default: 'All Students' },
  postedBy: { type: String, required: true }, // Teacher's full name
  department: { type: String }, // Teacher's department
  fileUrl: { type: String, default: '' }, // base64 data URI or URL for attached file
  fileName: { type: String, default: '' }, // original file name
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
