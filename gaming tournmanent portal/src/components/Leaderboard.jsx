import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useArena } from '../context/ArenaContext';

export default function Leaderboard() {
  const { leaderboard } = useArena();
  const [query, setQuery] = useState('');
  const rows = useMemo(() => leaderboard.filter((entry) => `${entry.team} ${entry.game}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.points - a.points), [leaderboard, query]);

  return (
    <main className="container page-wrap">
      <div className="page-heading-row"><div><span className="eyebrow-label">SEASON 7 · GLOBAL RANKINGS</span><h1>Leaderboard</h1><p>Rankings update as official match results are verified.</p></div></div>
      <label className="search-field leaderboard-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a team or game" /></label>
      <div className="lb-table-wrap"><table className="lb-table"><thead><tr><th>RANK</th><th>TEAM</th><th>GAME</th><th>MATCHES</th><th>WINS</th><th>POINTS</th></tr></thead>
        <tbody>{rows.map((entry, index) => <tr key={entry.team}><td><span className={`rank-medal rank-${index + 1}`}>{index + 1}</span></td><td className="leaderboard-team-name">{entry.team}</td><td>{entry.game}</td><td>{entry.matches}</td><td>{entry.wins}</td><td className="leaderboard-points">{entry.points.toLocaleString()}</td></tr>)}</tbody>
      </table></div>
      {!rows.length && <div className="empty-state">No teams found.</div>}
    </main>
  );
}
