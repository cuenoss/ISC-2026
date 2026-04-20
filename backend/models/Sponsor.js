import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  logo_url: String,
  website_url: String,
  tier: String, // gold, silver, bronze
  description: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);
export default Sponsor;
