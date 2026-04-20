import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registrationAPI } from '../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    institution: '',
    country: '',
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
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) newErrors.email = 'Please enter a valid email address';
    if (!form.institution.trim()) newErrors.institution = 'Institution is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError('');

    try {
      await registrationAPI.submitRegistration({
        name: form.fullName,
        email: form.email,
        institution: form.institution,
        country: form.country,
      });

      setForm({ fullName: '', email: '', institution: '', country: '' });
      setSubmitted(true);
    } catch (error) {
      setSubmitError('Registration failed. Please try again later.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="register-page page">
        <div className="success-message">
          <h2>Registration Successful!</h2>
          <p>Thank you for registering for the International Scientific Conference 2026.</p>
          <p>You will receive a confirmation email shortly.</p>
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="register-page page">
      <header className="page-header">
        <h1>Register for the Conference</h1>
        <p>Join researchers and professionals from around the world.</p>
      </header>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
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
          <label htmlFor="institution">Institution *</label>
          <input
            id="institution"
            name="institution"
            type="text"
            value={form.institution}
            onChange={handleChange}
            placeholder="University or organization"
            className={errors.institution ? 'error' : ''}
          />
          {errors.institution && <span className="error-text">{errors.institution}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country *</label>
          <input
            id="country"
            name="country"
            type="text"
            value={form.country}
            onChange={handleChange}
            placeholder="Your country"
            className={errors.country ? 'error' : ''}
          />
          {errors.country && <span className="error-text">{errors.country}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
          {loading ? 'Registering...' : 'Complete Registration'}
        </button>
        
        {submitError && <div className="error-message">{submitError}</div>}
      </form>
    </main>
  );
}
