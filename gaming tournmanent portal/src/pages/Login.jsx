import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Swords, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_ADMIN } from '../services/authService';

const loginRoles = [
  { id: 'user', label: 'User', description: 'Compete', Icon: UserRound },
  { id: 'admin', label: 'Admin', description: 'Manage', Icon: ShieldCheck },
  { id: 'organizer', label: 'Organizer', description: 'Host', Icon: Swords },
];

function dashboardPath(role) {
  return role === 'admin' ? '/admin' : `/${role}`;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedRole = searchParams.get('role');
  const initialRole = loginRoles.some((role) => role.id === requestedRole) ? requestedRole : 'user';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setError('');
    try {
      const user = login(email, password, selectedRole);
      navigate(location.state?.from?.pathname ?? dashboardPath(user.role), { replace: true });
    } catch (reason) { setError(reason.message); }
  };

  return (
    <main className="auth-page">
      <div className="auth-backdrop" />
      <div className="auth-card">
        <Link className="auth-home-link" to="/"><ArrowLeft size={15} /> BACK TO ARENA</Link>
        <Link className="auth-brand" to="/"><span className="auth-brand-name">ELITE ARENA</span><span className="auth-brand-sub">COMPETE · CONNECT · CONQUER</span></Link>
        <h1>Welcome back</h1><p className="auth-subtitle">Choose your portal to continue.</p>
        <div className="login-role-grid" role="group" aria-label="Choose sign-in role">
          {loginRoles.map(({ id, label, description, Icon }) => (
            <button
              className={`login-role-option${selectedRole === id ? ' selected' : ''}`}
              type="button"
              key={id}
              aria-pressed={selectedRole === id}
              onClick={() => {
                setSelectedRole(id);
                setError('');
                setSearchParams(id === 'user' ? {} : { role: id }, { replace: true });
              }}
            >
              <Icon size={17} />
              <span>{label}<small>{description}</small></span>
            </button>
          ))}
        </div>
        <form className="auth-form" onSubmit={submit}>
          <label>{selectedRole === 'admin' ? 'Administrator email' : `${loginRoles.find((role) => role.id === selectedRole)?.label} email`}<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={selectedRole === 'admin' ? DEMO_ADMIN.email : 'you@example.com'} required /></label>
          <label>Password<span className="password-input"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary btn-block auth-submit" type="submit">Sign in as {selectedRole === 'user' ? 'User' : loginRoles.find((role) => role.id === selectedRole)?.label}</button>
        </form>
        <div className="auth-divider"><span>NEW TO THE ARENA?</span></div>
        <Link to="/signup" className="btn btn-secondary btn-block">Create an account</Link>
        {selectedRole === 'admin' && <div className="demo-credentials"><div><ShieldCheck size={18} /><strong>Admin demo access</strong></div><code>{DEMO_ADMIN.email}</code><code>{DEMO_ADMIN.password}</code><button type="button" onClick={() => { setEmail(DEMO_ADMIN.email); setPassword(DEMO_ADMIN.password); }}>Fill demo credentials</button></div>}
        <p className="auth-disclaimer">Demo authentication uses browser Local Storage and is for academic demonstration only. It is not production-grade security.</p>
      </div>
    </main>
  );
}
