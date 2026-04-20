import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  author_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  paper_title: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
