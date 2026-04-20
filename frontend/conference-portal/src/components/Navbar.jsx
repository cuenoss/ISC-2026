import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/speakers', label: 'Speakers' },
    { path: '/agenda', label: 'Agenda' },
    { path: '/register', label: 'Register' },
    { path: '/submit-paper', label: 'Submit Paper' },
    { path: '/track-paper', label: 'Track Paper' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ISC 2026
      </Link>
      <button
        className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
        aria-label="Toggle menu"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
