import { readStorage, STORAGE_KEYS, writeStorage } from './storageService';

export const DEMO_ADMIN = {
  name: 'Alex Vance',
  email: 'admin@arenaelite.gg',
  password: 'Admin@123',
  role: 'admin',
};

export function signUp({ name, email, password, confirm, role }) {
  const fullName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (fullName.length < 2) throw new Error('Enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new Error('Enter a valid email address.');
  if (typeof password !== 'string' || password.length < 8) throw new Error('Password must be at least 8 characters long.');
  if (password !== confirm) throw new Error('Passwords do not match.');
  if (!['user', 'organizer'].includes(role)) throw new Error('Choose a valid account type.');
  const users = readStorage(STORAGE_KEYS.users, []);
  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }
  if (normalizedEmail === DEMO_ADMIN.email) {
    throw new Error('This email is reserved for the demo administrator.');
  }

  const user = {
    id: crypto.randomUUID(),
    name: fullName,
    email: normalizedEmail,
    password,
    role,
    status: 'Active',
    createdAt: new Date().toISOString(),
  };
  writeStorage(STORAGE_KEYS.users, [...users, user]);
  return user;
}

export function authenticate(email, password, selectedRole) {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    if (selectedRole && selectedRole !== 'admin') {
      throw new Error('These are administrator credentials. Select the Admin role to continue.');
    }
    return { id: 'demo-admin', name: DEMO_ADMIN.name, email: DEMO_ADMIN.email, role: 'admin' };
  }
  const user = readStorage(STORAGE_KEYS.users, []).find(
    (entry) => entry.email.toLowerCase() === normalizedEmail && entry.password === password,
  );
  if (!user) throw new Error('Email or password is incorrect.');
  if (selectedRole && user.role !== selectedRole) {
    const roleName = user.role === 'user' ? 'Competitor / User' : user.role[0].toUpperCase() + user.role.slice(1);
    throw new Error(`This account uses the ${roleName} role. Select that role to sign in.`);
  }
  if (user.status === 'Suspended') throw new Error('This account is suspended. Contact the portal administrator.');
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function saveSession(user) {
  writeStorage(STORAGE_KEYS.session, user);
}

export function getSession() {
  return readStorage(STORAGE_KEYS.session, null);
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEYS.session);
}

export function updateProfile(user, changes) {
  if (user.id === 'demo-admin') throw new Error('The demo administrator profile cannot be changed.');
  const users = readStorage(STORAGE_KEYS.users, []);
  const updatedUsers = users.map((entry) => entry.id === user.id ? { ...entry, ...changes } : entry);
  const updatedUser = updatedUsers.find((entry) => entry.id === user.id);
  if (!updatedUser) throw new Error('Your account could not be found.');
  writeStorage(STORAGE_KEYS.users, updatedUsers);
  const { password: _password, ...safeUser } = updatedUser;
  saveSession(safeUser);
  return safeUser;
}
