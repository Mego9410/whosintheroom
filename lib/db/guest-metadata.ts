// Database operations for guest metadata (importance scores, enrichment, profile pictures)

import { supabase } from '@/lib/supabase/client';
import type { GuestMetadata } from '@/lib/types/scoring';
import type { ImportanceScore, GuestEnrichment, ProfilePictureResult } from '@/lib/types/scoring';

export async function getGuestMetadata(guestId: string): Promise<GuestMetadata | null> {
  const { data, error } = await supabase
    .from('guest_metadata')
    .select('*')
    .eq('guest_id', guestId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching guest metadata:', error);
    throw new Error(`Failed to fetch guest metadata: ${error.message}`);
  }

  return data ? mapMetadataFromDb(data) : null;
}

export async function createOrUpdateGuestMetadata(
  guestId: string,
  data: {
    importance_score?: number | null;
    importance_reasoning?: string | null;
    importance_factors?: any | null;
    importance_calculated_at?: string | null;
    importance_data_hash?: string | null;
    industry?: string | null;
    company_size_estimate?: string | null;
    seniority_level?: string | null;
    profile_picture_url?: string | null;
    profile_picture_source?: 'gravatar' | 'linkedin' | 'none' | null;
  }
): Promise<GuestMetadata> {
  // Check if metadata exists
  const existing = await getGuestMetadata(guestId);

  if (existing) {
    // Update existing metadata
    const { data: updatedData, error } = await supabase
      .from('guest_metadata')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('guest_id', guestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating guest metadata:', error);
      throw new Error(`Failed to update guest metadata: ${error.message}`);
    }

    return mapMetadataFromDb(updatedData);
  } else {
    // Create new metadata
    const { data: newData, error } = await supabase
      .from('guest_metadata')
      .insert({
        guest_id: guestId,
        ...data,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating guest metadata:', error);
      throw new Error(`Failed to create guest metadata: ${error.message}`);
    }

    return mapMetadataFromDb(newData);
  }
}

export async function saveImportanceScore(
  guestId: string,
  score: ImportanceScore,
  dataHash: string
): Promise<GuestMetadata> {
  return createOrUpdateGuestMetadata(guestId, {
    importance_score: score.score,
    importance_reasoning: score.reasoning,
    importance_factors: score.factors,
    importance_calculated_at: new Date().toISOString(),
    importance_data_hash: dataHash,
  });
}

export async function saveEnrichmentData(
  guestId: string,
  enrichment: GuestEnrichment
): Promise<GuestMetadata> {
  return createOrUpdateGuestMetadata(guestId, {
    industry: enrichment.industry || null,
    company_size_estimate: enrichment.company_size_estimate || null,
    seniority_level: enrichment.seniority_level || null,
  });
}

export async function saveProfilePicture(
  guestId: string,
  profilePicture: ProfilePictureResult
): Promise<GuestMetadata> {
  return createOrUpdateGuestMetadata(guestId, {
    profile_picture_url: profilePicture.url || null,
    profile_picture_source: profilePicture.source,
  });
}

export async function saveFullAnalysis(
  guestId: string,
  score: ImportanceScore,
  enrichment: GuestEnrichment,
  profilePicture: ProfilePictureResult,
  dataHash: string
): Promise<GuestMetadata> {
  return createOrUpdateGuestMetadata(guestId, {
    importance_score: score.score,
    importance_reasoning: score.reasoning,
    importance_factors: score.factors,
    importance_calculated_at: new Date().toISOString(),
    importance_data_hash: dataHash,
    industry: enrichment.industry || null,
    company_size_estimate: enrichment.company_size_estimate || null,
    seniority_level: enrichment.seniority_level || null,
    profile_picture_url: profilePicture.url || null,
    profile_picture_source: profilePicture.source,
  });
}

export async function deleteGuestMetadata(guestId: string): Promise<void> {
  const { error } = await supabase
    .from('guest_metadata')
    .delete()
    .eq('guest_id', guestId);

  if (error) {
    console.error('Error deleting guest metadata:', error);
    throw new Error(`Failed to delete guest metadata: ${error.message}`);
  }
}

// Helper function to map database row to GuestMetadata type
function mapMetadataFromDb(row: any): GuestMetadata {
  return {
    id: row.id,
    guest_id: row.guest_id,
    importance_score: row.importance_score,
    importance_reasoning: row.importance_reasoning,
    importance_factors: row.importance_factors,
    importance_calculated_at: row.importance_calculated_at,
    importance_data_hash: row.importance_data_hash,
    industry: row.industry,
    company_size_estimate: row.company_size_estimate,
    seniority_level: row.seniority_level,
    profile_picture_url: row.profile_picture_url,
    profile_picture_source: row.profile_picture_source,
    linkedin_url: row.linkedin_url,
    social_followers: row.social_followers,
    company_size: row.company_size,
    company_revenue: row.company_revenue,
    custom_tags: row.custom_tags,
    vip_status: row.vip_status || false,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
