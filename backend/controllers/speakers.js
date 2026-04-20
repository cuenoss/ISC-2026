import Speaker from '../models/Speaker.js';

export const get_all_speakers = async (req, res) => {
  try {
    console.log('Fetching all speakers...');
    const speakers = await Speaker.find({});
    console.log('Speakers found:', speakers.length);
    res.json(speakers);
  } catch (error) {
    console.log('Speakers error:', error);
    res.status(500).json({ error: 'Failed to fetch all speakers' });
  }
};

export const get_speakers_by_theme = async (req, res) => {
  const { theme } = req.params;
  try {
    const speakers = await Speaker.find({ 
      topic: { $regex: theme, $options: 'i' }
    });
    res.json(speakers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch speakers by theme' });
  }
};

export const get_speakers_by_country = async (req, res) => {
  const { country } = req.params;
  try {
    const speakers = await Speaker.find({ 
      affiliation: { $regex: country, $options: 'i' }
    });
    res.json(speakers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch speakers by country' });
  }
};

export const get_speaker_by_id = async (req, res) => {
  const { id } = req.params;
  try {
    const speaker = await Speaker.findById(id);
    if (!speaker) {
      return res.status(404).json({ error: 'Speaker not found' });
    }
    res.json(speaker);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch speaker by ID' });
  }
};

