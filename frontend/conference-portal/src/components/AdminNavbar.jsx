import { Link, useLocation } from 'react-router-dom';

export default function AdminNavbar() {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/conference', label: 'Conference' },
    { path: '/admin/papers', label: 'Papers' },
    { path: '/admin/registrations', label: 'Registrations' }
  ];

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-brand">
          <Link to="/admin/dashboard">
            <span className="admin-brand-text">ISC 2026 Admin</span>
          </Link>
        </div>
        
        <div className="admin-navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="admin-navbar-actions">
          <Link to="/" className="admin-nav-logout">
            Exit Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
