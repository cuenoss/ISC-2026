import Registration from '../../models/Registration.js';
import Submission from '../../models/Paper.js';
import Conference from '../../models/Conference.js';
import Speaker from '../../models/Speaker.js';

// Admin auth
export const admin_login = async (req, res) => {
  const { email, password } = req.body;
  try {
   
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (email === adminEmail && password === adminPassword) {
      res.json({
        message: 'Login successful',
        admin: {
          email: adminEmail,
          full_name: 'Conference Administrator'
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get admin dashboard stats
export const get_dashboard_stats = async (req, res) => {
  try {
    const [
      totalRegistrations,
      totalSpeakers,
      totalSubmissions,
      pendingSubmissions,
      acceptedRegistrations
    ] = await Promise.all([
      Registration.countDocuments(),
      Speaker.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'pending' }),
      Registration.countDocuments({ status: 'accepted' })
    ]);

   
    res.json({
      stats: {
        totalRegistrations,
        totalSpeakers,
        totalSubmissions,
        pendingSubmissions,
        acceptedRegistrations
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
