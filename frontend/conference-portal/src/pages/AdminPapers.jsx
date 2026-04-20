import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';

export default function AdminPapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPapers();
  }, [filter]);

  const fetchPapers = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/admin/papers' 
        : `/api/admin/papers/status/${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setPapers(data.papers || data);
      } else {
        setError('Failed to fetch papers');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updatePaperStatus = async (paperId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/papers/${paperId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (response.ok) {
        fetchPapers(); // Refresh the list
      } else {
        setError(data.error || 'Failed to update paper status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'review': return 'status-review';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      case 'published': return 'status-published';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="admin-papers">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-papers">
      <div className="admin-header">
        <div className="admin-breadcrumb">
          <Link to="/admin/dashboard">Dashboard</Link> &gt; Papers Management
        </div>
        <h1>Papers Management</h1>
        <p>Review and manage paper submissions</p>
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
          <option value="all">All Papers</option>
          <option value="pending">Pending Review</option>
          <option value="review">Under Review</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="papers-table-wrapper">
        <table className="papers-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Email</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {papers.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  No papers found for the selected filter.
                </td>
              </tr>
            ) : (
              papers.map((paper) => (
                <tr key={paper._id}>
                  <td>
                    <strong>{paper.paper_title}</strong>
                    {paper.abstract && (
                      <p className="paper-abstract">{paper.abstract.substring(0, 100)}...</p>
                    )}
                  </td>
                  <td>{paper.author_name}</td>
                  <td>{paper.email}</td>
                  <td>{formatDate(paper.created_at)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(paper.status)}`}>
                      {paper.status}
                    </span>
                  </td>
                  <td>
                    <div className="paper-actions">
                      {paper.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updatePaperStatus(paper._id, 'review')}
                            className="btn btn-small btn-outline"
                          >
                            Start Review
                          </button>
                          <button 
                            onClick={() => updatePaperStatus(paper._id, 'rejected')}
                            className="btn btn-small btn-outline"
                            style={{ marginLeft: '0.5rem' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {paper.status === 'review' && (
                        <>
                          <button 
                            onClick={() => updatePaperStatus(paper._id, 'accepted')}
                            className="btn btn-small btn-primary"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => updatePaperStatus(paper._id, 'rejected')}
                            className="btn btn-small btn-outline"
                            style={{ marginLeft: '0.5rem' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {paper.status === 'accepted' && (
                        <button 
                          onClick={() => updatePaperStatus(paper._id, 'published')}
                          className="btn btn-small btn-primary"
                        >
                          Publish
                        </button>
                      )}
                      {paper.status === 'rejected' && (
                        <button 
                          onClick={() => updatePaperStatus(paper._id, 'pending')}
                          className="btn btn-small btn-outline"
                        >
                          Reconsider
                        </button>
                      )}
                      {paper.status === 'published' && (
                        <>
                          <button 
                            onClick={() => updatePaperStatus(paper._id, 'accepted')}
                            className="btn btn-small btn-outline"
                          >
                            Unpublish
                          </button>
                          <button 
                            onClick={() => updatePaperStatus(paper._id, 'rejected')}
                            className="btn btn-small btn-outline"
                            style={{ marginLeft: '0.5rem' }}
                          >
                            Reject
                          </button>
                        </>
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
