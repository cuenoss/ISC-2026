import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ISC 2026</h3>
          <p>International Scientific Conference</p>
          <p>Advancing Research. Connecting Minds.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/speakers">Speakers</Link>
          <Link to="/agenda">Agenda</Link>
          <Link to="/register">Register</Link>
          <Link to="/submit-paper">Submit Paper</Link>
          <Link to="/track-paper">Track Paper</Link>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>conference@isc2026.org</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} International Scientific Conference. All rights reserved.</p>
      </div>
    </footer>
  );
}
