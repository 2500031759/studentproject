import { Link, useParams } from 'react-router-dom';
import { useArena } from '../context/ArenaContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastProvider';

export default function TournamentDetails() {
  const { id } = useParams();
  const { tournaments, registerForTournament, registrations } = useArena();
  const { user } = useAuth();
  const notify = useToast();
  const tournament = tournaments.find((entry) => entry.id === id);

  if (!tournament) return <main className="container page-wrap"><div className="empty-state">Tournament not found. <Link to="/tournaments">Browse tournaments</Link></div></main>;
  const joined = user && registrations.some((entry) => entry.tournamentId === id && entry.email === user.email);
  const join = () => {
    if (!user) return notify('Sign in to register for tournaments.', 'error');
    try { registerForTournament(id); notify('Registration submitted for organizer approval.'); }
    catch (error) { notify(error.message, 'error'); }
  };

  return (
    <main className="container page-wrap">
      <Link to="/tournaments" className="back-link">← All tournaments</Link>
      <article className="detail-hero panel">
        <div className="detail-code">{tournament.code}</div>
        <div className="detail-copy">
          <span className="eyebrow-label">{tournament.game} · {tournament.status}</span>
          <h1>{tournament.name}</h1>
          <p>{tournament.description}</p>
          <div className="detail-facts"><span>Prize pool <b>₹{Number(tournament.prize).toLocaleString('en-IN')}</b></span><span>Starts <b>{new Date(`${tournament.start}T00:00:00`).toLocaleDateString()}</b></span><span>Format <b>{tournament.format}</b></span></div>
          <button type="button" className="btn btn-primary" onClick={join} disabled={joined || tournament.status !== 'Registration Open'}>
            {joined ? 'Registration submitted' : tournament.status !== 'Registration Open' ? 'Registration closed' : 'Join tournament'}
          </button>
        </div>
      </article>
    </main>
  );
}
