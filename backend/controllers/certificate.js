import Registration from '../models/Registration.js';
import Conference from '../models/Conference.js';

// Generate certificate preview 
export const generate_certificate_preview = async (req, res) => {
  const { email } = req.query;
  
  try {
    const registration = await Registration.findOne({ email });
    
    if (!registration) {
      return res.status(404).json({ 
        error: 'Registration not found',
        message: 'No registration found with this email address'
      });
    }
    
    if (registration.status !== 'accepted' && registration.status !== 'confirmed') {
      return res.status(403).json({ 
        error: 'Registration not accepted',
        message: 'Registration not accepted yet. Please wait for approval.'
      });
    }
    
    if (!registration.attended) {
      return res.status(403).json({ 
        error: 'Not attended',
        message: 'Certificate is only available after checking in at the conference'
      });
    }
    
    // Get conference template
    const conference = await Conference.findOne();
    
    // Return certificate template as preview
    const certificate_id = `ISC2026-${registration._id.toString().slice(-6).toUpperCase()}`;
    
    // Return the template image for preview
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="certificate-preview-${certificate_id}.png"`);
    

    const base64Data = conference.certificate_template.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    res.send(imageBuffer);
  } catch (error) {
    console.error('Generate certificate preview error:', error);
    res.status(500).json({ error: 'Failed to generate certificate preview' });
  }
};

// Download certificate (for users checked as attendees)
export const create_certificate = async (req, res) => {
  const { email, name } = req.body;
  
  try {
    // Find registration by email and name
    const registration = await Registration.findOne({ email, name });
    
    if (!registration) {
      return res.status(404).json({ 
        error: 'Registration not found',
        message: 'No registration found with this email and name'
      });
    }
    
    if (registration.status !== 'accepted' && registration.status !== 'confirmed') {
      return res.status(403).json({ 
        error: 'Registration not accepted',
        message: 'Registration not accepted yet. Please wait for approval.'
      });
    }
    
    if (!registration.attended) {
      return res.status(403).json({ 
        error: 'Not attended',
        message: 'Certificate is only available after checking in at the conference'
      });
    }
    
    // Get conference template (single conference)
    const conference = await Conference.findOne();
    
    // Generate certificate on-demand (return as downloadable image)
    const certificate_id = `ISC2026-${registration._id.toString().slice(-6).toUpperCase()}`;
    
  
    // For now, return the template with headers for download
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate_id}.png"`);
    
    // Convert base64 template to buffer and send
    const base64Data = conference.certificate_template.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    res.send(imageBuffer);
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
};

