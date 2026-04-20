import { Link } from 'react-router-dom';

export default function StickyRegistrationBar({ className }) {
  return (
    <div className={`sticky-registration-bar ${className || ''}`}>
      <div className="sticky-bar-content">
        <div className="sticky-bar-text">
          <h3>Ready to Join ISC 2026?</h3>
          <p>Register now for the International Science Conference</p>
        </div>
        <Link to="/register" className="sticky-register-btn">
          Register Now
        </Link>
      </div>
    </div>
  );
}
