import { CalendarDays, ClipboardCheck, Trophy } from 'lucide-react';
import { useArena } from '../context/ArenaContext';
import { useToast } from '../components/ToastProvider';

export default function OrganizerDashboard() {
  const { tournaments, matches, registrations, teams, createTournament, updateTournament, addMatch, updateMatch, setRegistrationStatus } = useArena();
  const notify = useToast();
  const create = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    createTournament({ ...data, prize: Number(data.prize), code: data.game.slice(0, 2).toUpperCase(), participants: 0, status: 'Registration Open' });
    event.currentTarget.reset();
    notify('Tournament published for registration.');
  };
  const schedule = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.a === data.b) return notify('Choose two different teams.', 'error');
    addMatch(data);
    event.currentTarget.reset();
    notify('Match scheduled.');
  };
  const updateScore = (event, match) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const scoreA = Number(data.get('scoreA'));
    const scoreB = Number(data.get('scoreB'));
    if (scoreA === scoreB) return notify('A completed match needs a winning score.', 'error');
    updateMatch(match.id, { scoreA, scoreB, status: 'Completed' });
    notify('Match result saved and leaderboard updated.');
  };
  return <main className="container page-wrap dashboard-page">
    <div className="page-heading-row"><div><span className="eyebrow-label">TOURNAMENT OPERATIONS</span><h1>Organizer dashboard</h1><p>Create competitions, approve registrations, and report official results.</p></div></div>
    <div className="dashboard-stat-grid"><article className="dashboard-stat"><Trophy /><span>My tournaments</span><strong>{tournaments.length}</strong></article><article className="dashboard-stat"><ClipboardCheck /><span>Pending registrations</span><strong>{registrations.filter((entry) => entry.status === 'Pending').length}</strong></article><article className="dashboard-stat"><CalendarDays /><span>Scheduled matches</span><strong>{matches.length}</strong></article></div>
    <section className="dashboard-section"><form className="panel data-form" onSubmit={create}><h2>Create a tournament</h2><div className="form-grid">
      <label>Tournament name<input className="field-input" name="name" required /></label><label>Game<select className="field-input" name="game"><option>Valorant</option><option>CS2</option><option>PUBG</option><option>Free Fire</option><option>FIFA</option></select></label>
      <label>Prize pool (₹)<input className="field-input" name="prize" type="number" min="0" required /></label><label>Start date<input className="field-input" name="start" type="date" required /></label>
      <label>Location<input className="field-input" name="location" defaultValue="Online" required /></label><label>Format<input className="field-input" name="format" defaultValue="Single Elimination" required /></label>
      <label className="form-span">Description<input className="field-input" name="description" required /></label>
    </div><button className="btn btn-primary" type="submit">Create tournament</button></form></section>
    <section className="dashboard-section"><div className="section-head"><div><h2>Tournament status</h2><p>Update event stages as the competition progresses.</p></div></div><div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>TOURNAMENT</th><th>DATE</th><th>REGISTRATIONS</th><th>STATUS</th></tr></thead><tbody>{tournaments.map((entry) => <tr key={entry.id}><td>{entry.name}</td><td>{entry.start}</td><td>{entry.participants}</td><td><select className="table-select" value={entry.status} onChange={(event) => { updateTournament(entry.id, { status: event.target.value }); notify('Tournament status updated.'); }}>{['Registration Open', 'Upcoming', 'Live', 'Completed', 'Paused'].map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></section>
    <section className="dashboard-section"><form className="panel data-form" onSubmit={schedule}><h2>Schedule a match</h2><div className="form-grid"><label>Team A<select className="field-input" name="a">{teams.map((team) => <option key={team.id}>{team.name}</option>)}</select></label><label>Team B<select className="field-input" name="b">{teams.map((team) => <option key={team.id}>{team.name}</option>)}</select></label><label>Game<input className="field-input" name="game" defaultValue="Valorant" required /></label><label>Date<input className="field-input" name="date" type="date" required /></label><label>Time<input className="field-input" name="time" type="time" required /></label><label>Venue<input className="field-input" name="venue" defaultValue="Online" required /></label></div><button className="btn btn-primary">Schedule match</button></form></section>
    <section className="dashboard-section"><div className="section-head"><div><h2>Registration approvals</h2><p>Approve qualified teams or decline incomplete entries.</p></div></div>{registrations.length ? <div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>TEAM / PLAYER</th><th>TOURNAMENT</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{registrations.map((entry) => <tr key={entry.id}><td>{entry.team}</td><td>{entry.tournament}</td><td>{entry.status}</td><td><button className="btn btn-success-line btn-xs" onClick={() => { setRegistrationStatus(entry.id, 'Approved'); notify('Registration approved.'); }}>Approve</button> <button className="btn btn-danger-line btn-xs" onClick={() => { setRegistrationStatus(entry.id, 'Rejected'); notify('Registration rejected.'); }}>Reject</button></td></tr>)}</tbody></table></div> : <div className="empty-state">No registrations yet.</div>}</section>
    <section className="dashboard-section"><div className="section-head"><div><h2>Report match results</h2><p>Verified results update team standings and leaderboard points.</p></div></div>{matches.filter((match) => match.status !== 'Completed').map((match) => <form className="inline-result-form" key={match.id} onSubmit={(event) => updateScore(event, match)}><span>{match.id} · {match.a} vs {match.b}</span><input aria-label={`${match.a} score`} name="scoreA" type="number" min="0" defaultValue={match.scoreA} required /><b>:</b><input aria-label={`${match.b} score`} name="scoreB" type="number" min="0" defaultValue={match.scoreB} required /><button className="btn btn-secondary btn-xs">Save result</button></form>)}</section>
  </main>;
}
