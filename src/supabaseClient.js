import { createClient } from '@supabase/supabase-js'

// read keys from the environment (see .env.example)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// true only when both keys are present. the app uses this to show a
// friendly setup notice instead of crashing when keys are missing.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// if keys are missing we still export a client built from harmless
// placeholders so imports don't throw at module load.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
