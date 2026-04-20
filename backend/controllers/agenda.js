import Agenda from '../models/Agenda.js';

export const get_agenda = async (req, res) => {
    try {
        console.log('Fetching agenda...');
        // First try without populate to see if data exists
        let agenda = await Agenda.find().sort({ time_slot: 'asc' });
        console.log('Agenda raw count:', agenda.length);
        
        // Then populate if data exists
        if (agenda.length > 0) {
            agenda = await Agenda.find()
                .populate('speaker_id', 'name affiliation topic photo_url')
                .sort({ time_slot: 'asc' });
        }
        
        console.log('Agenda with populate:', agenda.length, 'items');
        res.json(agenda);
    } catch (error) {
        console.log('Agenda error:', error);
        res.status(500).json({ error: 'Failed to fetch agenda', details: error.message });
    }
};
