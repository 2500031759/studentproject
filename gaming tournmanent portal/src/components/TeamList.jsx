import { useMemo, useState } from 'react';
import { Search, Shield, Users } from 'lucide-react';
import { useArena } from '../context/ArenaContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastProvider';

export default function TeamList() {
  const { teams, createTeam, requestTeamJoin } = useArena();
  const { user } = useAuth();
  const notify = useToast();
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const filtered = useMemo(() => teams.filter((team) => `${team.name} ${team.game} ${team.region}`.toLowerCase().includes(query.toLowerCase())), [teams, query]);

  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    createTeam({ name: form.get('name').trim(), tag: form.get('tag').trim().toUpperCase(), captain: user.name, game: form.get('game'), region: form.get('region') });
    event.currentTarget.reset();
    setShowForm(false);
    notify('Your team has been created.');
  };

  return (
    <main className="container page-wrap">
      <div className="page-heading-row"><div><span className="eyebrow-label">THE COMPETITIVE CIRCUIT</span><h1>Teams directory</h1><p>Meet the squads competing across the Arena Elite circuit.</p></div>
        {user && <button className="btn btn-primary" onClick={() => setShowForm((value) => !value)} type="button">{showForm ? 'Cancel' : 'Create a team'}</button>}
      </div>
      {showForm && <form className="panel data-form team-create-form" onSubmit={submit}>
        <label>Team name<input name="name" className="field-input" required maxLength="50" /></label>
        <label>Team tag<input name="tag" className="field-input" required maxLength="4" /></label>
        <label>Game<select className="field-input" name="game"><option>Valorant</option><option>CS2</option><option>PUBG</option><option>Free Fire</option><option>FIFA</option></select></label>
        <label>Region<input className="field-input" name="region" defaultValue="Open Region" required /></label>
        <button className="btn btn-primary" type="submit">Create team</button>
      </form>}
      <div className="list-toolbar"><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search teams, games, regions" /></label><span className="muted">{filtered.length} teams</span></div>
      <div className="teams-grid-react">
        {filtered.map((team) => <article className="team-card-react" key={team.id}>
          <div className="team-card-heading"><span className="team-logo-react">{team.tag}</span><div><h2>{team.name}</h2><span className="team-game-label">{team.game}</span></div><b className="team-rank">#{team.ranking}</b></div>
          <div className="team-card-stats"><span><Shield size={15} /> Captain: {team.captain}</span><span><Users size={15} /> {team.members} players</span><span>{team.wins} wins · {team.region}</span></div>
          <div className="team-card-bottom"><span className={`status-tag ${team.status === 'Active' ? 'is-open' : ''}`}>{team.status}</span><button className="text-button" type="button" onClick={() => { try { requestTeamJoin(team.id); notify(`Join request sent to ${team.name}.`); } catch (error) { notify(error.message, 'error'); } }}>Request to join</button></div>
        </article>)}
        {!filtered.length && <div className="empty-state">No teams match your search.</div>}
      </div>
    </main>
  );
}
