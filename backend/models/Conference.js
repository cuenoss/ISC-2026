import mongoose from 'mongoose';

const conferenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  
  date: {
    type: Date,
    required: true
  },

  venue: String,
  address: String,
 
  themes: String,
  
  // Certificate template
  certificate_template: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Conference = mongoose.model('Conference', conferenceSchema, 'conferences');
export default Conference;
