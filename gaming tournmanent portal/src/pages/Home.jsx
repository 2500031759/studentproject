import { ArrowRight, Crosshair, Swords, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useArena } from '../context/ArenaContext';
import { useAuth } from '../context/AuthContext';
import Announcements from '../components/Announcements';
import TournamentList from '../components/TournamentList';

export default function Home() {
  const { tournaments, teams, matches } = useArena();
  const { user } = useAuth();
  return (
    <main>
      <section className="hero home-hero">
        <div className="hero-grid" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow-label">THE ARENA IS YOURS</span>
            <h1>Earn your place<br />among the <span className="gold-text">elite.</span></h1>
            <p className="lead">Discover premier tournaments, build a squad, and make every match count in India’s competitive esports arena.</p>
            <div className="hero-actions"><Link className="btn btn-primary" to="/tournaments">Explore tournaments <ArrowRight size={17} /></Link><Link className="btn btn-secondary" to={user ? `/${user.role}` : '/signup'}>{user ? 'Open dashboard' : 'Create your account'}</Link></div>
            <div className="hero-trust"><div><b>{tournaments.length}+</b><span>Featured tournaments</span></div><div><b>{teams.length}+</b><span>Competitive teams</span></div><div><b>{matches.filter((match) => match.status === 'Live').length}</b><span>Live matches</span></div></div>
          </div>
          <div className="hero-visual home-visual">
            <video autoPlay muted loop playsInline preload="metadata" poster="/assets/download.jpg" aria-label="Elite Arena tournament highlight">
              <source src="/assets/evelyn.3840x2160.mp4" type="video/mp4" />
            </video>
            <div className="video-caption"><span className="live-pulse" /> LIVE FROM THE ARENA</div>
          </div>
        </div>
      </section>
      <section className="container stats-strip app-stats"><div className="stats-row">
        <div className="stat-item"><div className="num">{tournaments.length}<span className="unit">+</span></div><div className="lbl">Active tournaments</div></div>
        <div className="stat-item"><div className="num">{teams.length}<span className="unit">+</span></div><div className="lbl">Registered teams</div></div>
        <div className="stat-item"><div className="num">{matches.length}<span className="unit">+</span></div><div className="lbl">Scheduled matches</div></div>
        <div className="stat-item"><div className="num">₹34<span className="unit">L</span></div><div className="lbl">Prize pool this season</div></div>
      </div></section>
      <section className="container section home-feature-section">
        <div className="section-head"><div><span className="eyebrow-label">COMPETE FOR GLORY</span><h2>Featured tournaments</h2><p>Find your next challenge and compete for the top spot.</p></div><Trophy className="section-icon" /></div>
        <TournamentList compact />
      </section>
      <section className="home-bottom-section"><div className="container home-lower-grid-react">
        <article className="home-info-panel"><div className="info-panel-heading"><Swords /><h2>Built for competitors</h2></div><p>From open qualifiers to championship finals, track your registrations and every result in one place.</p><Link className="text-button" to="/matches">View match schedule →</Link></article>
        <article className="home-info-panel"><div className="info-panel-heading"><Crosshair /><h2>Stay in the know</h2></div><Announcements compact /><Link className="text-button" to="/announcements">All announcements →</Link></article>
      </div></section>
    </main>
  );
}
