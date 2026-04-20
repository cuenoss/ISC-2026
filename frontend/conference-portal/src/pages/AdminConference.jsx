import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { conferenceAPI } from '../services/api';

export default function AdminConference() {
  const [conference, setConference] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    address: '',
    themes: []
  });
  const [newTheme, setNewTheme] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchConference();
  }, []);

  const fetchConference = async () => {
    try {
      const data = await conferenceAPI.getConference();
      setConference({
        ...data,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        themes: data.themes ? (Array.isArray(data.themes) ? data.themes : data.themes.split(',').map(theme => theme.trim())) : []
      });
    } catch (err) {
      setError('Failed to fetch conference data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Clean the conference data before sending
      const cleanConferenceData = {
        title: conference.title,
        description: conference.description,
        date: conference.date,
        venue: conference.venue,
        address: conference.address,
        themes: conference.themes
      };
      
      console.log('Sending clean data:', cleanConferenceData);
      const data = await conferenceAPI.updateConference(cleanConferenceData);
      setSuccess('Conference updated successfully!');
      setConference({
        ...data,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : ''
      });
    } catch (err) {
      setError(err.message || 'Failed to update conference');
    } finally {
      setSaving(false);
    }
  };

  const addTheme = () => {
    if (newTheme.trim()) {
      let currentThemes = [];
      if (conference.themes) {
        if (typeof conference.themes === 'string') {
          currentThemes = conference.themes.split(',').map(t => t.trim());
        } else if (Array.isArray(conference.themes)) {
          currentThemes = conference.themes;
        }
      }
      
      if (!currentThemes.includes(newTheme.trim())) {
        const updatedThemes = [...currentThemes, newTheme.trim()].join(', ');
        setConference({
          ...conference,
          themes: updatedThemes
        });
      }
      setNewTheme('');
    }
  };

  const removeTheme = (index) => {
    let currentThemes = [];
    if (conference.themes) {
      if (typeof conference.themes === 'string') {
        currentThemes = conference.themes.split(',').map(t => t.trim());
      } else if (Array.isArray(conference.themes)) {
        currentThemes = conference.themes;
      }
    }
    
    const updatedThemes = currentThemes.filter((_, i) => i !== index).join(', ');
    setConference({
      ...conference,
      themes: updatedThemes
    });
  };

  const handleInputChange = (field, value) => {
    setConference({
      ...conference,
      [field]: value
    });
  };

  if (loading) {
    return (
      <div className="admin-conference">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading conference data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-conference">
      <div className="admin-header">
        <div className="admin-breadcrumb">
          <Link to="/admin/dashboard">Dashboard</Link> &gt; Conference Settings
        </div>
        <div className="admin-header-actions">
          <div>
            <h1>Conference Settings</h1>
            <p>Manage conference details and themes</p>
          </div>
          <Link to="/admin/speakers" className="btn-primary">
            Manage Speakers
          </Link>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="conference-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Conference Title</label>
            <input
              type="text"
              id="title"
              value={conference.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="form-input"
              placeholder="International Science Conference 2026"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Conference Date</label>
            <input
              type="date"
              id="date"
              value={conference.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              id="venue"
              value={conference.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              className="form-input"
              placeholder="Main Convention Center"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={conference.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="form-input"
              placeholder="123 Conference Street, City, Country"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={conference.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="form-textarea"
            rows={6}
            placeholder="Describe the conference, its goals, and what attendees can expect..."
            required
          />
        </div>

        <div className="form-group">
          <label>Conference Themes</label>
          <div className="themes-manager">
            <div className="themes-input">
              <input
                type="text"
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value)}
                className="form-input"
                placeholder="Add a new theme..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTheme())}
              />
              <button type="button" onClick={addTheme} className="btn-add-theme">
                Add Theme
              </button>
            </div>
            
            <div className="themes-list">
              {conference.themes && typeof conference.themes === 'string' && conference.themes.trim() ? (
                conference.themes.split(',').map((theme, index) => (
                  <div key={index} className="theme-item">
                    <span>{theme.trim()}</span>
                    <button
                      type="button"
                      onClick={() => removeTheme(index)}
                      className="btn-remove-theme"
                    >
                      &times;
                    </button>
                  </div>
                ))
              ) : Array.isArray(conference.themes) && conference.themes.length > 0 ? (
                conference.themes.map((theme, index) => (
                  <div key={index} className="theme-item">
                    <span>{theme}</span>
                    <button
                      type="button"
                      onClick={() => removeTheme(index)}
                      className="btn-remove-theme"
                    >
                      &times;
                    </button>
                  </div>
                ))
              ) : (
                <div className="theme-item">
                  <span>No themes added yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/admin/dashboard" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
