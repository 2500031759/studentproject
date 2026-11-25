import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const notify = useToast();
  const [error, setError] = useState('');
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (name.trim().length < 2) return setError('Enter your full name.');
    if (password && password.length < 8) return setError('New password must be at least 8 characters long.');
    if (password !== confirm) return setError('Passwords do not match.');
    try {
      updateProfile({ name: name.trim(), ...(password ? { password } : {}) });
      setPassword('');
      setConfirm('');
      notify('Profile updated successfully.');
    } catch (reason) { setError(reason.message); }
  };

  return <main className="container page-wrap profile-page">
    <div className="page-heading-row"><div><span className="eyebrow-label">YOUR ARENA ID</span><h1>Profile settings</h1><p>Manage your account details and portal identity.</p></div></div>
    <div className="profile-layout"><aside className="panel profile-summary"><span className="profile-avatar">{user.name.slice(0, 2).toUpperCase()}</span><h2>{user.name}</h2><p>{user.email}</p><span className="role-pill">{user.role}</span></aside>
      {user.id === 'demo-admin' ? <section className="panel profile-form"><h2>Administrator profile</h2><p className="muted">This predefined demo administrator profile is read-only.</p></section> : <form className="panel data-form profile-form" onSubmit={submit}>
        <h2>Account details</h2><label>Full name<input className="field-input" value={name} onChange={(event) => setName(event.target.value)} required maxLength={70} /></label>
        <label>Email address<input className="field-input" value={user.email} disabled /></label>
        <label>New password <span className="muted">(leave blank to keep current)</span><input className="field-input" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} /></label>
        <label>Confirm new password<input className="field-input" type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit">Save changes</button>
      </form>}
    </div>
  </main>;
}
