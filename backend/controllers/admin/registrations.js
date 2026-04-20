import Registration from '../../models/Registration.js';

export const get_all_registrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .sort({ created_at: -1 });
    res.json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};

export const update_registration_status = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const registration = await Registration.findByIdAndUpdate(
      id,
      { status, updated_at: new Date() },
      { new: true }
    );
    
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    
    res.json(registration);
  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({ error: 'Failed to update registration status' });
  }
};

export const mark_attendance = async (req, res) => {
  const { id } = req.params;
  
  try {
    const registration = await Registration.findById(id);
    
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    
    if (registration.status !== 'accepted') {
      return res.status(400).json({ error: 'Cannot mark attendance for non-accepted registration' });
    }
    
    if (registration.attended) {
      return res.status(400).json({ error: 'Attendance already marked' });
    }
    
    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      { 
        attended: true, 
        attended_at: new Date(),
        updated_at: new Date()
      },
      { new: true }
    );
    
    res.json({
      message: 'Attendance marked successfully',
      registration: updatedRegistration
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};
