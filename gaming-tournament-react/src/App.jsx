import { useEffect, useRef, useState } from 'react'
import { initialLeaderboard } from './data'
import {
  clearSession,
  initializeData,
  makeUser,
  readSession,
  saveData,
  saveSession,
  verifyPassword,
} from './storage'
import './App.css'

const adminSections = [
  ['dashboard', 'Overview'],
  ['tournaments', 'Tournaments'],
  ['registrations', 'Registrations'],
  ['players', 'Players'],
  ['announcements', 'Announcements'],
]

const userSections = [
  ['dashboard', 'My dashboard'],
  ['tournaments', 'Tournaments'],
  ['leaderboard', 'Leaderboard'],
]

function money(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function dateLabel(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function Status({ children }) {
  return <span className={`status status-${children.toLowerCase()}`}>{children}</span>
}

function TournamentCards({ tournaments, registrations, isAdmin, onApply }) {
  return (
    <div className="tournament-grid">
      {tournaments.map((tournament, index) => {
        const registration = registrations.find(
          (item) => item.tournamentId === tournament.id && item.status !== 'Rejected',
        )
        return (
          <article className="tournament-card" key={tournament.id}>
            <div className={`game-art game-art-${index % 3}`}>
              <span className="art-code">{tournament.game.slice(0, 2).toUpperCase()}</span>
              <span className="art-label">ARENA SERIES / 0{index + 1}</span>
            </div>
            <div className="tournament-body">
              <div className="row-between"><span className="eyebrow">{tournament.game}</span><Status>{tournament.status}</Status></div>
              <h3>{tournament.name}</h3>
              <p className="muted">{tournament.format} · {dateLabel(tournament.date)}</p>
              <div className="tournament-meta">
                <div><span className="meta-label">Prize pool</span><strong>{money(tournament.prize)}</strong></div>
                <div><span className="meta-label">Team slots</span><strong>{tournament.teams}</strong></div>
              </div>
              {!isAdmin && (
                <button
                  className={registration ? 'button button-muted full-width' : 'button button-primary full-width'}
                  disabled={Boolean(registration) || tournament.status === 'Finished'}
                  onClick={() => onApply(tournament)}
                >
                  {registration ? `Registered · ${registration.status}` : tournament.status === 'Finished' ? 'Event completed' : 'Register your team'}
                </button>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function App() {
  const [data, setData] = useState(null)
  const dataRef = useRef(null)
  const [activeUser, setActiveUser] = useState(null)
  const [screen, setScreen] = useState('home')
  const [adminPanel, setAdminPanel] = useState('dashboard')
  const [userPanel, setUserPanel] = useState('dashboard')
  const [authMode, setAuthMode] = useState('login')
  const [notice, setNotice] = useState('')
  const [authError, setAuthError] = useState('')
  const [fatalError, setFatalError] = useState('')
  const [busy, setBusy] = useState(false)
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  useEffect(() => {
    let active = true
    initializeData()
      .then((loaded) => {
        if (!active) return
        dataRef.current = loaded
        setData(loaded)
        const sessionId = readSession()
        const user = loaded.users.find((item) => item.id === sessionId)
        if (user) {
          setActiveUser(user)
          setScreen(user.role === 'admin' ? 'admin' : 'user')
        } else if (sessionId) {
          clearSession()
        }
      })
      .catch((error) => {
        if (active) setFatalError(error.message || 'The app could not load saved data.')
      })
    return () => {
      active = false
    }
  }, [])

  function commit(change) {
    try {
      const next = change(dataRef.current)
      saveData(next)
      dataRef.current = next
      setData(next)
      return true
    } catch (error) {
      setNotice(error.message || 'Could not save your changes. Check browser storage and try again.')
      return false
    }
  }

  function enterApp(user) {
    saveSession(user.id)
    setActiveUser(user)
    setScreen(user.role === 'admin' ? 'admin' : 'user')
    setNotice(`Welcome${user.name ? `, ${user.name.split(' ')[0]}` : ''}!`)
    setAuthError('')
  }

  async function handleAuth(event) {
    event.preventDefault()
    setAuthError('')
    setBusy(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '').trim().toLowerCase()
    const password = String(form.get('password') || '')

    try {
      if (authMode === 'signup') {
        const name = String(form.get('name') || '').trim()
        if (name.length < 2) {
          setAuthError('Enter your name (at least 2 characters).')
          return
        }
        if (password.length < 8) {
          setAuthError('Use a password with at least 8 characters.')
          return
        }
        if (dataRef.current.users.some((user) => user.email === email)) {
          setAuthError('An account with that email already exists. Try logging in.')
          return
        }
        const user = await makeUser({ name, email, password })
        if (!commit((current) => ({ ...current, users: [...current.users, user] }))) return
        enterApp(user)
      } else {
        const user = dataRef.current.users.find((item) => item.email === email)
        if (!user || !(await verifyPassword(user, password))) {
          setAuthError('Email or password is incorrect.')
          return
        }
        enterApp(user)
      }
    } catch (error) {
      setAuthError(error.message || 'Authentication failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  function logout() {
    try {
      clearSession()
      setActiveUser(null)
      setScreen('home')
      setNotice('You have been signed out.')
    } catch (error) {
      setNotice(error.message || 'Could not clear the saved session.')
    }
  }

  function openAuth(mode) {
    setAuthMode(mode)
    setAuthError('')
    setScreen('home')
    requestAnimationFrame(() => {
      document.getElementById('account')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  function navigate(section) {
    setNotice('')
    if (activeUser?.role === 'admin') {
      setAdminPanel(section)
      setScreen('admin')
    } else if (activeUser) {
      setScreen('user')
      setUserPanel(section)
    } else if (section === 'tournaments' || section === 'leaderboard') {
      setScreen('home')
      setAuthMode('login')
    } else {
      setScreen('home')
    }
  }

  function applyToTournament(tournament) {
    if (!activeUser) {
      openAuth('login')
      setNotice('Log in or create a player account to register.')
      return
    }
    if (activeUser.role === 'admin') {
      setNotice('Player registration is available from a player account.')
      return
    }
    const existing = data.registrations.some(
      (registration) =>
        registration.userId === activeUser.id &&
        registration.tournamentId === tournament.id &&
        registration.status !== 'Rejected',
    )
    if (existing) {
      setNotice('You already have a pending or approved registration for this event.')
      return
    }
    const registration = {
      id: crypto.randomUUID(),
      userId: activeUser.id,
      player: activeUser.name,
      email: activeUser.email,
      tournamentId: tournament.id,
      tournament: tournament.name,
      date: today,
      status: 'Pending',
    }
    if (commit((current) => ({
      ...current,
      registrations: [...current.registrations, registration],
    }))) {
      setNotice('Registration submitted. An administrator will review it.')
    }
  }

  function updateRegistration(id, status) {
    if (commit((current) => ({
      ...current,
      registrations: current.registrations.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    }))) {
      setNotice(`Registration ${status.toLowerCase()}.`)
    }
  }

  function updateTournamentStatus(tournament) {
    const nextStatus =
      tournament.status === 'Open'
        ? 'Live'
        : tournament.status === 'Live'
          ? 'Finished'
          : 'Open'
    if (commit((current) => ({
      ...current,
      tournaments: current.tournaments.map((item) =>
        item.id === tournament.id ? { ...item, status: nextStatus } : item,
      ),
    }))) {
      setNotice(`${tournament.name} is now ${nextStatus.toLowerCase()}.`)
    }
  }

  function createTournament(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const prize = Number(form.get('prize'))
    const teams = Number(form.get('teams'))
    if (!name || !Number.isFinite(prize) || prize < 0 || !Number.isInteger(teams) || teams < 2) {
      setNotice('Enter a tournament name, a valid prize, and at least 2 team slots.')
      return
    }
    const tournament = {
      id: crypto.randomUUID(),
      name,
      game: String(form.get('game') || '').trim(),
      format: String(form.get('format') || 'Single elimination'),
      date: String(form.get('date')),
      prize,
      teams,
      status: 'Open',
    }
    if (commit((current) => ({
      ...current,
      tournaments: [tournament, ...current.tournaments],
    }))) {
      event.currentTarget.reset()
      setNotice('Tournament created and published.')
    }
  }

  function publishAnnouncement(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') || '').trim()
    const body = String(form.get('body') || '').trim()
    if (!title || !body) return
    const announcement = {
      id: crypto.randomUUID(),
      title,
      body,
      date: today,
    }
    if (commit((current) => ({
      ...current,
      announcements: [announcement, ...current.announcements],
    }))) {
      event.currentTarget.reset()
      setNotice('Announcement published.')
    }
  }

  function removeAnnouncement(id) {
    if (commit((current) => ({
      ...current,
      announcements: current.announcements.filter((item) => item.id !== id),
    }))) {
      setNotice('Announcement removed.')
    }
  }

  if (fatalError) {
    return (
      <main className="fatal-screen">
        <div className="fatal-card">
          <div className="brand-mark">AE</div>
          <h1>Could not load Arena Elite</h1>
          <p>{fatalError}</p>
          <p className="muted">If saved data was changed manually, clear this site’s local storage and reload.</p>
        </div>
      </main>
    )
  }

  if (!data) {
    return <main className="loading-screen"><span className="brand-mark">AE</span><p>Preparing the arena…</p></main>
  }

  const isAdmin = activeUser?.role === 'admin'
  const isSignedIn = Boolean(activeUser)
  const currentPanel = isAdmin ? adminPanel : userPanel
  const registrations = data.registrations
  const pendingCount = registrations.filter((item) => item.status === 'Pending').length
  const myRegistrations = registrations.filter((item) => item.userId === activeUser?.id)
  const sections = isAdmin ? adminSections : userSections
  const panelTitle = {
    dashboard: isAdmin ? 'Admin control center' : 'Player dashboard',
    tournaments: 'Tournament directory',
    registrations: 'Registration review',
    players: 'Player accounts',
    announcements: 'Announcements',
    leaderboard: 'Team leaderboard',
  }[currentPanel]

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand brand-button" onClick={() => setScreen(isAdmin ? 'admin' : isSignedIn ? 'user' : 'home')} aria-label="Arena Elite home">
          <span className="brand-mark">AE</span>
          <span className="brand-name">ARENA <b>ELITE</b><small>COMPETITIVE GAMING</small></span>
        </button>
        {isSignedIn && <nav className="top-nav" aria-label="Main navigation">
          {(isAdmin ? adminSections.slice(0, 3) : userSections).map(([key, label]) => (
            <button key={key} className={currentPanel === key ? 'nav-link active' : 'nav-link'} onClick={() => navigate(key)}>{label}</button>
          ))}
        </nav>}
        <div className="top-actions">
          {isSignedIn ? (
            <>
              <span className="role-tag"><span className="online-dot" />{isAdmin ? 'ADMIN' : 'PLAYER'}</span>
              <span className="user-initial">{activeUser.name.slice(0, 1).toUpperCase()}</span>
              <button className="button button-outline button-small" onClick={logout}>Sign out</button>
            </>
          ) : (
            <>
              <button className="button button-quiet button-small" onClick={() => openAuth('login')}>Log in</button>
              <button className="button button-primary button-small" onClick={() => openAuth('signup')}>Create account</button>
            </>
          )}
        </div>
      </header>

      {notice && <div className="notice" role="status"><span>{notice}</span><button aria-label="Dismiss message" onClick={() => setNotice('')}>×</button></div>}

      {!isSignedIn && screen === 'home' ? (
        <main className="landing">
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span className="online-dot" /> THE NEXT MATCH IS YOURS</div>
              <h1>Play with purpose.<br /><span>Compete for glory.</span></h1>
              <p>Find your squad, enter the arena, and climb the leaderboard. Your next tournament starts here.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => openAuth('signup')}>Join Arena Elite <span aria-hidden="true">→</span></button>
                <button className="button button-outline" onClick={() => openAuth('login')}>Player login</button>
              </div>
              <div className="hero-footnote"><span className="online-dot" /> PLAYER &amp; ADMIN MODULES <span className="separator">/</span> LOCAL DEMO</div>
            </div>
            <div className="hero-visual" aria-label="Tournament season overview">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="visual-core"><span>AE</span><small>ENTER THE ARENA</small></div>
              <div className="visual-label label-top"><span className="online-dot" /> LIVE SEASON <b>07</b></div>
              <div className="visual-label label-bottom">NEXT EVENT <b>12 NOV</b></div>
              <div className="visual-cross cross-one">+</div><div className="visual-cross cross-two">+</div>
            </div>
          </section>

          <section className="landing-content">
            <div className="section-heading">
              <div><span className="eyebrow">THE CIRCUIT</span><h2>Upcoming tournaments</h2></div>
              <span className="muted">Three events. One chance to rise.</span>
            </div>
            <TournamentCards tournaments={data.tournaments} registrations={myRegistrations} isAdmin={false} onApply={applyToTournament} />
            <div className="module-strip">
              <div><span className="module-icon">01</span><div><h3>Player module</h3><p>Create an account, register for events, and follow your submissions.</p></div></div>
              <div><span className="module-icon admin-icon">02</span><div><h3>Admin module</h3><p>Manage events, review registrations, players, and announcements.</p></div></div>
            </div>

            <section className="auth-section" id="account">
              <div className="auth-intro">
                <span className="eyebrow">YOUR ARENA AWAITS</span>
                <h2>{authMode === 'signup' ? 'Create your player account.' : 'Welcome back to the arena.'}</h2>
                <p>Player accounts and tournament registrations are saved in this browser for the review demo.</p>
                <div className="demo-credentials">
                  <span className="demo-icon">⌘</span>
                  <div><strong>Admin review account</strong><span>admin@arenaelite.gg <b>·</b> Admin@123</span></div>
                </div>
              </div>
              <div className="auth-card">
                <div className="auth-tabs" role="tablist" aria-label="Account options">
                  <button role="tab" aria-selected={authMode === 'login'} className={authMode === 'login' ? 'selected' : ''} onClick={() => { setAuthMode('login'); setAuthError('') }}>Log in</button>
                  <button role="tab" aria-selected={authMode === 'signup'} className={authMode === 'signup' ? 'selected' : ''} onClick={() => { setAuthMode('signup'); setAuthError('') }}>Create player account</button>
                </div>
                <form className="auth-form" onSubmit={handleAuth}>
                  {authMode === 'signup' && <label>Player name<input name="name" autoComplete="name" placeholder="Your name" minLength="2" required /></label>}
                  <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
                  <label>Password<input name="password" type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder={authMode === 'signup' ? 'At least 8 characters' : 'Your password'} minLength={authMode === 'signup' ? 8 : undefined} required /></label>
                  {authError && <p className="form-error" role="alert">{authError}</p>}
                  <button className="button button-primary full-width" type="submit" disabled={busy}>{busy ? 'Please wait…' : authMode === 'signup' ? 'Create player account' : 'Log in to Arena Elite'}</button>
                  <p className="form-note">Passwords are locally salted and hashed. This is a browser-only demo, not production authentication.</p>
                </form>
              </div>
            </section>
          </section>
        </main>
      ) : isSignedIn ? (
        <main className="workspace">
          <aside className="sidebar">
            <div className="sidebar-label">{isAdmin ? 'ADMINISTRATION' : 'PLAYER SPACE'}</div>
            <div className="side-identity"><span className={isAdmin ? 'side-avatar admin-avatar' : 'side-avatar'}>{activeUser.name.slice(0, 1).toUpperCase()}</span><div><strong>{activeUser.name}</strong><span>{isAdmin ? 'Super administrator' : 'Player account'}</span></div></div>
            <nav className="side-nav" aria-label={`${isAdmin ? 'Admin' : 'Player'} navigation`}>
              {sections.map(([key, label], index) => (
                <button key={key} className={currentPanel === key ? 'side-link selected' : 'side-link'} onClick={() => navigate(key)}>
                  <span className="side-index">0{index + 1}</span>{label}
                  {key === 'registrations' && pendingCount > 0 && <span className="count-badge">{pendingCount}</span>}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom"><span className="online-dot" /> ARENA SERVICES ONLINE</div>
          </aside>

          <section className="main-panel">
            <div className="page-heading">
              <div><span className="eyebrow">{isAdmin ? 'ARENA OPERATIONS' : 'PLAYER SPACE'} / {isAdmin ? 'ADMIN' : 'MEMBER'}</span><h1>{panelTitle}</h1><p>{isAdmin ? 'Manage the competition, players, and community.' : 'Your events, registrations, and competitive journey.'}</p></div>
              {isAdmin && <span className="admin-chip"><span className="online-dot" /> CONTROL CENTER</span>}
            </div>

            {currentPanel === 'dashboard' && (
              isAdmin ? (
                <>
                  <div className="stats-grid">
                    <Stat label="PLAYER ACCOUNTS" value={data.users.filter((user) => user.role === 'user').length} detail="Registered in this browser" />
                    <Stat label="TOURNAMENTS" value={data.tournaments.length} detail="Across all event stages" />
                    <Stat label="PENDING REVIEWS" value={pendingCount} detail="Registrations awaiting action" highlight />
                    <Stat label="OPEN EVENTS" value={data.tournaments.filter((item) => item.status === 'Open').length} detail="Accepting new registrations" />
                  </div>
                  <div className="content-card dashboard-card">
                    <div className="card-heading"><div><span className="eyebrow">OPERATIONS</span><h2>Recent registrations</h2></div><button className="text-button" onClick={() => navigate('registrations')}>Review queue →</button></div>
                    <RegistrationTable registrations={registrations.slice(0, 5)} users={data.users} admin onUpdate={updateRegistration} />
                  </div>
                  <div className="content-card">
                    <div className="card-heading"><div><span className="eyebrow">EVENT PIPELINE</span><h2>Tournament status</h2></div><button className="text-button" onClick={() => navigate('tournaments')}>Manage events →</button></div>
                    <TournamentTable tournaments={data.tournaments.slice(0, 4)} onStatus={updateTournamentStatus} admin />
                  </div>
                </>
              ) : (
                <>
                  <div className="welcome-banner"><div><span className="eyebrow">WELCOME BACK</span><h2>Ready for your next match, {activeUser.name.split(' ')[0]}?</h2><p>Browse open events and get your registration in before the bracket fills.</p></div><button className="button button-primary" onClick={() => navigate('tournaments')}>Explore tournaments →</button></div>
                  <div className="stats-grid">
                    <Stat label="MY REGISTRATIONS" value={myRegistrations.length} detail="Across all events" />
                    <Stat label="AWAITING REVIEW" value={myRegistrations.filter((item) => item.status === 'Pending').length} detail="We’ll update your status" highlight />
                    <Stat label="OPEN TO JOIN" value={data.tournaments.filter((item) => item.status === 'Open').length} detail="Events accepting entries" />
                  </div>
                  <div className="content-card"><div className="card-heading"><div><span className="eyebrow">YOUR ACTIVITY</span><h2>My registrations</h2></div></div>
                    {myRegistrations.length ? <RegistrationTable registrations={myRegistrations} users={data.users} /> : <EmptyState title="No registrations yet" detail="Pick a tournament and send your first entry." action="Browse tournaments" onClick={() => navigate('tournaments')} />}
                  </div>
                  <div className="content-card announcements-card"><div className="card-heading"><div><span className="eyebrow">ARENA BULLETIN</span><h2>Latest announcements</h2></div></div><AnnouncementList announcements={data.announcements.slice(0, 3)} /></div>
                </>
              )
            )}

            {currentPanel === 'tournaments' && (
              <>
                {isAdmin && <div className="content-card create-card"><div className="card-heading"><div><span className="eyebrow">EVENT SETUP</span><h2>Create a tournament</h2></div></div>
                  <form className="tournament-form" onSubmit={createTournament}>
                    <label>Event name<input name="name" placeholder="e.g. Arena Open" required /></label>
                    <label>Game<input name="game" placeholder="e.g. Valorant" required /></label>
                    <label>Format<select name="format"><option>Single elimination</option><option>Double elimination</option><option>Round robin</option><option>League</option></select></label>
                    <label>Start date<input name="date" type="date" min={today} required /></label>
                    <label>Prize pool (INR)<input name="prize" type="number" min="0" step="1000" placeholder="50000" required /></label>
                    <label>Team slots<input name="teams" type="number" min="2" step="1" defaultValue="16" required /></label>
                    <button className="button button-primary" type="submit">Publish tournament</button>
                  </form>
                </div>}
                <div className="section-heading compact-heading"><div><span className="eyebrow">{isAdmin ? 'EVENT MANAGEMENT' : 'FIND YOUR NEXT MATCH'}</span><h2>{isAdmin ? 'All tournaments' : 'Open tournaments'}</h2></div><span className="muted">{data.tournaments.length} events</span></div>
                <TournamentCards tournaments={data.tournaments} registrations={myRegistrations} isAdmin={isAdmin} onApply={applyToTournament} />
                {isAdmin && <div className="content-card"><div className="card-heading"><div><span className="eyebrow">QUICK MANAGEMENT</span><h2>Advance event status</h2></div></div><TournamentTable tournaments={data.tournaments} onStatus={updateTournamentStatus} admin /></div>}
              </>
            )}

            {isAdmin && currentPanel === 'registrations' && (
              <div className="content-card"><div className="card-heading"><div><span className="eyebrow">PLAYER ENTRIES</span><h2>Registration queue</h2></div><span className="queue-count">{pendingCount} pending</span></div>
                {registrations.length ? <RegistrationTable registrations={registrations} users={data.users} admin onUpdate={updateRegistration} /> : <EmptyState title="Your queue is clear" detail="Player registrations will appear here for review." />}
              </div>
            )}

            {isAdmin && currentPanel === 'players' && (
              <div className="content-card"><div className="card-heading"><div><span className="eyebrow">COMMUNITY</span><h2>Player accounts</h2></div><span className="muted">{data.users.filter((user) => user.role === 'user').length} players</span></div>
                <div className="table-scroll"><table><thead><tr><th>PLAYER</th><th>EMAIL</th><th>JOINED</th><th>ENTRIES</th></tr></thead><tbody>
                  {data.users.filter((user) => user.role === 'user').map((user) => <tr key={user.id}><td><div className="player-cell"><span className="table-avatar">{user.name.slice(0, 1).toUpperCase()}</span><strong>{user.name}</strong></div></td><td>{user.email}</td><td>{dateLabel(user.joinedAt.slice(0, 10))}</td><td>{registrations.filter((item) => item.userId === user.id).length}</td></tr>)}
                </tbody></table></div>
                {!data.users.some((user) => user.role === 'user') && <EmptyState title="No player accounts yet" detail="Player signups will appear here." />}
              </div>
            )}

            {isAdmin && currentPanel === 'announcements' && (
              <>
                <div className="content-card create-card"><div className="card-heading"><div><span className="eyebrow">COMMUNITY UPDATES</span><h2>Publish an announcement</h2></div></div>
                  <form className="announcement-form" onSubmit={publishAnnouncement}><label>Headline<input name="title" placeholder="What should players know?" required /></label><label>Message<textarea name="body" rows="3" placeholder="Write a short update for the community…" required /></label><button className="button button-primary" type="submit">Publish update</button></form>
                </div>
                <div className="content-card"><div className="card-heading"><div><span className="eyebrow">PUBLISHED</span><h2>Community announcements</h2></div></div><AnnouncementList announcements={data.announcements} admin onRemove={removeAnnouncement} /></div>
              </>
            )}

            {!isAdmin && currentPanel === 'leaderboard' && (
              <div className="content-card"><div className="card-heading"><div><span className="eyebrow">SEASON 07</span><h2>Top teams</h2></div><span className="muted">Ranked by circuit points</span></div>
                <div className="table-scroll"><table><thead><tr><th>RANK</th><th>TEAM</th><th>GAME</th><th>WINS</th><th>POINTS</th></tr></thead><tbody>{initialLeaderboard.map((team) => <tr key={team.rank}><td><span className={team.rank === 1 ? 'rank rank-first' : 'rank'}>#{team.rank}</span></td><td><strong>{team.team}</strong></td><td>{team.game}</td><td>{team.wins}</td><td><strong>{team.points.toLocaleString()}</strong></td></tr>)}</tbody></table></div>
              </div>
            )}
          </section>
        </main>
      ) : null}
      <footer className="site-footer"><span>ARENA ELITE <b>·</b> COMPETE WITH PURPOSE</span><span>REVIEW DEMO · DATA SAVED IN THIS BROWSER</span></footer>
    </div>
  )
}

function Stat({ label, value, detail, highlight }) {
  return <article className={highlight ? 'stat-card stat-highlight' : 'stat-card'}><span className="stat-label">{label}</span><strong>{value}</strong><span className="stat-detail">{detail}</span></article>
}

function EmptyState({ title, detail, action, onClick }) {
  return <div className="empty-state"><span className="empty-symbol">◎</span><h3>{title}</h3><p>{detail}</p>{action && <button className="text-button" onClick={onClick}>{action} →</button>}</div>
}

function RegistrationTable({ registrations, users, admin, onUpdate }) {
  if (!registrations.length) return <EmptyState title="No registrations to show" detail="Entries will show up here once a player registers." />
  return (
    <div className="table-scroll"><table><thead><tr><th>PLAYER</th><th>TOURNAMENT</th><th>SUBMITTED</th><th>STATUS</th>{admin && <th>ACTION</th>}</tr></thead><tbody>
      {registrations.map((registration) => {
        const player = users.find((user) => user.id === registration.userId)
        return <tr key={registration.id}>
          <td><div className="player-cell"><span className="table-avatar">{(player?.name || registration.player).slice(0, 1).toUpperCase()}</span><div><strong>{player?.name || registration.player}</strong><small>{player?.email || registration.email}</small></div></div></td>
          <td>{registration.tournament}</td><td>{dateLabel(registration.date)}</td><td><Status>{registration.status}</Status></td>
          {admin && <td>{registration.status === 'Pending' ? <div className="row-actions"><button className="button button-approve" onClick={() => onUpdate(registration.id, 'Approved')}>Approve</button><button className="button button-reject" onClick={() => onUpdate(registration.id, 'Rejected')}>Reject</button></div> : <span className="muted">Reviewed</span>}</td>}
        </tr>
      })}
    </tbody></table></div>
  )
}

function TournamentTable({ tournaments, admin, onStatus }) {
  return <div className="table-scroll"><table><thead><tr><th>TOURNAMENT</th><th>GAME</th><th>START DATE</th><th>PRIZE</th><th>STATUS</th>{admin && <th>ACTION</th>}</tr></thead><tbody>
    {tournaments.map((tournament) => <tr key={tournament.id}><td><strong>{tournament.name}</strong><small>{tournament.format}</small></td><td>{tournament.game}</td><td>{dateLabel(tournament.date)}</td><td>{money(tournament.prize)}</td><td><Status>{tournament.status}</Status></td>{admin && <td><button className="text-button" onClick={() => onStatus(tournament)}>Advance status →</button></td>}</tr>)}
  </tbody></table></div>
}

function AnnouncementList({ announcements, admin, onRemove }) {
  if (!announcements.length) return <EmptyState title="No announcements yet" detail="Published updates will appear here." />
  return <div className="announcement-list">{announcements.map((item) => <article className="announcement-item" key={item.id}><span className="announcement-mark">A</span><div className="announcement-copy"><div className="row-between"><h3>{item.title}</h3><time>{dateLabel(item.date)}</time></div><p>{item.body}</p></div>{admin && <button className="remove-button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.title}`}>×</button>}</article>)}</div>
}

export default App
