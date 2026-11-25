export const seedTournaments = [
  { id: '1', name: 'Valorant Champions Cup', game: 'Valorant', code: 'VL', status: 'Live', prize: 1200000, participants: 64, start: '2026-11-18', location: 'Online', organizer: 'Arena Elite Official', format: 'Single Elimination', description: 'The premier Valorant championship of Season 6.' },
  { id: '2', name: 'CS2 Masters', game: 'CS2', code: 'C2', status: 'Registration Open', prize: 850000, participants: 32, start: '2026-11-24', location: 'Online', organizer: 'Titan League', format: 'Double Elimination', description: 'A double-elimination invitational for the region’s strongest CS2 rosters.' },
  { id: '3', name: 'PUBG Battleground Series', game: 'PUBG', code: 'PB', status: 'Registration Open', prize: 600000, participants: 48, start: '2026-12-05', location: 'LAN', organizer: 'Battleground Circuit', format: 'League Format', description: 'A LAN-based league running across six weeks in Hyderabad.' },
  { id: '4', name: 'FIFA Pro League', game: 'FIFA', code: 'FI', status: 'Upcoming', prize: 300000, participants: 128, start: '2026-12-14', location: 'Online', organizer: 'Pro League Network', format: 'Round Robin', description: 'An open round-robin league for solo competitors.' },
  { id: '5', name: 'Free Fire Elite League', game: 'Free Fire', code: 'FF', status: 'Completed', prize: 500000, participants: 40, start: '2026-10-10', location: 'Online', organizer: 'Elite League Studios', format: 'League Format', description: 'Season 5’s mobile flagship event.' },
  { id: '6', name: 'Mobile Legends Championship', game: 'Mobile Legends', code: 'ML', status: 'Live', prize: 450000, participants: 24, start: '2026-11-19', location: 'Online', organizer: 'Arena Elite Official', format: 'Single Elimination', description: 'Single-elimination cup for rising Mobile Legends rosters.' },
];

export const seedTeams = [
  { id: '1', name: 'Shadow Titans', tag: 'ST', captain: 'ShadowByte', game: 'Valorant', members: 5, wins: 58, ranking: 2, status: 'Active', region: 'North Region' },
  { id: '2', name: 'Storm Breakers', tag: 'SB', captain: 'NightVortex', game: 'Free Fire', members: 5, wins: 71, ranking: 1, status: 'Active', region: 'West Region' },
  { id: '3', name: 'Phoenix Squad', tag: 'PS', captain: 'GraniteWall', game: 'Valorant', members: 5, wins: 56, ranking: 3, status: 'Active', region: 'South Region' },
  { id: '4', name: 'Titan Force', tag: 'TF', captain: 'RaptorX', game: 'PUBG', members: 4, wins: 49, ranking: 4, status: 'Active', region: 'North Region' },
  { id: '5', name: 'Night Wolves', tag: 'NW', captain: 'VortexKing', game: 'CS2', members: 5, wins: 47, ranking: 5, status: 'Active', region: 'East Region' },
  { id: '6', name: 'Cyber Knights', tag: 'CK', captain: 'ZeroByte', game: 'PUBG', members: 4, wins: 42, ranking: 6, status: 'Active', region: 'South Region' },
  { id: '7', name: 'Iron Reapers', tag: 'IR', captain: 'Valkyrie99', game: 'Valorant', members: 5, wins: 33, ranking: 8, status: 'Active', region: 'North Region' },
];

export const seedMatches = [
  { id: 'M-114', date: '2026-11-12', time: '10:00', a: 'Shadow Titans', b: 'Phoenix Squad', game: 'Valorant', status: 'Live', scoreA: 13, scoreB: 10, venue: 'Online' },
  { id: 'M-115', date: '2026-11-12', time: '12:30', a: 'Night Wolves', b: 'Cyber Knights', game: 'CS2', status: 'Upcoming', scoreA: 0, scoreB: 0, venue: 'Online' },
  { id: 'M-116', date: '2026-11-13', time: '15:00', a: 'Titan Force', b: 'Cyber Knights', game: 'PUBG', status: 'Upcoming', scoreA: 0, scoreB: 0, venue: 'Hyderabad LAN' },
  { id: 'M-117', date: '2026-11-14', time: '11:00', a: 'Iron Reapers', b: 'Storm Breakers', game: 'Valorant', status: 'Upcoming', scoreA: 0, scoreB: 0, venue: 'Online' },
  { id: 'M-108', date: '2026-11-10', time: '17:00', a: 'Phoenix Squad', b: 'Iron Reapers', game: 'Valorant', status: 'Completed', scoreA: 13, scoreB: 7, venue: 'Online' },
];

export const seedRegistrations = [
  { id: 'REG-1041', team: 'Quiet Riot', tournament: 'PUBG Battleground Series', captain: 'SniperWolf', players: 4, status: 'Pending', submitted: '2026-11-10' },
  { id: 'REG-1042', team: 'Iron Reapers', tournament: 'CS2 Masters', captain: 'Valkyrie99', players: 5, status: 'Pending', submitted: '2026-11-11' },
];

export const seedAnnouncements = [
  { id: 'A-1', title: 'Season 7 Ranked Reset', body: 'Ranks reset at the start of next week — placement matches unlock Monday.', author: 'Arena Elite', date: '2026-11-12' },
  { id: 'A-2', title: 'Vanguard Cup Registration Open', body: 'Sign your squad up before the bracket locks Friday.', author: 'Tournament Desk', date: '2026-11-11' },
  { id: 'A-3', title: 'Scheduled Maintenance', body: 'Servers will be briefly offline overnight for a platform update.', author: 'Arena Elite', date: '2026-11-10' },
];

export const seedLeaderboard = [
  { team: 'Storm Breakers', game: 'Free Fire', matches: 92, wins: 71, points: 2840 },
  { team: 'Shadow Titans', game: 'Valorant', matches: 86, wins: 58, points: 2615 },
  { team: 'Phoenix Squad', game: 'Valorant', matches: 88, wins: 56, points: 2490 },
  { team: 'Titan Force', game: 'PUBG', matches: 79, wins: 49, points: 2310 },
  { team: 'Night Wolves', game: 'CS2', matches: 81, wins: 47, points: 2185 },
  { team: 'Cyber Knights', game: 'PUBG', matches: 74, wins: 42, points: 2040 },
  { team: 'Iron Reapers', game: 'Valorant', matches: 68, wins: 33, points: 1705 },
];

export const seedPlayers = [
  { id: 'P-1', name: 'Shaurya Bhardwaj', username: 'ShadowByte', team: 'Shadow Titans', game: 'Valorant', matches: 124, wins: 78, status: 'Verified', kda: '1.42' },
  { id: 'P-2', name: 'Vikramaditya Roy', username: 'NightVortex', team: 'Storm Breakers', game: 'CS2', matches: 110, wins: 72, status: 'Verified', kda: '1.28' },
  { id: 'P-3', name: 'Ananya Deshmukh', username: 'EchoPulse', team: 'Shadow Titans', game: 'Valorant', matches: 96, wins: 61, status: 'Active', kda: '1.19' },
  { id: 'P-4', name: 'Rohan Sengupta', username: 'GraniteWall', team: 'Phoenix Squad', game: 'Valorant', matches: 88, wins: 52, status: 'Active', kda: '1.05' },
  { id: 'P-5', name: 'Karan Oberoi', username: 'PhantomAim', team: 'Apex Legends', game: 'CS2', matches: 74, wins: 39, status: 'Suspended', kda: '1.62' },
  { id: 'P-6', name: 'Deepak Patel', username: 'VortexKing', team: 'Night Wolves', game: 'CS2', matches: 82, wins: 48, status: 'Active', kda: '0.98' },
  { id: 'P-7', name: 'Simran Kaur', username: 'Valkyrie99', team: 'Iron Reapers', game: 'Valorant', matches: 65, wins: 33, status: 'Active', kda: '1.14' },
];

export const seedReports = [
  { id: 'REP-801', reporter: 'QuietFrost', target: 'PhantomAim', category: 'Cheating', description: 'Suspected wallhack in map 2 overtime.', priority: 'Critical', date: '2026-11-11', status: 'Open' },
  { id: 'REP-802', reporter: 'Storm Breakers', target: 'Night Wolves', category: 'Fake Result', description: 'Incorrect score screenshot uploaded.', priority: 'High', date: '2026-11-10', status: 'In Review' },
  { id: 'REP-803', reporter: 'Apex Legends', target: 'ViperStrike', category: 'Abuse', description: 'Toxic verbal harassment in chat.', priority: 'Medium', date: '2026-11-09', status: 'Resolved' },
];

export const seedCommunity = [
  { id: 'C-1', tag: 'Announcement', author: 'Arena Elite Official', body: 'Quarterfinal seeding for the Valorant Champions Cup is now live.', likes: 214, replies: 38, date: '2026-11-12', status: 'Approved' },
  { id: 'C-2', tag: 'Recruitment', author: 'NightVortex', body: 'Storm Breakers is looking for a stand-in Controller.', likes: 41, replies: 19, date: '2026-11-11', status: 'Approved' },
  { id: 'C-3', tag: 'Discussion', author: 'GraniteWall', body: 'Does the new Ascension map favor defensive setups?', likes: 88, replies: 52, date: '2026-11-10', status: 'Approved' },
];
