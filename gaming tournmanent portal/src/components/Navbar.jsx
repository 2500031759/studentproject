import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/tournaments', 'Tournaments'],
  ['/matches', 'Matches'],
  ['/leaderboard', 'Leaderboards'],
  ['/teams', 'Teams'],
  ['/players', 'Players'],
  ['/community', 'Community'],
  ['/announcements', 'News'],
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dashboardPath = user?.role === 'admin' ? '/admin' : user ? `/${user.role}` : '/login';

  return (
    <header className="nav app-nav">
      <div className="nav-inner">
        <Link className="brand" to="/">
          <span className="brand-mark"><span>AE</span></span>
          <span className="brand-word">ARENA <b>ELITE</b></span>
        </Link>
        <nav className={`navlinks ${open ? 'navlinks-open' : ''}`} aria-label="Main navigation">
          {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `navlink${isActive ? ' active' : ''}`}>{label}</NavLink>)}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <Link className="btn btn-secondary btn-sm nav-dashboard-link" to={dashboardPath}>Dashboard</Link>
              <Link className="avatar-btn" to="/profile" title="Profile">{user.name.slice(0, 2).toUpperCase()}</Link>
              <button className="nav-logout" type="button" onClick={() => { logout(); navigate('/login'); }}>Log out</button>
            </>
          ) : <Link className="btn btn-primary btn-sm" to="/login">Sign in</Link>}
          <button className="hamburger" type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
