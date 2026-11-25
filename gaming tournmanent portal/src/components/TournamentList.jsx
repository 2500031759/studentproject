import { useMemo, useState } from 'react';
import { CalendarDays, MapPin, Search, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useArena } from '../context/ArenaContext';

export default function TournamentList({ compact = false }) {
  const { tournaments } = useArena();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const filtered = useMemo(() => tournaments.filter((entry) => (
    (status === 'All' || entry.status === status)
    && `${entry.name} ${entry.game}`.toLowerCase().includes(query.toLowerCase())
  )), [tournaments, query, status]);

  return (
    <section>
      {!compact && (
        <div className="list-toolbar">
          <label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tournaments or games" /></label>
          <select className="field-select filter-select" value={status} onChange={(event) => setStatus(event.target.value)}>
            {['All', 'Live', 'Registration Open', 'Upcoming', 'Completed'].map((value) => <option key={value}>{value}</option>)}
          </select>
        </div>
      )}
      <div className="grid-cards app-tournament-grid">
        {(compact ? filtered.slice(0, 3) : filtered).map((tournament) => (
          <article className="t-card app-tournament-card" key={tournament.id}>
            <div className="t-card-top">
              <div className="t-emblem-row"><span className="t-emblem">{tournament.code}</span><div><div className="t-game">{tournament.game}</div><h3>{tournament.name}</h3></div></div>
              <span className={`status-tag ${tournament.status === 'Live' ? 'is-live' : tournament.status === 'Registration Open' ? 'is-open' : ''}`}>{tournament.status}</span>
            </div>
            <p className="card-description">{tournament.description}</p>
            <div className="t-meta">
              <span className="t-meta-item"><Trophy size={15} /> ₹{Number(tournament.prize).toLocaleString('en-IN')}</span>
              <span className="t-meta-item"><Users size={15} /> {tournament.participants} slots</span>
              <span className="t-meta-item"><CalendarDays size={15} /> {new Date(`${tournament.start}T00:00:00`).toLocaleDateString()}</span>
              <span className="t-meta-item"><MapPin size={15} /> {tournament.location}</span>
            </div>
            <div className="t-card-foot"><span className="t-game">{tournament.format}</span><Link className="btn btn-secondary btn-sm" to={`/tournaments/${tournament.id}`}>View details</Link></div>
          </article>
        ))}
        {!filtered.length && <div className="empty-state">No tournaments match your search.</div>}
      </div>
      {compact && <Link className="section-more" to="/tournaments">Explore all tournaments →</Link>}
    </section>
  );
}
