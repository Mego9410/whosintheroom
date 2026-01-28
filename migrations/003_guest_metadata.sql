-- Guest Metadata Migration
-- Run this SQL in your Supabase SQL Editor to create the guest_metadata and scoring_config tables
-- This enables AI-powered guest analysis with importance scoring, enrichment, and profile pictures

-- Guest Metadata table (for importance calculation, enrichment, and caching)
CREATE TABLE IF NOT EXISTS guest_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE NOT NULL,
  
  -- OpenAI scoring results (cached)
  importance_score DECIMAL(5,2), -- 0-100 score
  importance_reasoning TEXT, -- AI explanation of score
  importance_factors JSONB, -- {jobTitle: 90, companySize: 80, ...}
  importance_calculated_at TIMESTAMP WITH TIME ZONE, -- When score was last calculated
  importance_data_hash VARCHAR(64), -- Hash of guest data used for cache invalidation
  
  -- Enrichment data (AI-discovered)
  industry VARCHAR(100), -- Detected industry classification
  company_size_estimate VARCHAR(50), -- e.g., "1-10", "11-50", "51-200", "201-500", "500+"
  seniority_level VARCHAR(50), -- e.g., "C-Level", "VP", "Director", "Manager", "Individual Contributor"
  
  -- Profile picture
  profile_picture_url VARCHAR(500), -- URL from Gravatar or LinkedIn
  profile_picture_source VARCHAR(20), -- "gravatar", "linkedin", or "none"
  
  -- Optional enrichment data (for premium tier - future)
  linkedin_url VARCHAR(500),
  social_followers INTEGER,
  company_size INTEGER,
  company_revenue BIGINT,
  custom_tags TEXT[],
  vip_status BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One metadata record per guest
  UNIQUE(guest_id)
);

-- Scoring Configuration table (for customizable prompts per organization/event)
CREATE TABLE IF NOT EXISTS scoring_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE, -- NULL for org-wide config
  prompt_template TEXT, -- Custom prompt template for OpenAI
  system_prompt TEXT, -- System prompt for OpenAI
  model VARCHAR(50) DEFAULT 'gpt-4o-mini', -- OpenAI model to use
  temperature DECIMAL(3,2) DEFAULT 0.0, -- For consistency
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One config per organization or event
  UNIQUE(organization_id, event_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_guest_metadata_guest_id ON guest_metadata(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_metadata_importance_score ON guest_metadata(importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_guest_metadata_industry ON guest_metadata(industry);
CREATE INDEX IF NOT EXISTS idx_guest_metadata_seniority_level ON guest_metadata(seniority_level);

CREATE INDEX IF NOT EXISTS idx_scoring_config_organization_id ON scoring_config(organization_id);
CREATE INDEX IF NOT EXISTS idx_scoring_config_event_id ON scoring_config(event_id);

-- Add updated_at trigger for guest_metadata
CREATE TRIGGER update_guest_metadata_updated_at
  BEFORE UPDATE ON guest_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for scoring_config
CREATE TRIGGER update_scoring_config_updated_at
  BEFORE UPDATE ON scoring_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE guest_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow authenticated users to manage metadata for their organization's guests
CREATE POLICY "Users can manage guest metadata for their organization"
  ON guest_metadata
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_metadata.guest_id
      AND guests.organization_id IN (
        SELECT id FROM organizations
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_metadata.guest_id
      AND guests.organization_id IN (
        SELECT id FROM organizations
      )
    )
  );

-- RLS Policies: Allow authenticated users to manage scoring config for their organization
CREATE POLICY "Users can manage scoring config for their organization"
  ON scoring_config
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
