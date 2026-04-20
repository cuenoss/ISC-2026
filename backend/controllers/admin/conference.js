import Conference from '../../models/Conference.js';
import Speaker from '../../models/Speaker.js';

// Conference management 
export const get_conference_admin = async (req, res) => {
  try {
    const conference = await Conference.findOne();
    res.json(conference);
  } catch (error) {
    console.error('Get conference error:', error);
    res.status(500).json({ error: 'Failed to fetch conference' });
  }
};

export const update_conference = async (req, res) => {
  const {
    title,
    description,
    date,
    venue,
    address,
    themes
  } = req.body;
  
  try {
    let conference = await Conference.findOne();
    
    // Convert themes array to string for database storage
    const processedThemes = Array.isArray(themes) ? themes.join(', ') : (themes || '');
    
    const updateData = {
      title,
      description,
      date: new Date(date),
      venue,
      address,
      themes: processedThemes,
      updated_at: new Date()
    };
    
    if (!conference) {
      conference = await Conference.create(updateData);
    } else {
      conference = await Conference.findByIdAndUpdate(
        conference._id,
        updateData,
        { new: true }
      );
    }
    
    res.json(conference);
  } catch (error) {
    console.error('Update conference error:', error);
    res.status(500).json({ 
      error: 'Failed to update conference', 
      details: error.message 
    });
  }
};

// Certificate template management
export const upload_certificate_template = async (req, res) => {
  try {
    const { certificate_template } = req.body; // Base64 encoded image
    
    if (!certificate_template) {
      return res.status(400).json({ error: 'Certificate template is required' });
    }
    
    let conference = await Conference.findOne();
    
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }
    
    conference = await Conference.findByIdAndUpdate(
      conference._id,
      { 
        certificate_template,
        updated_at: new Date()
      },
      { new: true }
    );
    
    res.json({
      message: 'Certificate template uploaded successfully',
      conference: {
        id: conference._id,
        certificate_template: conference.certificate_template
      }
    });
  } catch (error) {
    console.error('Upload certificate template error:', error);
    res.status(500).json({ error: 'Failed to upload certificate template' });
  }
};

export const get_certificate_template = async (req, res) => {
  try {
    const conference = await Conference.findOne();
    
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }
    
    if (!conference.certificate_template) {
      return res.status(404).json({ 
        error: 'Certificate template not found',
        message: 'No certificate template has been uploaded'
      });
    }
    
    res.json({
      certificate_template: conference.certificate_template
    });
  } catch (error) {
    console.error('Get certificate template error:', error);
    res.status(500).json({ error: 'Failed to get certificate template' });
  }
};

export const replace_certificate_template = async (req, res) => {
  try {
    const { certificate_template } = req.body; // Base64 encoded image or null for deletion
    
    let conference = await Conference.findOne();
    
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }
    
    conference = await Conference.findByIdAndUpdate(
      conference._id,
      { 
        certificate_template,
        updated_at: new Date()
      },
      { new: true }
    );
    
    const message = certificate_template ? 
      'Certificate template replaced successfully' : 
      'Certificate template deleted successfully';
    
    res.json({
      message,
      conference: {
        id: conference._id,
        certificate_template: conference.certificate_template
      }
    });
  } catch (error) {
    console.error('Replace certificate template error:', error);
    res.status(500).json({ error: 'Failed to replace certificate template' });
  }
};

// Speaker management 
export const get_all_speakers_admin = async (req, res) => {
  try {
    const speakers = await Speaker.find()
      .sort({ created_at: -1 });
    res.json(speakers);
  } catch (error) {
    console.error('Get speakers error:', error);
    res.status(500).json({ error: 'Failed to fetch speakers' });
  }
};

export const create_speaker = async (req, res) => {
  const { name, affiliation, topic, photo_url } = req.body;
  try {
    const speaker = await Speaker.create({
      name,
      affiliation,
      topic,
      photo_url
    });
    res.json(speaker);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create speaker' });
  }
};

export const update_speaker = async (req, res) => {
  const { id } = req.params;
  const { name, affiliation, topic, photo_url } = req.body;
  
  try {
    const speaker = await Speaker.findByIdAndUpdate(
      id,
      {
        name,
        affiliation,
        topic,
        photo_url,
        updated_at: new Date()
      },
      { new: true }
    );
    
    if (!speaker) {
      return res.status(404).json({ error: 'Speaker not found' });
    }
    
    res.json(speaker);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update speaker' });
  }
};

export const delete_speaker = async (req, res) => {
  const { id } = req.params;
  
  try {
    const speaker = await Speaker.findByIdAndDelete(id);
    
    if (!speaker) {
      return res.status(404).json({ error: 'Speaker not found' });
    }
    
    res.json({ message: 'Speaker deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete speaker' });
  }
};
