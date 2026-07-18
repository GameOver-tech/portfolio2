import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Check your environment variables.')
}

// Public client (anon key) — respects RLS.
// Admin users authenticate via supabase.auth.signInWithPassword() on the Login page.
// Once logged in, Supabase RLS policies with auth.role() = 'authenticated'
// grant full CRUD access — no service role key needed in the browser.
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// For backward compatibility with admin pages that import { adminSupabase }
export const adminSupabase = supabase
