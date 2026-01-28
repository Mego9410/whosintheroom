import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
// Service role key bypasses RLS - use this for server-side operations
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

// Use service role key if available (bypasses RLS), otherwise fall back to anon key
const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey

// Create client with placeholder values if env vars are missing (for build time)
// This allows the build to complete, but the API will fail at runtime if vars are missing
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseKey || 'placeholder-key'

// Server-side Supabase client for API routes
// If using service role key, this bypasses RLS policies
export const supabase = createClient(url, key)

// Helper function to validate environment variables at runtime
export function validateSupabaseConfig() {
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your environment configuration.')
  }
  if (!supabaseKey) {
    throw new Error('Missing Supabase key (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY). Please check your environment configuration.')
  }
}
