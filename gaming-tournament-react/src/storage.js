import {
  initialAnnouncements,
  initialRegistrations,
  initialTournaments,
  SESSION_KEY,
  STORAGE_KEY,
} from './data'

const DEMO_ADMIN = {
  name: 'Alex Vance',
  email: 'admin@arenaelite.gg',
  password: 'Admin@123',
  role: 'admin',
}

function toHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure password hashing is unavailable in this browser.')
  }

  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: 120000 },
    keyMaterial,
    256,
  )
  return toHex(bits)
}

function createSalt() {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure random number generation is unavailable in this browser.')
  }
  return toHex(crypto.getRandomValues(new Uint8Array(16)))
}

export async function makeUser({ name, email, password, role = 'user' }) {
  const salt = createSalt()
  return {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    role,
    salt,
    passwordHash: await hashPassword(password, salt),
    joinedAt: new Date().toISOString(),
  }
}

export async function verifyPassword(user, password) {
  return user.passwordHash === await hashPassword(password, user.salt)
}

let initialization

export function initializeData() {
  if (!initialization) {
    initialization = (async () => {
      const saved = localStorage.getItem(STORAGE_KEY)
      let data

      if (saved) {
        data = JSON.parse(saved)
        if (
          !Array.isArray(data.users) ||
          !Array.isArray(data.tournaments) ||
          !Array.isArray(data.registrations) ||
          !Array.isArray(data.announcements)
        ) {
          throw new Error('Saved Arena Elite data is invalid. Clear this site’s local storage and reload.')
        }
      } else {
        data = {
          users: [],
          tournaments: initialTournaments,
          registrations: initialRegistrations,
          announcements: initialAnnouncements,
        }
      }

      if (!data.users.some((user) => user.role === 'admin')) {
        data.users.push(await makeUser(DEMO_ADMIN))
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return data
    })()
  }
  return initialization
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function readSession() {
  return localStorage.getItem(SESSION_KEY)
}

export function saveSession(userId) {
  localStorage.setItem(SESSION_KEY, userId)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
