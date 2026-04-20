import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminCertificates() {
  const [certificateTemplate, setCertificateTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchCertificateTemplate();
  }, []);

  const fetchCertificateTemplate = async () => {
    try {
      const response = await fetch('/api/admin/certificate-template');
      const data = await response.json();
      
      if (response.ok) {
        setCertificateTemplate(data.certificate_template);
        setPreviewUrl(data.certificate_template);
      } else {
        // No template exists yet
        setLoading(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      const url = '/api/admin/certificate-template';
      const method = certificateTemplate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificate_template: base64
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCertificateTemplate(data.certificate_template);
        setSuccess(certificateTemplate ? 'Certificate template updated successfully!' : 'Certificate template uploaded successfully!');
        setSelectedFile(null);
      } else {
        setError(data.error || 'Failed to upload certificate template');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!previewUrl) {
      setError('No template to save');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Convert previewUrl to base64
      const base64 = await new Promise((resolve, reject) => {
        fetch(previewUrl)
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
          })
          .catch(reject);
      });

      const response = await fetch('/api/admin/certificate-template', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificate_template: base64
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCertificateTemplate(data.certificate_template);
        setSuccess('Certificate template saved successfully!');
      } else {
        setError(data.error || 'Failed to save certificate template');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the current certificate template?')) return;

    try {
      const response = await fetch('/api/admin/certificate-template', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificate_template: null
        }),
      });

      if (response.ok) {
        setCertificateTemplate(null);
        setPreviewUrl('');
        setSuccess('Certificate template deleted successfully');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete certificate template');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="admin-certificates">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading certificate template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-certificates">
      <div className="admin-header">
        <div className="admin-breadcrumb">
          <Link to="/admin/dashboard">Dashboard</Link> &gt; Certificate Template
        </div>
        <h1>Certificate Template Management</h1>
        <p>Upload and manage the certificate template for conference participants</p>
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

      <div className="certificate-manager">
        <div className="certificate-upload">
          <div className="upload-section">
            <h3>
              {certificateTemplate ? 'Update Certificate Template' : 'Upload Certificate Template'}
            </h3>
            <p>
              Upload a template image that will be used to generate certificates for participants.
              Recommended size: 1200x800px, maximum file size: 5MB.
            </p>
            
            <div className="file-upload">
              <input
                type="file"
                id="certificate-file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
              />
              <label htmlFor="certificate-file" className="file-label">
                <div className="file-icon">&#128196;</div>
                <div className="file-text">
                  {selectedFile ? selectedFile.name : 'Choose certificate template image'}
                </div>
              </label>
            </div>

            {selectedFile && (
              <div className="upload-actions">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn-primary"
                >
                  {uploading ? 'Uploading...' : (certificateTemplate ? 'Update Template' : 'Upload Template')}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(certificateTemplate || '');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {(previewUrl || certificateTemplate) && (
          <div className="certificate-preview">
            <h3>Template Preview</h3>
            <div className="preview-container">
              <img 
                src={previewUrl || certificateTemplate} 
                alt="Certificate Template Preview"
                className="certificate-image"
              />
            </div>
            
            <div className="template-actions">
                {previewUrl && (
                  <button
                    onClick={handleSaveTemplate}
                    disabled={uploading}
                    className="btn-primary"
                  >
                    {uploading ? 'Saving...' : 'Save Template'}
                  </button>
                )}
                {certificateTemplate && (
                  <button
                    onClick={handleDelete}
                    className="btn-danger"
                  >
                    Delete Template
                  </button>
                )}
              </div>
          </div>
        )}

        {!certificateTemplate && !previewUrl && (
          <div className="empty-state">
            <div className="empty-icon">&#127942;</div>
            <h3>No Certificate Template</h3>
            <p>
              Upload a certificate template to enable certificate generation for conference participants.
              The template should be designed with space for participant name, conference details, and date.
            </p>
          </div>
        )}
      </div>

      <div className="certificate-info">
        <h3>Template Guidelines</h3>
        <div className="guidelines">
          <div className="guideline-item">
            <h4>&#128221; Design Requirements</h4>
            <ul>
              <li>Image format: JPG, PNG, or GIF</li>
              <li>Recommended dimensions: 1200x800 pixels (3:2 ratio)</li>
              <li>Maximum file size: 5MB</li>
              <li>High resolution for printing (300 DPI recommended)</li>
            </ul>
          </div>
          
          <div className="guideline-item">
            <h4>&#128203; Content Placement</h4>
            <ul>
              <li>Leave space for participant name (center area)</li>
              <li>Include conference title and date</li>
              <li>Add space for signature lines</li>
              <li>Consider official logos and branding</li>
            </ul>
          </div>
          
          <div className="guideline-item">
            <h4>&#128214; Best Practices</h4>
            <ul>
              <li>Use high-contrast colors for readability</li>
              <li>Professional design with appropriate fonts</li>
              <li>Include security elements if needed</li>
              <li>Test printing before finalizing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
