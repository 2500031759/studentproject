export const STORAGE_KEYS = {
  users: 'eliteArena.users',
  session: 'eliteArena.session',
  tournaments: 'eliteArena.tournaments',
  teams: 'eliteArena.teams',
  matches: 'eliteArena.matches',
  registrations: 'eliteArena.registrations',
  announcements: 'eliteArena.announcements',
  leaderboard: 'eliteArena.leaderboard',
  teamRequests: 'eliteArena.teamRequests',
  players: 'eliteArena.players',
  reports: 'eliteArena.reports',
  community: 'eliteArena.community',
};

export function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error);
    throw new Error('Your browser could not save this update. Check local storage availability and try again.');
  }
}

export function getInitialData(key, fallback) {
  const existing = window.localStorage.getItem(key);
  if (existing !== null) return readStorage(key, fallback);
  writeStorage(key, fallback);
  return fallback;
}
