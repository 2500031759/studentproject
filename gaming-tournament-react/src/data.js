export const STORAGE_KEY = 'arena-elite:data:v1'
export const SESSION_KEY = 'arena-elite:session:v1'

export const initialTournaments = [
  {
    id: 'tournament-valorant',
    name: 'Valorant Champions Cup',
    game: 'Valorant',
    format: 'Single elimination',
    status: 'Open',
    prize: 1200000,
    teams: 64,
    date: '2026-11-12',
  },
  {
    id: 'tournament-cs2',
    name: 'CS2 Masters',
    game: 'Counter-Strike 2',
    format: 'Double elimination',
    status: 'Open',
    prize: 850000,
    teams: 32,
    date: '2026-11-18',
  },
  {
    id: 'tournament-pubg',
    name: 'PUBG Battleground Series',
    game: 'PUBG',
    format: 'League',
    status: 'Upcoming',
    prize: 600000,
    teams: 48,
    date: '2026-11-24',
  },
]

export const initialRegistrations = []

export const initialAnnouncements = [
  {
    id: 'announcement-season',
    title: 'Season 7 is here',
    body: 'Explore the latest tournaments and find your next team challenge.',
    date: '2026-11-01',
  },
  {
    id: 'announcement-registration',
    title: 'Valorant Champions Cup registration is open',
    body: 'Team captains can submit a roster from the tournament directory.',
    date: '2026-10-29',
  },
]

export const initialLeaderboard = [
  { rank: 1, team: 'Storm Breakers', game: 'Free Fire', points: 2840, wins: 71 },
  { rank: 2, team: 'Shadow Titans', game: 'Valorant', points: 2615, wins: 58 },
  { rank: 3, team: 'Phoenix Squad', game: 'Valorant', points: 2490, wins: 56 },
  { rank: 4, team: 'Titan Force', game: 'PUBG', points: 2310, wins: 49 },
  { rank: 5, team: 'Night Wolves', game: 'Counter-Strike 2', points: 2185, wins: 47 },
]
