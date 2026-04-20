import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import CertificatePreview from '../components/CertificatePreview';
import { conferenceAPI, registrationAPI } from '../services/api';

const CONFERENCE_DATE = new Date('2026-06-15T09:00:00');

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [certName, setCertName] = useState('');
  const [certEmail, setCertEmail] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [certError, setCertError] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [showRegStatus, setShowRegStatus] = useState(false);
  const [regError, setRegError] = useState('');
  const [regStatusData, setRegStatusData] = useState(null);
  const [conferenceData, setConferenceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = CONFERENCE_DATE - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch conference data from API
  useEffect(() => {
    const fetchConferenceData = async () => {
      try {
        const data = await conferenceAPI.getConference();
        setConferenceData(data);
      } catch (error) {
        console.error('Failed to fetch conference data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConferenceData();
  }, []);

  const themes = [
    'Artificial Intelligence',
    'Renewable Energy',
    'Data Science',
    'Climate Technology',
  ];


  const handleRegistrationStatus = async (e) => {
    e.preventDefault();
    setRegError('');
    setShowRegStatus(false);
    setLoading(true);

    try {
      const registrationData = await registrationAPI.checkRegistrationStatus(regEmail.trim());
      setRegStatusData(registrationData);
      setShowRegStatus(true);
    } catch (error) {
      setRegError('No registration found for this email address. Please register first.');
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateLookup = async (e) => {
    e.preventDefault();
    setCertError('');
    setShowCertificate(false);

    try {
      const registration = await registrationAPI.checkRegistrationStatus(certEmail);
      if (registration && registration.status === 'accepted') {
        setShowCertificate(true);
      } else {
        setCertError('Registration not accepted yet. Please wait for approval.');
      }
    } catch (error) {
      setCertError('No registration found for this name and email. Please register first.');
    }
  };

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>{conferenceData?.title || 'International Scientific Conference 2026'}</h1>
          <p>{conferenceData?.description || 'Advancing Research. Connecting Minds. Shaping the Future.'}</p>
          <p className="hero-date">{formatDate(conferenceData?.date) || 'June 15–17, 2026'} • {conferenceData?.venue || 'International Convention Center, Tech City'}</p>
          <Link to="/register" className="btn btn-primary btn-hero">
            Register Now
          </Link>
        </div>
        <div className="hero-overlay"></div>
      </section>

      <section className="countdown-section">
        <h2>Event Countdown</h2>
        <div className="countdown">
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.days}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.hours}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.minutes}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.seconds}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
      </section>

      <section className="themes-section">
        <h2>Conference Themes</h2>
        <div className="themes-grid">
          {themes.map((theme, i) => (
            <div key={theme} className="theme-card" data-aos="fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="theme-icon">{theme.charAt(0)}</span>
              <h3>{theme}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="registration-status-section">
        <h2>Registration Status</h2>
        <p>Check your registration status by entering your registered email address.</p>
        <form onSubmit={handleRegistrationStatus} className="registration-form">
          <input
            type="email"
            placeholder="Email Address"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Check Status
          </button>
        </form>
        {regError && <p className="reg-error">{regError}</p>}
        {showRegStatus && (
          <div className="registration-status-result">
            <h3>Registration Found</h3>
            <p><strong>Name:</strong> {regStatusData.name}</p>
            <p><strong>Email:</strong> {regStatusData.email}</p>
            <p><strong>Status:</strong> <span className={`status-badge status-${regStatusData.status}`}>{regStatusData.status}</span></p>
            <p><strong>Registration Date:</strong> {formatDate(regStatusData.created_at)}</p>
          </div>
        )}
      </section>

      <section className="certificate-section">
        <h2>Certificate of Attendance</h2>
        <p>Enter your registered name and email to preview your certificate.</p>
        <form onSubmit={handleCertificateLookup} className="certificate-form">
          <input
            type="text"
            placeholder="Full Name"
            value={certName}
            onChange={(e) => setCertName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={certEmail}
            onChange={(e) => setCertEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            View Certificate
          </button>
        </form>
        {certError && <p className="cert-error">{certError}</p>}
        {showCertificate && <CertificatePreview name={certName} email={certEmail} />}
      </section>

      <section className="cta-section">
        <h2>Ready to Join?</h2>
        <p>Register now and secure your spot at the premier scientific conference of 2026.</p>
        <Link to="/register" className="btn btn-primary btn-large">
          Register Now
        </Link>
      </section>
    </main>
  );
}
