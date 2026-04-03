import { createClient } from '@supabase/supabase-js'

// Import mock helpers for fallback
import {
  mockSignIn,
  mockSignUp,
  mockSignOut,
  mockGetUserProfile,
  mockUpsertProfile,
  mockFetchAppointments,
  mockFetchAllAppointments,
  mockAddAppointment,
  mockUpdateAppointment,
  mockDeleteAppointment,
  mockGetCurrentSession,
} from './mockHelpers'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('[SUPABASE] Environment variables loaded:')
console.log('  - VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
console.log('  - VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')

// Check if Supabase credentials are properly configured
// Must have valid URL and a real API key (should start with eyJ... or sb_publishable...)
export const isSupabaseConfigured = () => {
  const hasUrl = supabaseUrl && supabaseUrl.trim() !== '' && supabaseUrl.includes('supabase.co')
  const hasValidKey = supabaseAnonKey && supabaseAnonKey.trim() !== '' && (
    supabaseAnonKey.startsWith('eyJ') || supabaseAnonKey.startsWith('sb_publishable_')
  )
  const isConfigured = hasUrl && hasValidKey

  if (!isConfigured) {
    console.log('[SUPABASE] Not configured. Using mock mode.');
    console.log('  - URL:', hasUrl ? '✓' : '✗')
    console.log('  - Key:', hasValidKey ? '✓' : '✗')
    console.log('  - Key starts with:', supabaseAnonKey?.substring(0, 20) + '...')
  } else {
    console.log('[SUPABASE] ✓ Configured correctly. Using production mode.')
  }

  return isConfigured
}

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce', // More secure flow
        storage: {
          getItem: (key) => localStorage.getItem(key),
          setItem: (key, value) => localStorage.setItem(key, value),
          removeItem: (key) => localStorage.removeItem(key),
        },
      },
    })
  : null

console.log('[SUPABASE] Supabase client created:', supabase ? '✓ YES' : '✗ NO')

// Helpers with fallback to mock implementations
export const signIn = async ({ email, password }) => {
  if (!isSupabaseConfigured()) {
    return mockSignIn({ email, password })
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  } catch (err) {
    console.warn('supabase signin failed, falling back to mock:', err.message)
    return mockSignIn({ email, password })
  }
}

export const signUp = async ({ email, password }) => {
  console.log('[SUPABASE] signUp called with:', { email, password: '***' })
  console.log('[SUPABASE] isSupabaseConfigured():', isSupabaseConfigured())

  if (!isSupabaseConfigured()) {
    console.log('[SUPABASE] Using mock signup')
    return mockSignUp({ email, password })
  }

  console.log('[SUPABASE] Using real Supabase signup')
  try {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    })
    if (error) {
      console.error('[SUPABASE] Signup error:', error)
      throw error
    }
    console.log('[SUPABASE] Signup response:', data)
    
    // Check if user needs email confirmation
    if (data.user && !data.session) {
      console.log('[SUPABASE] Email confirmation required')
      // User needs to confirm email before they can sign in
      throw new Error('Por favor revisa tu email y confirma tu cuenta antes de continuar.')
    }
    
    console.log('[SUPABASE] Signup success:', data?.user?.id)
    return data.user
  } catch (err) {
    console.warn('[SUPABASE] Supabase signup failed:', err)
    
    // Check if it's a timeout/network error
    const isNetworkError = err.message?.includes('timeout') || 
                          err.message?.includes('network') || 
                          err.message?.includes('fetch') ||
                          err.message?.includes('Failed to fetch') ||
                          err.name === 'TypeError'
    
    if (isNetworkError) {
      console.log('[SUPABASE] Network error detected, using mock signup as fallback')
      return mockSignUp({ email, password })
    }
    
    // For auth errors (like email confirmation required), show proper message
    if (err.message?.includes('Email not confirmed') || err.message?.includes('confirm')) {
      throw new Error('Por favor revisa tu email y confirma tu cuenta antes de continuar.')
    }
    
    // Re-throw other auth errors
    throw err
  }
}

export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    return mockSignOut()
  }
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (err) {
    console.warn('supabase signout failed, falling back to mock:', err.message)
    return mockSignOut()
  }
}

export const getUserProfile = async (userId) => {
  if (!isSupabaseConfigured()) {
    return mockGetUserProfile(userId)
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (err) {
    console.warn('supabase getUserProfile failed, falling back to mock:', err.message)
    return mockGetUserProfile(userId)
  }
}

export const upsertProfile = async (profile) => {
  if (!isSupabaseConfigured()) {
    return mockUpsertProfile(profile)
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile, { returning: 'representation' })
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('supabase upsertProfile failed, falling back to mock:', err.message)
    return mockUpsertProfile(profile)
  }
}

export const fetchAppointments = async (userId) => {
  if (!isSupabaseConfigured()) {
    return mockFetchAppointments(userId)
  }
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, profiles(*)')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.warn('supabase fetchAppointments failed, falling back to mock:', err.message)
    return mockFetchAppointments(userId)
  }
}

export const fetchAllAppointments = async () => {
  if (!isSupabaseConfigured()) {
    return mockFetchAllAppointments()
  }
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, profiles(*)')
      .order('timestamp', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.warn('supabase fetchAllAppointments failed, falling back to mock:', err.message)
    return mockFetchAllAppointments()
  }
}

export const addAppointment = async (appt) => {
  if (!isSupabaseConfigured()) {
    return mockAddAppointment(appt)
  }
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appt)
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('supabase addAppointment failed, falling back to mock:', err.message)
    return mockAddAppointment(appt)
  }
}

export const updateAppointment = async (id, updates) => {
  if (!isSupabaseConfigured()) {
    return mockUpdateAppointment(id, updates)
  }
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('supabase updateAppointment failed, falling back to mock:', err.message)
    return mockUpdateAppointment(id, updates)
  }
}

export const deleteAppointment = async (id) => {
  if (!isSupabaseConfigured()) {
    return mockDeleteAppointment(id)
  }
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    if (error) throw error
  } catch (err) {
    console.warn('supabase deleteAppointment failed, falling back to mock:', err.message)
    return mockDeleteAppointment(id)
  }
}

export const getCurrentSession = async () => {
  if (!isSupabaseConfigured()) {
    return mockGetCurrentSession()
  }
  try {
    // Primero obtiene la sesión actual
    const {
      data: { session },
    } = await supabase.auth.getSession()
    
    // Si hay una sesión válida, intenta refrescar el token
    if (session) {
      await supabase.auth.refreshSession()
    }
    
    return session?.user || null
  } catch (err) {
    console.warn('getCurrentSession supabase error', err)
    return null
  }
}

// Nueva función para esperar a que Supabase esté listo e hidrate la sesión
export const initializeSession = async () => {
  if (!isSupabaseConfigured()) {
    console.log('[SESSION] Using mock session');
    return mockGetCurrentSession()
  }
  
  try {
    console.log('[SESSION] Initializing Supabase session...');
    
    // Espera un poco para que Supabase cargue la sesión desde localStorage
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const {
      data: { session },
    } = await supabase.auth.getSession()
    
    console.log('[SESSION] Got session:', session?.user?.id ? 'YES' : 'NO');
    
    if (session?.user) {
      // Refrescar token si existe
      try {
        await supabase.auth.refreshSession()
        console.log('[SESSION] Token refreshed');
      } catch (e) {
        console.warn('[SESSION] Token refresh failed:', e)
      }
    }
    
    // Log localStorage state
    const keys = Object.keys(localStorage);
    console.log('[SESSION] localStorage keys:', keys.filter(k => k.includes('auth') || k.includes('anela')));
    
    return session?.user || null
  } catch (err) {
    console.warn('[SESSION] initializeSession error', err)
    return null
  }
}
