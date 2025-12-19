const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  onboardingSubmissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnboardingSubmission',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  linkedinUrl: {
    type: String
  },
  reportingManager: {
    type: String
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String
  },
  aboutMe: {
    type: String
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
