import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, STORAGE_KEYS, writeStorage } from '../services/storageService';
import {
  seedAnnouncements, seedCommunity, seedLeaderboard, seedMatches, seedPlayers, seedRegistrations, seedReports, seedTeams, seedTournaments,
} from '../services/arenaData';
import { useAuth } from './AuthContext';

const ArenaContext = createContext(null);

function useStoredList(key, seed) {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(key);
    return stored === null ? seed : readStorage(key, seed);
  });
  const update = (nextValue) => {
    writeStorage(key, nextValue);
    setValue(nextValue);
  };
  return [value, update];
}

export function ArenaProvider({ children }) {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useStoredList(STORAGE_KEYS.tournaments, seedTournaments);
  const [teams, setTeams] = useStoredList(STORAGE_KEYS.teams, seedTeams);
  const [matches, setMatches] = useStoredList(STORAGE_KEYS.matches, seedMatches);
  const [registrations, setRegistrations] = useStoredList(STORAGE_KEYS.registrations, seedRegistrations);
  const [announcements, setAnnouncements] = useStoredList(STORAGE_KEYS.announcements, seedAnnouncements);
  const [leaderboard, setLeaderboard] = useStoredList(STORAGE_KEYS.leaderboard, seedLeaderboard);
  const [teamRequests, setTeamRequests] = useStoredList(STORAGE_KEYS.teamRequests, []);
  const [players] = useStoredList(STORAGE_KEYS.players, seedPlayers);
  const [reports, setReports] = useStoredList(STORAGE_KEYS.reports, seedReports);
  const [community, setCommunity] = useStoredList(STORAGE_KEYS.community, seedCommunity);
  const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.users, []));
  useEffect(() => setUsers(readStorage(STORAGE_KEYS.users, [])), [user]);

  const registerForTournament = (tournamentId) => {
    if (!user) throw new Error('Sign in before joining a tournament.');
    const tournament = tournaments.find((entry) => entry.id === tournamentId);
    if (!tournament || tournament.status !== 'Registration Open') throw new Error('This tournament is no longer accepting registrations.');
    if (registrations.some((entry) => entry.tournamentId === tournamentId && entry.email === user.email)) {
      throw new Error('You are already registered for this tournament.');
    }
    const next = [...registrations, {
      id: `REG-${Date.now()}`, team: user.name, tournament: tournament.name,
      tournamentId, captain: user.name, players: 1, email: user.email,
      status: 'Pending', submitted: new Date().toISOString().slice(0, 10),
    }];
    setRegistrations(next);
    setTournaments(tournaments.map((entry) => entry.id === tournamentId
      ? { ...entry, participants: entry.participants + 1 } : entry));
  };

  const createTournament = (fields) => {
    const next = [{ ...fields, id: crypto.randomUUID(), code: fields.game.slice(0, 2).toUpperCase(), participants: 0, organizer: user?.name ?? 'Arena Elite' }, ...tournaments];
    setTournaments(next);
    return next[0];
  };

  const updateTournament = (id, fields) => setTournaments(tournaments.map((entry) => entry.id === id ? { ...entry, ...fields } : entry));
  const deleteTournament = (id) => {
    setTournaments(tournaments.filter((entry) => entry.id !== id));
    setRegistrations(registrations.filter((entry) => entry.tournamentId !== id));
  };

  const createTeam = (fields) => setTeams([{ ...fields, id: crypto.randomUUID(), members: 1, wins: 0, ranking: teams.length + 1, status: 'Active' }, ...teams]);
  const requestTeamJoin = (teamId) => {
    if (!user || user.role !== 'user') throw new Error('Sign in as a competitor to request to join a team.');
    if (teamRequests.some((entry) => entry.teamId === teamId && entry.email === user.email && entry.status === 'Pending')) {
      throw new Error('You already have a pending request for this team.');
    }
    const team = teams.find((entry) => entry.id === teamId);
    if (!team) throw new Error('This team is no longer available.');
    setTeamRequests([{ id: crypto.randomUUID(), teamId, team: team.name, name: user.name, email: user.email, status: 'Pending', date: new Date().toISOString().slice(0, 10) }, ...teamRequests]);
  };
  const setTeamRequestStatus = (id, status) => {
    const request = teamRequests.find((entry) => entry.id === id);
    setTeamRequests(teamRequests.map((entry) => entry.id === id ? { ...entry, status } : entry));
    if (status === 'Approved' && request) {
      setTeams(teams.map((team) => team.id === request.teamId ? { ...team, members: team.members + 1 } : team));
    }
  };
  const updateTeam = (id, fields) => setTeams(teams.map((entry) => entry.id === id ? { ...entry, ...fields } : entry));
  const deleteTeam = (id) => setTeams(teams.filter((entry) => entry.id !== id));

  const addMatch = (fields) => setMatches([{ ...fields, id: `M-${Date.now()}`, status: 'Upcoming', scoreA: 0, scoreB: 0 }, ...matches]);
  const updateMatch = (id, fields) => {
    const previousMatch = matches.find((entry) => entry.id === id);
    const nextMatches = matches.map((entry) => entry.id === id ? { ...entry, ...fields } : entry);
    setMatches(nextMatches);
    if (fields.status === 'Completed' && previousMatch?.status !== 'Completed') {
      const match = nextMatches.find((entry) => entry.id === id);
      if (match) {
        const winner = match.scoreA > match.scoreB ? match.a : match.b;
        const nextLeaderboard = leaderboard.map((row) => row.team === winner
          ? { ...row, matches: row.matches + 1, wins: row.wins + 1, points: row.points + 25 }
          : [match.a, match.b].includes(row.team) ? { ...row, matches: row.matches + 1 } : row);
        setLeaderboard(nextLeaderboard);
        setTeams(teams.map((team) => team.name === winner ? { ...team, wins: team.wins + 1 } : team));
      }
    }
  };

  const setRegistrationStatus = (id, status) => setRegistrations(registrations.map((entry) => entry.id === id ? { ...entry, status } : entry));
  const deleteRegistration = (id) => {
    const registration = registrations.find((entry) => entry.id === id);
    setRegistrations(registrations.filter((entry) => entry.id !== id));
    if (registration?.tournamentId) {
      setTournaments(tournaments.map((tournament) => tournament.id === registration.tournamentId
        ? { ...tournament, participants: Math.max(0, tournament.participants - 1) } : tournament));
    }
  };
  const publishAnnouncement = (fields) => setAnnouncements([{ ...fields, id: crypto.randomUUID(), author: user?.name ?? 'Arena Elite', date: new Date().toISOString().slice(0, 10) }, ...announcements]);
  const deleteAnnouncement = (id) => setAnnouncements(announcements.filter((entry) => entry.id !== id));
  const resolveReport = (id) => setReports(reports.map((report) => report.id === id ? { ...report, status: 'Resolved' } : report));
  const setCommunityPostStatus = (id, status) => setCommunity(community.map((post) => post.id === id ? { ...post, status } : post));
  const deleteCommunityPost = (id) => setCommunity(community.filter((post) => post.id !== id));
  const publishCommunityPost = ({ tag, body }) => {
    if (!user) throw new Error('Sign in to post in the community.');
    setCommunity([{ id: crypto.randomUUID(), tag, body, author: user.name, likes: 0, replies: 0, date: new Date().toISOString().slice(0, 10), status: 'Approved' }, ...community]);
  };
  const likeCommunityPost = (id) => setCommunity(community.map((post) => post.id === id ? { ...post, likes: post.likes + 1 } : post));
  const toggleUserStatus = (id) => {
    const next = users.map((entry) => entry.id === id
      ? { ...entry, status: entry.status === 'Suspended' ? 'Active' : 'Suspended' } : entry);
    writeStorage(STORAGE_KEYS.users, next);
    setUsers(next);
  };
  const deleteUser = (id) => {
    const next = users.filter((entry) => entry.id !== id);
    writeStorage(STORAGE_KEYS.users, next);
    setUsers(next);
  };
  const recalculateLeaderboard = () => setLeaderboard([...leaderboard].sort((a, b) => b.points - a.points));
  const adjustLeaderboardPoints = (team, points) => setLeaderboard(leaderboard.map((entry) => entry.team === team ? { ...entry, points: Math.max(0, points) } : entry));

  const value = useMemo(() => ({
    tournaments, teams, matches, registrations, announcements, leaderboard, users, teamRequests, players, reports, community,
    registerForTournament, createTournament, updateTournament, deleteTournament,
    createTeam, requestTeamJoin, setTeamRequestStatus, updateTeam, deleteTeam, addMatch, updateMatch, setRegistrationStatus, deleteRegistration,
    publishAnnouncement, deleteAnnouncement, toggleUserStatus, deleteUser, recalculateLeaderboard, adjustLeaderboardPoints,
    resolveReport, setCommunityPostStatus, deleteCommunityPost, publishCommunityPost, likeCommunityPost,
  }), [tournaments, teams, matches, registrations, announcements, leaderboard, users, teamRequests, players, reports, community, user]);

  return <ArenaContext.Provider value={value}>{children}</ArenaContext.Provider>;
}

export function useArena() {
  const context = useContext(ArenaContext);
  if (!context) throw new Error('useArena must be used within ArenaProvider.');
  return context;
}
