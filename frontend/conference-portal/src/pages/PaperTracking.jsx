import { useState } from 'react';
import { papersAPI } from '../services/api';

function getStatusClass(status) {
  const map = {
    pending: 'status-pending',
    reviewed: 'status-review',
    accepted: 'status-accepted',
    rejected: 'status-rejected',
  };
  return map[status] || '';
}

export default function PaperTracking() {
  const [email, setEmail] = useState('');
  const [papers, setPapers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const papersData = await papersAPI.getPapersByEmail(email.trim());
      setPapers(papersData);
    } catch (err) {
      setError('Failed to fetch papers. Please try again.');
      console.error('Paper search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="track-paper-page page">
      <header className="page-header">
        <h1>Track Your Paper</h1>
        <p>Enter your email to view the status of your submissions.</p>
      </header>

      <form onSubmit={handleSearch} className="track-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}

      {searched && (
        <div className="papers-table-wrapper">
          {papers.length === 0 ? (
            <p className="no-results">No papers found for this email.</p>
          ) : (
            <table className="papers-table">
              <thead>
                <tr>
                  <th>Paper Title</th>
                  <th>Theme</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((paper) => (
                  <tr key={paper._id}>
                    <td>{paper.paper_title}</td>
                    <td>{paper.theme}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(paper.status)}`}>
                        {paper.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}
