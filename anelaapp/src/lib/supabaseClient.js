import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('[SUPABASE] Environment variables loaded:')
console.log('  - VITE_SUPABASE_URL:', supabaseUrl || 'MISSING')
console.log('  - VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 8)}...` : 'MISSING')

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

const assertSupabaseConfigured = () => {
  if (!supabase) {
    throw new Error('Supabase no está configurado. El modo local ha sido desactivado.')
  }
}

export const signIn = async ({ email, password }) => {
  assertSupabaseConfigured()
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('[SUPABASE] signIn error:', error)
      throw error
    }

    console.log('[SUPABASE] signIn success:', data)
    return data.user
  } catch (err) {
    console.error('[SUPABASE] supabase signin failed:', err)
    throw err
  }
}

export const signUp = async ({ email, password }) => {
  console.log('[SUPABASE] signUp called with:', { email, password: '***' })
  console.log('[SUPABASE] isSupabaseConfigured():', isSupabaseConfigured())

  assertSupabaseConfigured()

  console.log('[SUPABASE] Using real Supabase signup')
  try {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
    })
    console.log('[SUPABASE] Signup raw response:', { data, error })
    if (error) {
      console.error('[SUPABASE] Signup error:', error)
      throw error
    }

    if (data?.user && !data?.session) {
      console.warn('[SUPABASE] Signup created a user but no session was returned. Email confirmation may be required.')
      return data.user
    }

    console.log('[SUPABASE] Signup success:', data?.user?.id, 'session:', !!data?.session)
    return data.user
  } catch (err) {
    console.warn('[SUPABASE] Supabase signup failed:', err)
    
    if (err?.message?.includes('Email not confirmed') || err?.message?.includes('confirm')) {
      throw new Error('Por favor revisa tu email y confirma tu cuenta antes de continuar.')
    }
    
    throw err
  }
}

export const signOut = async () => {
  assertSupabaseConfigured()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getUserProfile = async (userId) => {
  assertSupabaseConfigured()
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);
      
    if (error) throw error;
    
    // Si encontramos el usuario, devolvemos el primero. Si no, devolvemos null.
    return data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error('[SUPABASE] error en getUserProfile:', err);
    return null;
  }
}

export const upsertProfile = async (profile) => {
  assertSupabaseConfigured()
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { returning: 'representation' })
    .single()
  if (error) throw error
  return data
}

export const fetchAppointments = async (userId) => {
  assertSupabaseConfigured()

  const attemptFetch = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, profiles(*)')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
    if (error) throw error
    return data
  }

  try {
    return await attemptFetch()
  } catch (err) {
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      console.warn('[SUPABASE] fetchAppointments aborted, retrying once...')
      await new Promise(resolve => setTimeout(resolve, 150))
      return await attemptFetch()
    }
    console.error('supabase fetchAppointments failed:', err.message, err)
    throw err
  }
}

export const fetchAllAppointments = async () => {
  assertSupabaseConfigured()

  const attemptFetch = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, profiles(*)')
      .order('timestamp', { ascending: false })
    if (error) throw error
    return data
  }

  try {
    return await attemptFetch()
  } catch (err) {
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      console.warn('[SUPABASE] fetchAllAppointments aborted, retrying once...')
      await new Promise(resolve => setTimeout(resolve, 150))
      return await attemptFetch()
    }
    console.error('supabase fetchAllAppointments failed:', err.message, err)
    throw err
  }
}

export const addAppointment = async (appt) => {
  assertSupabaseConfigured()
  // Quitamos el .single() para que devuelva un array con el objeto insertado
  const { data, error } = await supabase
    .from('appointments')
    .insert(appt)
    .select(); // <--- Usar .select() es la forma moderna en Supabase v2
    
  if (error) {
    console.error('supabase addAppointment error:', error, 'payload:', appt)
    throw error
  }
  
  // Devolvemos el primer elemento insertado
  return data && data.length > 0 ? data[0] : null;
}

export const updateAppointment = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select(); // Usamos .select() en lugar de .single()

    if (error) throw error;
    
    // Como .select() devuelve una lista, mandamos el primer elemento [0]
    return data && data.length > 0 ? data[0] : null; 
  } catch (error) {
    console.error('Error en updateAppointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  assertSupabaseConfigured()
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export const getCurrentSession = async () => {
  if (!supabase) {
    console.warn('[SESSION] Supabase no está configurado. No se puede obtener sesión.')
    return null
  }
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
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
  if (!supabase) {
    console.warn('[SESSION] Supabase no está configurado. No se puede inicializar la sesión.')
    return null
  }

  try {
    console.log('[SESSION] Initializing Supabase session...');
    await new Promise(resolve => setTimeout(resolve, 100))
    const {
      data: { session },
    } = await supabase.auth.getSession()
    console.log('[SESSION] Got session:', session?.user?.id ? 'YES' : 'NO');
    if (session?.user) {
      try {
        await supabase.auth.refreshSession()
        console.log('[SESSION] Token refreshed');
      } catch (e) {
        console.warn('[SESSION] Token refresh failed:', e)
      }
    }
    const keys = Object.keys(localStorage);
    console.log('[SESSION] localStorage keys:', keys.filter(k => k.includes('auth') || k.includes('anela')));
    return session?.user || null
  } catch (err) {
    console.warn('[SESSION] initializeSession error', err)
    return null
  }
}
