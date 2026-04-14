const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  divisions: [{ type: String }],
  phone: { type: String, default: 'Not set' },
  college: { type: String, default: 'PCCOE, Pune' },
  role: { type: String, default: 'Teacher' },
  socialLinks: [{ platform: String, url: String }]
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
