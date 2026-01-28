// Configuration for data source (mock vs Supabase)
// Set USE_SUPABASE=true in .env.local to use Supabase, otherwise uses mock data

export const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
