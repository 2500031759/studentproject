import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useArena } from '../context/ArenaContext';

export default function Players() {
  const { players, users } = useArena();
  const [query, setQuery] = useState('');
  const directory = [...players, ...users.map((user) => ({
    id: user.id, name: user.name, username: user.name, team: 'Independent', game: user.role, matches: 0, wins: 0, status: user.status,
  }))];
  const results = useMemo(() => directory.filter((player) => `${player.name} ${player.username} ${player.team} ${player.game}`.toLowerCase().includes(query.toLowerCase())), [players, users, query]);
  return <main className="container page-wrap">
    <div className="page-heading-row"><div><span className="eyebrow-label">COMPETITIVE DIRECTORY</span><h1>Players</h1><p>Meet the competitors representing teams across the arena.</p></div></div>
    <label className="search-field leaderboard-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search players, teams, games" /></label>
    <div className="player-grid">{results.map((player) => <article className="panel player-card" key={player.id}><span className="player-avatar">{player.username.slice(0, 2).toUpperCase()}</span><div className="player-card-info"><h2>{player.name}</h2><span className="team-game-label">@{player.username}</span><p>{player.team} · {player.game}</p><small>{player.matches} matches · {player.wins} wins · K/D {player.kda ?? '—'}</small></div><span className="status-tag">{player.status}</span></article>)}</div>
    {!results.length && <div className="empty-state">No players match your search.</div>}
  </main>;
}
