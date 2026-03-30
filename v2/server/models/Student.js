const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  prn: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  division: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  role: { type: String, default: 'Student' } // Added role to clearly identify user type
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
