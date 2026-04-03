const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  amount: { type: String, required: true },
  deadline: { type: String, required: true },
  category: { type: String, required: true },
  applyLink: { type: String, required: true },
  postedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
