// Mock helpers for development when Supabase is not configured
// These store data in memory and localStorage for persistence

const STORAGE_USERS_KEY = 'anela_users'
const STORAGE_APPOINTMENTS_KEY = 'anela_appointments'
const STORAGE_SESSION_KEY = 'anela_session'

// In-memory database
let usersDB = []
let appointmentsDB = []

// Hydrate from localStorage on startup
const hydrate = () => {
  try {
    const stored = localStorage.getItem(STORAGE_USERS_KEY)
    usersDB = stored ? JSON.parse(stored) : []
    const storedAppts = localStorage.getItem(STORAGE_APPOINTMENTS_KEY)
    appointmentsDB = storedAppts ? JSON.parse(storedAppts) : []
  } catch (e) {
    console.log('hydrate error:', e)
  }
}

// Persist to localStorage
const persist = () => {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(usersDB))
    localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(appointmentsDB))
  } catch (e) {
    console.log('persist error:', e)
  }
}

hydrate()

export const mockSignIn = async ({ email, password }) => {
  const user = usersDB.find(u => u.email === email)
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password')
  }
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user))
  return { id: user.id, email: user.email }
}

export const mockSignUp = async ({ email, password }) => {
  const exists = usersDB.find(u => u.email === email)
  if (exists) {
    throw new Error('Email already registered')
  }
  const user = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    email,
    password,
    created_at: new Date().toISOString(),
  }
  usersDB.push(user)
  persist()
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user))
  return { id: user.id, email: user.email }
}

export const mockSignOut = async () => {
  localStorage.removeItem(STORAGE_SESSION_KEY)
}

export const mockGetUserProfile = async (userId) => {
  const user = usersDB.find(u => u.id === userId)
  return user || null
}

export const mockUpsertProfile = async (profile) => {
  const idx = usersDB.findIndex(u => u.id === profile.id)
  if (idx >= 0) {
    usersDB[idx] = { ...usersDB[idx], ...profile }
  } else {
    usersDB.push(profile)
  }
  persist()
  return profile
}

export const mockFetchAppointments = async (userId) => {
  return appointmentsDB.filter(a => a.user_id === userId)
}

export const mockAddAppointment = async (appt) => {
  const newAppt = {
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    ...appt,
  }
  appointmentsDB.push(newAppt)
  persist()
  return newAppt
}

export const mockUpdateAppointment = async (id, updates) => {
  const idx = appointmentsDB.findIndex(a => a.id === id)
  if (idx < 0) throw new Error('Appointment not found')
  appointmentsDB[idx] = { ...appointmentsDB[idx], ...updates }
  persist()
  return appointmentsDB[idx]
}

export const mockDeleteAppointment = async (id) => {
  appointmentsDB = appointmentsDB.filter(a => a.id !== id)
  persist()
}

export const mockGetCurrentSession = () => {
  try {
    const session = localStorage.getItem(STORAGE_SESSION_KEY)
    return session ? JSON.parse(session) : null
  } catch {
    return null
  }
}
