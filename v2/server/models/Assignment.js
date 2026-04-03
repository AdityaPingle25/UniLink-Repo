const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true },
  deadline: { type: Date, required: true },
  isTeamProject: { type: Boolean, default: false },
  postedBy: { type: String, required: true },
  department: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
