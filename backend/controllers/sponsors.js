import Sponsor from '../models/Sponsor.js';

export const get_sponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find();
        res.json(sponsors);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch sponsors' });
    }
};
