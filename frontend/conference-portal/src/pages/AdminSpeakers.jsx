import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminSpeakers() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    affiliation: '',
    topic: '',
    biography: '',
    photo_url: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await fetch('/api/admin/speakers');
      const data = await response.json();
      
      if (response.ok) {
        setSpeakers(data);
      } else {
        setError('Failed to fetch speakers');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = editingSpeaker 
        ? `/api/admin/speakers/${editingSpeaker._id}`
        : '/api/admin/speakers';
      const method = editingSpeaker ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (editingSpeaker) {
          setSpeakers(speakers.map(s => s._id === editingSpeaker._id ? data : s));
        } else {
          setSpeakers([...speakers, data]);
        }
        closeModal();
      } else {
        setError(data.error || 'Failed to save speaker');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (speakerId) => {
    if (!confirm('Are you sure you want to delete this speaker?')) return;

    try {
      const response = await fetch(`/api/admin/speakers/${speakerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSpeakers(speakers.filter(s => s._id !== speakerId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete speaker');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const openModal = (speaker = null) => {
    setEditingSpeaker(speaker);
    setFormData(speaker || {
      name: '',
      title: '',
      affiliation: '',
      topic: '',
      biography: '',
      photo_url: ''
    });
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSpeaker(null);
    setFormData({
      name: '',
      title: '',
      affiliation: '',
      topic: '',
      biography: '',
      photo_url: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  if (loading) {
    return (
      <div className="admin-speakers">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading speakers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-speakers">
      <div className="admin-header">
        <div className="admin-breadcrumb">
          <Link to="/admin/dashboard">Dashboard</Link> &gt; Speakers Management
        </div>
        <div className="admin-header-actions">
          <h1>Speakers Management</h1>
          <button onClick={() => openModal()} className="btn-primary">
            Add New Speaker
          </button>
        </div>
        <p>Manage conference speakers and their presentations</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="speakers-grid">
        {speakers.map((speaker) => (
          <div key={speaker._id} className="speaker-card">
            <div className="speaker-card-image">
              {speaker.photo_url ? (
                <img src={speaker.photo_url} alt={speaker.name} loading="lazy" />
              ) : (
                <div className="speaker-avatar-placeholder">
                  {speaker.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="speaker-topic">{speaker.topic}</span>
            </div>
            <div className="speaker-card-content">
              <h3>{speaker.name}</h3>
              <p className="speaker-title">{speaker.title || 'Speaker'}</p>
              <p className="speaker-affiliation">{speaker.affiliation}</p>
              <p className="speaker-bio">{speaker.biography || speaker.bio || ''}</p>
            </div>
            <div className="speaker-actions">
              <button 
                onClick={() => openModal(speaker)}
                className="btn-edit"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(speaker._id)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {speakers.length === 0 && (
        <div className="empty-state">
          <h3>No speakers found</h3>
          <p>Start by adding your first conference speaker.</p>
          <button onClick={() => openModal()} className="btn-primary">
            Add First Speaker
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingSpeaker ? 'Edit Speaker' : 'Add New Speaker'}
              </h2>
              <button onClick={closeModal} className="modal-close">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="form-input"
                  placeholder="Dr., Prof., Mr., Ms., etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="affiliation">Affiliation</label>
                <input
                  type="text"
                  id="affiliation"
                  value={formData.affiliation}
                  onChange={(e) => handleInputChange('affiliation', e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="topic">Presentation Topic</label>
                <input
                  type="text"
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="biography">Biography</label>
                <textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => handleInputChange('biography', e.target.value)}
                  className="form-textarea"
                  rows={4}
                  placeholder="Brief biography of the speaker..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="photo_url">Photo URL</label>
                <input
                  type="url"
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => handleInputChange('photo_url', e.target.value)}
                  className="form-input"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="modal-footer">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : (editingSpeaker ? 'Update Speaker' : 'Add Speaker')}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
