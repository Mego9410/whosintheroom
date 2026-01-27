import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
// Service role key bypasses RLS - use this for server-side operations
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable. Please check your .env.local file.')
}

// Use service role key if available (bypasses RLS), otherwise fall back to anon key
const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey

if (!supabaseKey) {
  throw new Error('Missing Supabase key (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY). Please check your .env.local file.')
}

// Server-side Supabase client for API routes
// If using service role key, this bypasses RLS policies
export const supabase = createClient(supabaseUrl, supabaseKey)
