import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useArena } from '../context/ArenaContext';

export default function MatchSchedule({ liveOnly = false }) {
  const { matches } = useArena();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(liveOnly ? 'Live' : 'All');
  const filtered = useMemo(() => matches.filter((match) => (
    (!liveOnly || match.status === 'Live')
    && (filter === 'All' || match.status === filter)
    && `${match.id} ${match.a} ${match.b} ${match.game}`.toLowerCase().includes(query.toLowerCase())
  )), [matches, query, filter, liveOnly]);

  return (
    <section>
      <div className="list-toolbar"><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search matches or teams" /></label>
        {!liveOnly && <select className="field-select filter-select" value={filter} onChange={(event) => setFilter(event.target.value)}>{['All', 'Live', 'Upcoming', 'Completed'].map((value) => <option key={value}>{value}</option>)}</select>}
      </div>
      <div className="match-list">
        {filtered.map((match) => <article className="match-card-react" key={match.id}>
          <div className="match-card-meta"><span>{match.id} · {match.game}</span><span className={`status-tag ${match.status === 'Live' ? 'is-live' : ''}`}>{match.status}</span></div>
          <div className="match-card-versus"><strong>{match.a}</strong><span>{match.status === 'Upcoming' ? 'VS' : `${match.scoreA} : ${match.scoreB}`}</span><strong>{match.b}</strong></div>
          <div className="match-card-meta"><span>{new Date(`${match.date}T00:00:00`).toLocaleDateString()} · {match.time}</span><span>{match.venue}</span></div>
        </article>)}
        {!filtered.length && <div className="empty-state">No matches found for this filter.</div>}
      </div>
    </section>
  );
}
