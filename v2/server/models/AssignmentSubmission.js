const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentName: { type: String, required: true },
  submissionLink: { type: String },
  status: { type: String, enum: ['Submitted', 'Late'], default: 'Submitted' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
