import Registration from '../models/Registration.js';

// Helper function to get user-friendly status messages
const getStatusMessage = (status, attended) => {
  if (status === 'pending') {
    return 'Your registration is pending review by the conference committee.';
  } else if (status === 'rejected') {
    return 'Your registration has been rejected. Please contact the conference committee for more information.';
  } else if (status === 'accepted') {
    if (attended) {
      return 'Congratulations! You have attended the conference and can now download your certificate.';
    } else {
      return 'Your registration has been accepted. Please check in at the conference to get your certificate.';
    }
  } else {
    return 'Registration status unknown. Please contact support.';
  }
};

export const check_registration_status = async (req, res) => {
  const { email } = req.query;
  
  try {
    const registration = await Registration.findOne({ email });
    
    if (!registration) {
      return res.status(404).json({ 
        error: 'Registration not found',
        message: 'No registration found with this email address'
      });
    }
    
    const response = {
      name: registration.name,
      email: registration.email,
      status: registration.status,
      attended: registration.attended,
      attended_at: registration.attended_at,
      created_at: registration.created_at,
      message: getStatusMessage(registration.status, registration.attended)
    };
    
    res.json(response);
  } catch (error) {
    console.error('Check registration status error:', error);
    res.status(500).json({ error: 'Failed to check registration status' });
  }
};

export const submit_registration = async (req, res) => {
    const { name, email, institution, country } = req.body;
    try {
        const registration = await Registration.create({
            name,
            email,
            institution,
            country,
            status: 'pending'
        });
        res.json(registration);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to submit registration' });
    }
};
