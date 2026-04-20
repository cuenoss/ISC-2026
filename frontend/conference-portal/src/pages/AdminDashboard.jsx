import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalSpeakers: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    acceptedRegistrations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.stats);
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link to={link} className="stat-card">
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage ISC 2026 Conference</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          title="Total Registrations"
          value={stats.totalRegistrations}
          icon=""
          color="blue"
          link="/admin/registrations"
        />
        <StatCard
          title="Total Speakers"
          value={stats.totalSpeakers}
          icon=""
          color="green"
          link="/admin/speakers"
        />
        <StatCard
          title="Paper Submissions"
          value={stats.totalSubmissions}
          icon=""
          color="purple"
          link="/admin/papers"
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingSubmissions}
          icon=""
          color="orange"
          link="/admin/papers?filter=pending"
        />
        <StatCard
          title="Accepted Registrations"
          value={stats.acceptedRegistrations}
          icon=""
          color="teal"
          link="/admin/registrations?filter=accepted"
        />
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/conference" className="action-card">
            <div className="action-icon"></div>
            <div className="action-content">
              <h3>Conference Settings</h3>
              <p>Update conference details, themes, and venue</p>
            </div>
          </Link>
          
          <Link to="/admin/speakers" className="action-card">
            <div className="action-icon"></div>
            <div className="action-content">
              <h3>Manage Speakers</h3>
              <p>Add, edit, or remove conference speakers</p>
            </div>
          </Link>
          
          <Link to="/admin/certificates" className="action-card">
            <div className="action-icon"></div>
            <div className="action-content">
              <h3>Certificate Template</h3>
              <p>Upload and manage certificate templates</p>
            </div>
          </Link>
          
          <Link to="/admin/registrations" className="action-card">
            <div className="action-icon"></div>
            <div className="action-content">
              <h3>Registration Management</h3>
              <p>Review and manage participant registrations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
