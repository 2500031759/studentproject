import { CalendarDays, ShieldCheck, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useArena } from '../context/ArenaContext';
import { useAuth } from '../context/AuthContext';
import MatchSchedule from '../components/MatchSchedule';

export default function UserDashboard() {
  const { user } = useAuth();
  const { tournaments, registrations, teams } = useArena();
  const myRegistrations = registrations.filter((entry) => entry.email === user.email);
  return <main className="container page-wrap dashboard-page">
    <div className="page-heading-row"><div><span className="eyebrow-label">COMPETITOR CONTROL ROOM</span><h1>Welcome, {user.name.split(' ')[0]}</h1><p>Your tournament activity, match schedule, and arena updates.</p></div><Link className="btn btn-primary" to="/tournaments">Find a tournament</Link></div>
    <div className="dashboard-stat-grid">
      <article className="dashboard-stat"><Trophy /><span>My registrations</span><strong>{myRegistrations.length}</strong></article>
      <article className="dashboard-stat"><CalendarDays /><span>Upcoming events</span><strong>{tournaments.filter((entry) => ['Registration Open', 'Upcoming'].includes(entry.status)).length}</strong></article>
      <article className="dashboard-stat"><Users /><span>Active teams</span><strong>{teams.length}</strong></article>
      <article className="dashboard-stat"><ShieldCheck /><span>Account status</span><strong>Active</strong></article>
    </div>
    <section className="dashboard-section"><div className="section-head"><div><h2>My registrations</h2><p>Review your submitted tournament registrations.</p></div></div>
      {myRegistrations.length ? <div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>TOURNAMENT</th><th>CAPTAIN</th><th>SUBMITTED</th><th>STATUS</th></tr></thead><tbody>{myRegistrations.map((entry) => <tr key={entry.id}><td>{entry.tournament}</td><td>{entry.captain}</td><td>{entry.submitted}</td><td><span className="status-tag">{entry.status}</span></td></tr>)}</tbody></table></div> : <div className="empty-state">You haven’t entered a tournament yet. <Link to="/tournaments">Browse open registrations</Link></div>}
    </section>
    <section className="dashboard-section"><div className="section-head"><div><h2>Match center</h2><p>See live scores and your next fixtures.</p></div></div><MatchSchedule /></section>
  </main>;
}
