-- Waitlist table migration
-- Run this SQL in your Supabase SQL Editor to create the waitlist table

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  referral_source VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  notified_at TIMESTAMP, -- When they were notified about launch
  converted_at TIMESTAMP -- When they signed up for the product
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);

-- Enable Row Level Security (RLS) - allow public inserts for waitlist
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists, then create policy to allow anyone to insert into waitlist
DROP POLICY IF EXISTS "Allow public inserts to waitlist" ON waitlist;
CREATE POLICY "Allow public inserts to waitlist"
  ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Alternative: If RLS is causing issues, you can temporarily disable it for this table
-- (Not recommended for production, but useful for debugging)
-- ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- Optional: Create policy to allow authenticated users to read waitlist (for admin purposes)
-- Uncomment if you want to allow authenticated users to view the waitlist
-- CREATE POLICY "Allow authenticated users to read waitlist"
--   ON waitlist
--   FOR SELECT
--   TO authenticated
--   USING (true);
