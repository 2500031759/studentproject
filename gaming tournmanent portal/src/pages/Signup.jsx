import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '', role: 'user' });

  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (values.name.trim().length < 2) return setError('Enter your full name.');
    if (values.password.length < 8) return setError('Password must be at least 8 characters long.');
    if (values.password !== values.confirm) return setError('Passwords do not match.');
    try {
      const user = register(values);
      navigate(`/${user.role}`, { replace: true });
    } catch (reason) { setError(reason.message); }
  };

  return (
    <main className="auth-page">
      <div className="auth-backdrop" />
      <div className="auth-card">
        <Link className="auth-home-link" to="/"><ArrowLeft size={15} /> BACK TO ARENA</Link>
        <Link className="auth-brand" to="/"><span className="auth-brand-name">ELITE ARENA</span><span className="auth-brand-sub">COMPETE · CONNECT · CONQUER</span></Link>
        <h1>Create your account</h1><p className="auth-subtitle">Join the community and find your next challenge.</p>
        <form className="auth-form" onSubmit={submit}>
          <label>Full name<input name="name" autoComplete="name" value={values.name} onChange={update} placeholder="Your full name" required maxLength={70} /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" value={values.email} onChange={update} placeholder="you@example.com" required /></label>
          <label>Password<input name="password" type="password" autoComplete="new-password" value={values.password} onChange={update} placeholder="At least 8 characters" minLength={8} required /></label>
          <label>Confirm password<input name="confirm" type="password" autoComplete="new-password" value={values.confirm} onChange={update} required /></label>
          <label>Account type<select name="role" value={values.role} onChange={update}><option value="user">Competitor</option><option value="organizer">Tournament organizer</option></select></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary btn-block auth-submit" type="submit">Create account</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        <p className="auth-disclaimer">Local Storage authentication is for academic demonstration only and is not production-grade security.</p>
      </div>
    </main>
  );
}
