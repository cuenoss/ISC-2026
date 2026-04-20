import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations');
      const data = await response.json();
      
      if (response.ok) {
        let filteredData = Array.isArray(data) ? data : [];
        
        // Apply client-side filtering if needed
        if (filter !== 'all') {
          filteredData = filteredData.filter(reg => {
            switch (filter) {
              case 'pending':
                return reg.status === 'pending';
              case 'accepted':
                return reg.status === 'accepted';
              case 'confirmed':
                return reg.status === 'confirmed';
              case 'attended':
                return reg.attended === true;
              default:
                return true;
            }
          });
        }
        
        setRegistrations(filteredData);
      } else {
        setError('Failed to fetch registrations');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (registrationId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (response.ok) {
        fetchRegistrations(); // Refresh list
      } else {
        setError(data.error || 'Failed to update registration status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const markAttendance = async (registrationId) => {
    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}/attendance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attended: true }),
      });

      const data = await response.json();
      
      if (response.ok) {
        fetchRegistrations(); // Refresh list
      } else {
        setError(data.error || 'Failed to mark attendance');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'confirmed': return 'status-confirmed';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="admin-registrations">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-registrations">
      <div className="admin-header">
        <div className="admin-breadcrumb">
          <Link to="/admin/dashboard">Dashboard</Link> &gt; Registration Management
        </div>
        <h1>Registration Management</h1>
        <p>Review and manage participant registrations</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="admin-filters">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select 
          id="status-filter"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Registrations</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="confirmed">Confirmed</option>
          <option value="attended">Attended</option>
        </select>
      </div>

      <div className="registrations-table-wrapper">
        <table className="papers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Institution</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-results">
                  No registrations found for the selected filter.
                </td>
              </tr>
            ) : (
              registrations.map((registration) => (
                <tr key={registration._id}>
                  <td>
                    <strong>{registration.name}</strong>
                  </td>
                  <td>{registration.email}</td>
                  <td>{registration.institution || 'N/A'}</td>
                  <td>{formatDate(registration.created_at)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(registration.status)}`}>
                      {registration.status}
                    </span>
                  </td>
                  <td>
                    {registration.attended ? (
                      <span className="status-badge status-confirmed">Attended</span>
                    ) : (
                      <span className="status-badge status-pending">Not Marked</span>
                    )}
                  </td>
                  <td>
                    <div className="registration-actions">
                      {registration.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateRegistrationStatus(registration._id, 'accepted')}
                            className="btn btn-small btn-primary"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => updateRegistrationStatus(registration._id, 'rejected')}
                            className="btn btn-small btn-outline"
                            style={{ marginLeft: '0.5rem' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {registration.status === 'accepted' && (
                        <button 
                          onClick={() => updateRegistrationStatus(registration._id, 'confirmed')}
                          className="btn btn-small btn-primary"
                        >
                          Confirm
                        </button>
                      )}
                      {registration.status === 'confirmed' && !registration.attended && (
                        <button 
                          onClick={() => markAttendance(registration._id)}
                          className="btn btn-small btn-primary"
                        >
                          Mark Attendance
                        </button>
                      )}
                      {registration.attended && (
                        <span className="attendance-checked">✓ Attended</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
