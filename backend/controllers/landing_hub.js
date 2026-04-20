import Conference from '../models/Conference.js';
import Speaker from '../models/Speaker.js';

export const get_conference = async (req, res) => {
    try {
        const conference = await Conference.findOne();
        res.json(conference);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch conference' });
    }
}

//dono if we'll keep it in the main hub,repeated info
export const get_speakers = async (req, res) => {
    try {
        const speakers = await Speaker.find();
        res.json(speakers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch speakers' });
    }
}
