import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Auth({ signup = false }) {
  const { user, loading, authenticate } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  if (loading) return <main className="page-shell page-content">Checking your session…</main>;
  if (user) return <Navigate to="/manage" replace />;
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try { await authenticate(signup ? 'signup' : 'signin', values); navigate('/manage', { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="page-shell page-content auth-page"><div className="page-heading"><p className="eyebrow">Portfolio account</p><h1>{signup ? 'Sign up' : 'Sign in'}</h1><p>{signup ? 'Create an account to browse portfolio records.' : 'Welcome back. Sign in to your portfolio account.'}</p></div>
    <form className="contact-form" onSubmit={submit}>
      {signup && <label>Name<input required maxLength={100} autoComplete="name" value={values.name} onChange={e => setValues({ ...values, name: e.target.value })} /></label>}
      <label>Email<input required type="email" autoComplete="email" value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} /></label>
      <label>Password<input required type="password" minLength={8} maxLength={128} autoComplete={signup ? 'new-password' : 'current-password'} value={values.password} onChange={e => setValues({ ...values, password: e.target.value })} /></label>
      {signup && <p>Use at least 8 characters. New accounts receive the User role.</p>}
      <button className="button primary" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button>
      {error && <p role="alert" className="form-status error">{error}</p>}
      <Link to={signup ? '/signin' : '/signup'}>{signup ? 'Already registered? Sign in' : 'Need an account? Sign up'}</Link>
    </form></main>;
}
