-- Simplified waitlist table migration (RLS disabled for easier setup)
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

-- Disable Row Level Security for this table (simpler setup)
-- You can enable RLS later and add policies if needed
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;
