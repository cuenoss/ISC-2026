import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  affiliation: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  biography: {
    type: String,
    default: ''
  },
  photo_url: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Speaker = mongoose.model('Speaker', speakerSchema);
export default Speaker;
