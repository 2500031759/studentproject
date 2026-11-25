import { useState } from 'react';
import { Activity, CalendarDays, Megaphone, Shield, Trophy, Users } from 'lucide-react';
import { useArena } from '../context/ArenaContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import MatchSchedule from '../components/MatchSchedule';

const panels = ['Overview', 'Players', 'Teams', 'Tournaments', 'Registrations', 'Matches', 'Leaderboard', 'Community', 'Reports', 'Announcements', 'Analytics'];

function TournamentForm({ onCreate }) {
  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onCreate({
      name: form.get('name').trim(), game: form.get('game'), prize: Number(form.get('prize')),
      start: form.get('start'), location: form.get('location'), format: form.get('format'),
      status: form.get('status'), description: form.get('description').trim(),
    });
    event.currentTarget.reset();
  };
  return <form className="panel data-form admin-create-form" onSubmit={submit}>
    <h3>Create tournament</h3>
    <div className="form-grid">
      <label>Tournament name<input className="field-input" name="name" required maxLength={70} /></label>
      <label>Game<select className="field-input" name="game"><option>Valorant</option><option>CS2</option><option>PUBG</option><option>Free Fire</option><option>FIFA</option><option>Mobile Legends</option></select></label>
      <label>Prize pool (₹)<input className="field-input" name="prize" type="number" min="0" required /></label>
      <label>Start date<input className="field-input" name="start" type="date" required /></label>
      <label>Location<input className="field-input" name="location" defaultValue="Online" required /></label>
      <label>Format<select className="field-input" name="format"><option>Single Elimination</option><option>Double Elimination</option><option>Round Robin</option><option>League Format</option></select></label>
      <label>Status<select className="field-input" name="status"><option>Registration Open</option><option>Upcoming</option><option>Live</option></select></label>
      <label className="form-span">Description<input className="field-input" name="description" required maxLength={180} /></label>
    </div>
    <button className="btn btn-primary" type="submit">Create tournament</button>
  </form>;
}

function MatchForm({ teams, onCreate }) {
  const submit = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.a === values.b) return;
    onCreate({ ...values, time: values.time, date: values.date, venue: values.venue });
    event.currentTarget.reset();
  };
  return <form className="panel data-form admin-create-form" onSubmit={submit}>
    <h3>Schedule match</h3><div className="form-grid">
      <label>Team A<select className="field-input" name="a" required>{teams.map((team) => <option key={team.id}>{team.name}</option>)}</select></label>
      <label>Team B<select className="field-input" name="b" required>{teams.map((team) => <option key={team.id}>{team.name}</option>)}</select></label>
      <label>Game<input className="field-input" name="game" defaultValue="Valorant" required /></label>
      <label>Date<input className="field-input" name="date" type="date" required /></label>
      <label>Time<input className="field-input" name="time" type="time" required /></label>
      <label>Venue<input className="field-input" name="venue" defaultValue="Online" required /></label>
    </div><button className="btn btn-primary" type="submit">Schedule match</button>
  </form>;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const {
    tournaments, teams, matches, registrations, announcements, leaderboard, users,
    createTournament, updateTournament, deleteTournament, updateTeam, deleteTeam,
    setRegistrationStatus, deleteRegistration, addMatch, updateMatch, publishAnnouncement, deleteAnnouncement,
    toggleUserStatus, deleteUser, recalculateLeaderboard, adjustLeaderboardPoints, teamRequests, setTeamRequestStatus,
    reports, resolveReport, community, setCommunityPostStatus, deleteCommunityPost,
  } = useArena();
  const notify = useToast();
  const [active, setActive] = useState('Overview');

  const createAnnouncement = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    publishAnnouncement({ title: form.get('title').trim(), body: form.get('body').trim() });
    event.currentTarget.reset();
    notify('Announcement published.');
  };

  const resultForm = (match) => {
    const submit = (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const scoreA = Number(form.get('scoreA'));
      const scoreB = Number(form.get('scoreB'));
      if (scoreA === scoreB) return notify('A completed match needs a winning score.', 'error');
      updateMatch(match.id, { scoreA, scoreB, status: 'Completed' });
      notify(`${match.id} result saved and leaderboard updated.`);
    };
    return <form className="inline-result-form" onSubmit={submit} key={match.id}>
      <span>{match.a} vs {match.b}</span>
      <input aria-label={`${match.a} score`} name="scoreA" type="number" min="0" defaultValue={match.scoreA} required />
      <b>:</b>
      <input aria-label={`${match.b} score`} name="scoreB" type="number" min="0" defaultValue={match.scoreB} required />
      <button className="btn btn-secondary btn-xs" type="submit">Save result</button>
    </form>;
  };

  return <main className="container page-wrap admin-page">
    <div className="page-heading-row"><div><span className="eyebrow-label">ARENA ELITE · ADMINISTRATION</span><h1>Control center</h1><p>Manage the competitive ecosystem, registrations, and match operations.</p></div><div className="admin-identity"><span className="role-pill">Administrator</span><strong>{user.name}</strong></div></div>
    <nav className="admin-tabs" aria-label="Admin modules">{panels.map((panel) => <button key={panel} className={active === panel ? 'active' : ''} type="button" onClick={() => setActive(panel)}>{panel}</button>)}</nav>
    {active === 'Overview' && <section>
      <div className="dashboard-stat-grid">
        <article className="dashboard-stat"><Trophy /><span>Tournaments</span><strong>{tournaments.length}</strong></article>
        <article className="dashboard-stat"><Users /><span>Registered users</span><strong>{users.length}</strong></article>
        <article className="dashboard-stat"><CalendarDays /><span>Scheduled matches</span><strong>{matches.length}</strong></article>
        <article className="dashboard-stat"><Activity /><span>Pending registrations</span><strong>{registrations.filter((entry) => entry.status === 'Pending').length}</strong></article>
      </div>
      <div className="admin-overview-grid">
        <article className="panel"><h2>Quick actions</h2><div className="quick-actions"><button onClick={() => setActive('Tournaments')}><Trophy />Create tournament</button><button onClick={() => setActive('Matches')}><CalendarDays />Schedule match</button><button onClick={() => setActive('Registrations')}><Users />Review registrations</button><button onClick={() => setActive('Announcements')}><Megaphone />Publish announcement</button></div></article>
        <article className="panel"><h2>Operations snapshot</h2><p className="report-line"><span>Active teams</span><strong>{teams.filter((team) => team.status === 'Active').length}</strong></p><p className="report-line"><span>Live matches</span><strong>{matches.filter((match) => match.status === 'Live').length}</strong></p><p className="report-line"><span>Published announcements</span><strong>{announcements.length}</strong></p><p className="report-line"><span>Leaderboard entries</span><strong>{leaderboard.length}</strong></p></article>
      </div>
    </section>}
    {active === 'Players' && <section className="admin-module"><div className="section-head"><div><h2>Player management</h2><p>Review registered accounts and suspend or restore access.</p></div></div>
      {!users.length ? <div className="empty-state">No player accounts registered yet.</div> : <div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>NAME</th><th>EMAIL</th><th>ROLE</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{users.map((entry) => <tr key={entry.id}><td>{entry.name}</td><td>{entry.email}</td><td>{entry.role}</td><td>{entry.status}</td><td><button className="btn btn-secondary btn-xs" onClick={() => { toggleUserStatus(entry.id); notify('User status updated.'); }}>{entry.status === 'Suspended' ? 'Reactivate' : 'Suspend'}</button> <button className="btn btn-danger-line btn-xs" onClick={() => { if (window.confirm(`Permanently remove ${entry.name} and their account?`)) { deleteUser(entry.id); notify('User account removed.'); } }}>Delete</button></td></tr>)}</tbody></table></div>}
    </section>}
    {active === 'Tournaments' && <section className="admin-module">
      <TournamentForm onCreate={(fields) => { createTournament(fields); notify('Tournament created.'); }} />
      <div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>TOURNAMENT</th><th>STATUS</th><th>START DATE</th><th>UPDATE</th><th></th></tr></thead><tbody>{tournaments.map((entry) => <tr key={entry.id}><td>{entry.name}<small>{entry.game}</small></td><td>{entry.status}</td><td>{entry.start}</td><td><select className="table-select" aria-label={`Update status for ${entry.name}`} value={entry.status} onChange={(event) => { updateTournament(entry.id, { status: event.target.value }); notify('Tournament updated.'); }}>{['Registration Open', 'Upcoming', 'Live', 'Completed', 'Paused'].map((status) => <option key={status}>{status}</option>)}</select></td><td><button className="btn btn-danger-line btn-xs" onClick={() => { if (window.confirm(`Delete ${entry.name}?`)) { deleteTournament(entry.id); notify('Tournament removed.'); } }}>Delete</button></td></tr>)}</tbody></table></div>
    </section>}
    {active === 'Teams' && <section className="admin-module"><div className="section-head"><div><h2>Team management</h2><p>Monitor competitive teams and account standing.</p></div></div><div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>TEAM</th><th>GAME</th><th>CAPTAIN</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{teams.map((team) => <tr key={team.id}><td>{team.name}</td><td>{team.game}</td><td>{team.captain}</td><td>{team.status}</td><td><button className="btn btn-secondary btn-xs" onClick={() => { updateTeam(team.id, { status: team.status === 'Active' ? 'Suspended' : 'Active' }); notify('Team status updated.'); }}>{team.status === 'Active' ? 'Suspend' : 'Restore'}</button> <button className="btn btn-danger-line btn-xs" onClick={() => { if (window.confirm(`Delete ${team.name}?`)) { deleteTeam(team.id); notify('Team deleted.'); } }}>Delete</button></td></tr>)}</tbody></table></div>
      <div className="section-head"><div><h2>Team join requests</h2></div></div>{teamRequests.length ? <div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>PLAYER</th><th>TEAM</th><th>DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{teamRequests.map((request) => <tr key={request.id}><td>{request.name}<small>{request.email}</small></td><td>{request.team}</td><td>{request.date}</td><td>{request.status}</td><td>{request.status === 'Pending' && <><button className="btn btn-success-line btn-xs" onClick={() => { setTeamRequestStatus(request.id, 'Approved'); notify('Team request approved.'); }}>Approve</button> <button className="btn btn-danger-line btn-xs" onClick={() => { setTeamRequestStatus(request.id, 'Rejected'); notify('Team request declined.'); }}>Decline</button></>}</td></tr>)}</tbody></table></div> : <div className="empty-state">No team join requests.</div>}</section>}
    {active === 'Registrations' && <section className="admin-module"><div className="section-head"><div><h2>Player registrations</h2><p>Approve, reject, or remove tournament entry requests.</p></div></div>{registrations.length ? <div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>TEAM / PLAYER</th><th>TOURNAMENT</th><th>CAPTAIN</th><th>DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{registrations.map((entry) => <tr key={entry.id}><td>{entry.team}</td><td>{entry.tournament}</td><td>{entry.captain}</td><td>{entry.submitted}</td><td>{entry.status}</td><td><button className="btn btn-success-line btn-xs" onClick={() => { setRegistrationStatus(entry.id, 'Approved'); notify('Registration approved.'); }}>Approve</button> <button className="btn btn-danger-line btn-xs" onClick={() => { setRegistrationStatus(entry.id, 'Rejected'); notify('Registration rejected.'); }}>Reject</button> <button className="btn btn-secondary btn-xs" onClick={() => { if (window.confirm(`Remove registration ${entry.id}?`)) { deleteRegistration(entry.id); notify('Registration removed.'); } }}>Remove</button></td></tr>)}</tbody></table></div> : <div className="empty-state">There are no registrations to review.</div>}</section>}
    {active === 'Matches' && <section className="admin-module"><MatchForm teams={teams} onCreate={(fields) => { if (fields.a === fields.b) return notify('Choose two different teams.', 'error'); addMatch(fields); notify('Match scheduled.'); }} />
      <div className="section-head"><div><h2>Match results</h2><p>Report a score to update the standings automatically.</p></div></div>{matches.filter((match) => match.status !== 'Completed').map(resultForm)}<div className="dashboard-section"><MatchSchedule /></div>
    </section>}
    {active === 'Leaderboard' && <section className="admin-module"><div className="page-heading-row"><div><h2>Leaderboard management</h2><p>Adjust team points or recalculate current standings.</p></div><button className="btn btn-secondary" onClick={() => { recalculateLeaderboard(); notify('Leaderboard recalculated.'); }}>Recalculate rankings</button></div><div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>RANK</th><th>TEAM</th><th>GAME</th><th>WINS</th><th>POINTS</th><th>ADJUST POINTS</th></tr></thead><tbody>{[...leaderboard].sort((a, b) => b.points - a.points).map((entry, index) => <tr key={entry.team}><td>#{index + 1}</td><td>{entry.team}</td><td>{entry.game}</td><td>{entry.wins}</td><td>{entry.points}</td><td><form className="points-form" onSubmit={(event) => { event.preventDefault(); const points = Number(new FormData(event.currentTarget).get('points')); adjustLeaderboardPoints(entry.team, points); notify('Leaderboard points updated.'); }}><input aria-label={`Points for ${entry.team}`} name="points" type="number" min="0" defaultValue={entry.points} /><button className="btn btn-secondary btn-xs">Save</button></form></td></tr>)}</tbody></table></div></section>}
    {active === 'Community' && <section className="admin-module"><div className="section-head"><div><h2>Community moderation</h2><p>Hide, restore, or remove public posts.</p></div></div>{community.length ? community.map((post) => <article className="panel admin-announcement" key={post.id}><div><strong>{post.author} · {post.tag}</strong><p>{post.body}</p><small>{post.status}</small></div><div className="table-actions">{post.status === 'Hidden' ? <button className="btn btn-success-line btn-xs" onClick={() => { setCommunityPostStatus(post.id, 'Approved'); notify('Post restored.'); }}>Restore</button> : <button className="btn btn-secondary btn-xs" onClick={() => { setCommunityPostStatus(post.id, 'Hidden'); notify('Post hidden.'); }}>Hide</button>}<button className="btn btn-danger-line btn-xs" onClick={() => { deleteCommunityPost(post.id); notify('Post deleted.'); }}>Delete</button></div></article>) : <div className="empty-state">There are no posts to moderate.</div>}</section>}
    {active === 'Reports' && <section className="admin-module"><div className="section-head"><div><h2>Reports & safety</h2><p>Review submitted competition and community incident reports.</p></div></div><div className="simple-table-wrap"><table className="admin-table"><thead><tr><th>REPORT</th><th>REPORTER</th><th>TARGET</th><th>CATEGORY</th><th>DETAILS</th><th>PRIORITY</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td>{report.id}</td><td>{report.reporter}</td><td>{report.target}</td><td>{report.category}</td><td>{report.description}</td><td>{report.priority}</td><td>{report.status}</td><td>{report.status !== 'Resolved' && <button className="btn btn-success-line btn-xs" onClick={() => { resolveReport(report.id); notify('Report marked resolved.'); }}>Resolve</button>}</td></tr>)}</tbody></table></div></section>}
    {active === 'Announcements' && <section className="admin-module"><form className="panel data-form" onSubmit={createAnnouncement}><h2><Megaphone size={20} /> Publish announcement</h2><label>Headline<input className="field-input" name="title" required maxLength={100} /></label><label>Message<textarea className="field-input" name="body" rows="4" required maxLength={600} /></label><button className="btn btn-primary" type="submit">Publish update</button></form><div className="admin-announcement-list">{announcements.map((entry) => <article className="panel admin-announcement" key={entry.id}><div><strong>{entry.title}</strong><p>{entry.body}</p><small>{entry.date} · {entry.author}</small></div><button className="btn btn-danger-line btn-xs" onClick={() => { deleteAnnouncement(entry.id); notify('Announcement deleted.'); }}>Delete</button></article>)}</div></section>}
    {active === 'Analytics' && <section className="admin-module"><div className="section-head"><div><h2>Reports & analytics</h2><p>Current portal operations at a glance.</p></div></div><div className="dashboard-stat-grid"><article className="dashboard-stat"><Users /><span>Users</span><strong>{users.length}</strong></article><article className="dashboard-stat"><Trophy /><span>Tournament slots filled</span><strong>{tournaments.reduce((sum, item) => sum + item.participants, 0)}</strong></article><article className="dashboard-stat"><Activity /><span>Pending approvals</span><strong>{registrations.filter((entry) => entry.status === 'Pending').length}</strong></article><article className="dashboard-stat"><Shield /><span>Team wins</span><strong>{teams.reduce((sum, item) => sum + item.wins, 0)}</strong></article></div><div className="panel report-summary"><h3>Competition summary</h3><p>{tournaments.filter((item) => item.status === 'Live').length} tournaments live · {matches.filter((item) => item.status === 'Completed').length} matches completed · {announcements.length} announcements currently published.</p></div></section>}
  </main>;
}
