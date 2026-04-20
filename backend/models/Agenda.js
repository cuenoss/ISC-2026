import mongoose from 'mongoose';

const agendaSchema = new mongoose.Schema({
  time_slot: {
    type: Date,
    required: true
  },
  session_title: {
    type: String,
    required: true
  },

  speaker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speaker'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Agenda = mongoose.model('Agenda', agendaSchema);
export default Agenda;
