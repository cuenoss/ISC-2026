//the routes
import express from 'express';
import { get_conference, get_speakers } from './controllers/landing_hub.js';
import { get_agenda } from './controllers/agenda.js';
import { get_sponsors } from './controllers/sponsors.js';
import { submit_registration } from './controllers/registration.js';
import { submit_feedback } from './controllers/feedback.js';
import { get_papers, get_papers_by_author, get_papers_by_email, submit_paper } from './controllers/papers.js';
import { get_all_speakers, get_speakers_by_theme, get_speakers_by_country, get_speaker_by_id } from './controllers/speakers.js';
import { 
  generate_certificate_preview,
  create_certificate
} from './controllers/certificate.js';
import { 
  check_registration_status
} from './controllers/registration.js';
import { 
  admin_login, 
  get_dashboard_stats
} from './controllers/admin/dashboard.js';
import { 
  get_all_registrations,
  update_registration_status,
  mark_attendance
} from './controllers/admin/registrations.js';
import { 
  get_all_papers_admin,
  update_paper_status,
  get_papers_by_status
} from './controllers/admin/papers.js';
import { 
  get_conference_admin,
  update_conference,
  upload_certificate_template,
  get_certificate_template,
  replace_certificate_template,
  get_all_speakers_admin,
  create_speaker as create_speaker_admin,
  update_speaker as update_speaker_admin,
  delete_speaker
} from './controllers/admin/conference.js';

const router = express.Router();

// Conference routes
router.get('/conference', get_conference);
router.get('/agenda', get_agenda);
router.get('/sponsors', get_sponsors);

// Registration routes
router.post('/registration', submit_registration);
router.get('/registration/status', check_registration_status);

// Paper routes (public-facing only)
router.get('/papers', get_papers);
router.post('/submit-paper', submit_paper);
router.get('/papers/author/:author_name', get_papers_by_author);
router.get('/papers/email/:email', get_papers_by_email);

// Speaker routes (public-facing only)
router.get('/speakers', get_all_speakers);
router.get('/speakers/theme/:theme', get_speakers_by_theme);
router.get('/speakers/country/:country', get_speakers_by_country);
router.get('/speakers/:id', get_speaker_by_id);

// Feedback routes
router.post('/feedback', submit_feedback);

// Certificate routes
router.get('/certificates/status', check_registration_status);
router.get('/certificates/preview', generate_certificate_preview);
router.post('/certificates/create', create_certificate);

// Admin routes
router.post('/admin/login', admin_login);
router.get('/admin/dashboard-stats', get_dashboard_stats);

// Admin registration management
router.get('/admin/registrations', get_all_registrations);
router.put('/admin/registrations/:id/status', update_registration_status);
router.put('/admin/registrations/:id/attendance', mark_attendance);

// Admin paper management
router.get('/admin/papers', get_all_papers_admin);
router.put('/admin/papers/:id/status', update_paper_status);
router.get('/admin/papers/status/:status', get_papers_by_status);

// Admin conference & speaker management
router.get('/admin/conference', get_conference_admin);
router.put('/admin/conference', update_conference);
router.post('/admin/certificate-template', upload_certificate_template);
router.get('/admin/certificate-template', get_certificate_template);
router.put('/admin/certificate-template', replace_certificate_template);
router.get('/admin/speakers', get_all_speakers_admin);
router.post('/admin/speakers', create_speaker_admin);
router.put('/admin/speakers/:id', update_speaker_admin);
router.delete('/admin/speakers/:id', delete_speaker);

export default router;

