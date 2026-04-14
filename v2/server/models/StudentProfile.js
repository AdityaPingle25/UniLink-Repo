const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student',
    required: true,
    unique: true
  },
  phone: { 
    type: String, 
    default: '' 
  },
  socialLinks: [{
    platform: { type: String, required: true },
    url: { type: String, required: true }
  }]
}, { timestamps: true, collection: 'student_profile' });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
