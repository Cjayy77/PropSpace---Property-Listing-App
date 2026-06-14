import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    else if (form.username.trim().length < 3) e.username = 'Username must be at least 3 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setServerError('');
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join PropSpace and start listing or browsing today</p>
        <div className="auth-divider" />
        {serverError && <p className="error-banner" role="alert">{serverError}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <InputField label="Username" id="username" name="username" type="text"
            value={form.username} onChange={handleChange} error={errors.username}
            autoComplete="username" placeholder="e.g. johndoe" />
          <InputField label="Email address" id="email" name="email" type="email"
            value={form.email} onChange={handleChange} error={errors.email}
            autoComplete="email" placeholder="you@example.com" />
          <InputField label="Password" id="password" name="password" type="password"
            value={form.password} onChange={handleChange} error={errors.password}
            autoComplete="new-password" placeholder="Min. 6 characters" />
          <button type="submit" className="btn-primary btn-block" disabled={loading}
            style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
