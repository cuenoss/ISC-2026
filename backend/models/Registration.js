import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  institution: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  // Attendance tracking
  attended: {
    type: Boolean,
    default: false
  },
  attended_at: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create unique index for email
registrationSchema.index({ email: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
