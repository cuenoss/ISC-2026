import { useState } from 'react';
import { Link } from 'react-router-dom';
import { papersAPI } from '../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const THEMES = ['Artificial Intelligence', 'Renewable Energy', 'Data Science', 'Climate Technology'];

export default function SubmitPaper() {
  const [form, setForm] = useState({
    authorName: '',
    email: '',
    paperTitle: '',
    abstract: '',
    researchTheme: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.authorName.trim()) newErrors.authorName = 'Author name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) newErrors.email = 'Please enter a valid email address';
    if (!form.paperTitle.trim()) newErrors.paperTitle = 'Paper title is required';
    if (!form.abstract.trim()) newErrors.abstract = 'Abstract is required';
    if (!form.researchTheme) newErrors.researchTheme = 'Research theme is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    if (!validate()) {
      console.log('Validation failed:', errors);
      return;
    }

    setLoading(true);
    setSubmitError('');

    const paperData = {
      author_name: form.authorName,
      email: form.email,
      paper_title: form.paperTitle,
      abstract: form.abstract,
      theme: form.researchTheme,
    };
    console.log('Submitting paper data:', paperData);

    try {
      const result = await papersAPI.submitPaper(paperData);
      console.log('Paper submitted successfully:', result);
      setForm({ authorName: '', email: '', paperTitle: '', abstract: '', researchTheme: '' });
      setSubmitted(true);
    } catch (error) {
      console.error('Paper submission error:', error);
      setSubmitError(`Failed to submit paper: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="submit-paper-page page">
        <div className="success-message">
          <h2>Paper Submitted Successfully!</h2>
          <p>Your research paper has been submitted and is now pending review.</p>
          <p>You can track its status using your email on the Track Paper page.</p>
          <Link to="/track-paper" className="btn btn-primary">Track Paper</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="submit-paper-page page">
      <header className="page-header">
        <h1>Submit Research Paper</h1>
        <p>Contribute your research to the International Scientific Conference 2026.</p>
      </header>

      <form onSubmit={handleSubmit} className="paper-form">
        <div className="form-group">
          <label htmlFor="authorName">Author Name *</label>
          <input
            id="authorName"
            name="authorName"
            type="text"
            value={form.authorName}
            onChange={handleChange}
            placeholder="Your full name"
            className={errors.authorName ? 'error' : ''}
          />
          {errors.authorName && <span className="error-text">{errors.authorName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="paperTitle">Paper Title *</label>
          <input
            id="paperTitle"
            name="paperTitle"
            type="text"
            value={form.paperTitle}
            onChange={handleChange}
            placeholder="Title of your research paper"
            className={errors.paperTitle ? 'error' : ''}
          />
          {errors.paperTitle && <span className="error-text">{errors.paperTitle}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="abstract">Abstract *</label>
          <textarea
            id="abstract"
            name="abstract"
            value={form.abstract}
            onChange={handleChange}
            placeholder="Brief summary of your paper (max 500 words)"
            rows={6}
            className={errors.abstract ? 'error' : ''}
          />
          {errors.abstract && <span className="error-text">{errors.abstract}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="researchTheme">Research Theme *</label>
          <select
            id="researchTheme"
            name="researchTheme"
            value={form.researchTheme}
            onChange={handleChange}
            className={errors.researchTheme ? 'error' : ''}
          >
            <option value="">Select a theme</option>
            {THEMES.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
          {errors.researchTheme && <span className="error-text">{errors.researchTheme}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Paper'}
        </button>
        
        {submitError && <div className="error-message">{submitError}</div>}
      </form>
    </main>
  );
}
