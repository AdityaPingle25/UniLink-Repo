const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher',
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
}, { timestamps: true, collection: 'teacher_profile' });

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);
