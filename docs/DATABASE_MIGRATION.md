# Database Migration Guide

This guide explains how to migrate from mock data to Supabase database.

## Prerequisites

1. A Supabase account and project
2. Supabase credentials configured in `.env.local`

## Migration Steps

### 1. Run the Database Migration

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy the contents of `migrations/002_crm_tables.sql`
4. Paste and run the SQL script
5. Verify tables were created: `organizations`, `events`, `guests`, `event_guests`, `activity_logs`

### 2. Enable Supabase in Your App

Add this to your `.env.local` file:

```env
NEXT_PUBLIC_USE_SUPABASE=true
```

### 3. Create a Default Organization

Before using the app, you need to create at least one organization. Run this in Supabase SQL Editor:

```sql
INSERT INTO organizations (id, name) 
VALUES ('org_default', 'Default Organization')
ON CONFLICT (id) DO NOTHING;
```

### 4. Test the Migration

1. Start your development server: `npm run dev`
2. Navigate to the dashboard
3. Create an event or guest
4. Verify data persists after page refresh
5. Check Supabase dashboard to see the data in tables

## Switching Back to Mock Data

To temporarily switch back to mock data (for testing), remove or set to false:

```env
NEXT_PUBLIC_USE_SUPABASE=false
```

## Data Migration

If you have existing mock data you want to migrate:

1. Export data from localStorage (check browser DevTools > Application > Local Storage)
2. Create a migration script to import into Supabase
3. Or manually create records through the UI

## Troubleshooting

### RLS Policy Errors

If you get permission errors, you may need to temporarily disable RLS for development:

```sql
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE guests DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_guests DISABLE ROW LEVEL SECURITY;
```

**Note:** Re-enable RLS before going to production!

### Missing Organization

If you see errors about missing organization_id, make sure you've created the default organization (step 3 above).

### Connection Errors

- Verify your Supabase URL and keys in `.env.local`
- Check that your Supabase project is active
- Ensure your network allows connections to Supabase
