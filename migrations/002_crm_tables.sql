-- CRM Tables Migration
-- Run this SQL in your Supabase SQL Editor to create the CRM tables
-- This creates: organizations, events, guests, event_guests tables

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  job_title VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Unique constraint: email must be unique within an organization
  UNIQUE(organization_id, email)
);

-- Event-Guest junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS event_guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
  rsvp_status VARCHAR(50) DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'invited', 'accepted', 'declined', 'maybe')),
  check_in_status VARCHAR(50) DEFAULT 'not_checked_in' CHECK (check_in_status IN ('not_checked_in', 'checked_in')),
  notes TEXT,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Unique constraint: a guest can only be assigned once per event
  UNIQUE(event_id, guest_id)
);

-- Activity/Logs table (for activity feed)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL, -- e.g., 'guest_created', 'event_updated', 'guest_assigned'
  entity_type VARCHAR(50) NOT NULL, -- e.g., 'guest', 'event', 'event_guest'
  entity_id UUID NOT NULL,
  description TEXT,
  metadata JSONB, -- Additional data about the action
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_organization_id ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

CREATE INDEX IF NOT EXISTS idx_guests_organization_id ON guests(organization_id);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_created_by ON guests(created_by);

CREATE INDEX IF NOT EXISTS idx_event_guests_event_id ON event_guests(event_id);
CREATE INDEX IF NOT EXISTS idx_event_guests_guest_id ON event_guests(guest_id);
CREATE INDEX IF NOT EXISTS idx_event_guests_rsvp_status ON event_guests(rsvp_status);

CREATE INDEX IF NOT EXISTS idx_activity_logs_organization_id ON activity_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_guests_updated_at
  BEFORE UPDATE ON event_guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow authenticated users to manage their organization's data
-- Note: For now, we'll use a simple policy. In production, you'd want more granular control.

-- Organizations: Users can read/create/update their own organization
CREATE POLICY "Users can manage their organization"
  ON organizations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Events: Users can manage events in their organization
CREATE POLICY "Users can manage events in their organization"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Guests: Users can manage guests in their organization
CREATE POLICY "Users can manage guests in their organization"
  ON guests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Event Guests: Users can manage event-guest relationships
CREATE POLICY "Users can manage event guests"
  ON event_guests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Activity Logs: Users can read activity logs for their organization
CREATE POLICY "Users can read activity logs for their organization"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create activity logs"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- For development/testing: Allow anonymous access (disable in production)
-- Uncomment the lines below if you want to allow anonymous access during development
-- ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE events DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE guests DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE event_guests DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
