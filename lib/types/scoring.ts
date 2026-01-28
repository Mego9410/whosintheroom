// TypeScript types for guest analysis, scoring, and enrichment

export interface ImportanceFactors {
  jobTitle?: number;
  companySize?: number;
  industry?: number;
  seniority?: number;
  relationship?: number;
  eventRelevance?: number;
  [key: string]: number | undefined;
}

export interface ImportanceScore {
  score: number; // 0-100
  reasoning: string; // AI explanation
  factors: ImportanceFactors; // Breakdown by factor
}

export interface GuestEnrichment {
  industry?: string;
  company_size_estimate?: string; // "1-10", "11-50", "51-200", "201-500", "500+"
  seniority_level?: string; // "C-Level", "VP", "Director", "Manager", "Individual Contributor"
}

export interface ProfilePictureResult {
  url: string | null;
  source: 'gravatar' | 'linkedin' | 'none';
}

export interface GuestAnalysisResult {
  importance: ImportanceScore;
  enrichment: GuestEnrichment;
  profilePicture: ProfilePictureResult;
}

export interface GuestMetadata {
  id: string;
  guest_id: string;
  importance_score: number | null;
  importance_reasoning: string | null;
  importance_factors: ImportanceFactors | null;
  importance_calculated_at: string | null;
  importance_data_hash: string | null;
  industry: string | null;
  company_size_estimate: string | null;
  seniority_level: string | null;
  profile_picture_url: string | null;
  profile_picture_source: 'gravatar' | 'linkedin' | 'none' | null;
  linkedin_url: string | null;
  social_followers: number | null;
  company_size: number | null;
  company_revenue: number | null;
  custom_tags: string[] | null;
  vip_status: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScoringConfig {
  id: string;
  organization_id: string | null;
  event_id: string | null;
  prompt_template: string | null;
  system_prompt: string | null;
  model: string;
  temperature: number;
  created_at: string;
  updated_at: string;
}

// API Request/Response types
export interface AnalyzeGuestRequest {
  guestId: string;
  eventId?: string; // Optional event context
  forceRefresh?: boolean; // Skip cache
}

export interface AnalyzeGuestResponse {
  success: boolean;
  data?: GuestAnalysisResult;
  error?: string;
}

export interface AnalyzeEventGuestsRequest {
  eventId: string;
  forceRefresh?: boolean;
}

export interface AnalyzeEventGuestsResponse {
  success: boolean;
  total: number;
  processed: number;
  failed: number;
  results?: Array<{
    guestId: string;
    success: boolean;
    data?: GuestAnalysisResult;
    error?: string;
  }>;
}
