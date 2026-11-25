import { useArena } from '../context/ArenaContext';

export default function Announcements({ compact = false }) {
  const { announcements } = useArena();
  const items = compact ? announcements.slice(0, 3) : announcements;
  return <section className="announcement-list">
    {items.map((item) => <article className="announcement-card" key={item.id}><span className="announcement-icon">AE</span><div><div className="announcement-meta">{item.author} · {new Date(`${item.date}T00:00:00`).toLocaleDateString()}</div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}
    {!items.length && <div className="empty-state">No announcements have been published yet.</div>}
  </section>;
}
