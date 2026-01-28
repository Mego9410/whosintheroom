// Data access layer for guest metadata
// This abstraction allows us to switch between mock data and database easily

import { USE_SUPABASE } from '@/lib/config/data-source';
import { getGuestMetadata as getSupabaseGuestMetadata, saveFullAnalysis as saveSupabaseFullAnalysis } from '@/lib/db/guest-metadata';
import { getGuestMetadataStore } from '@/lib/mock-data/guest-metadata';
import type { GuestMetadata } from '@/lib/types/scoring';
import type { ImportanceScore, GuestEnrichment, ProfilePictureResult } from '@/lib/types/scoring';

const useSupabase = USE_SUPABASE;

export async function getGuestMetadata(guestId: string): Promise<GuestMetadata | null> {
  if (useSupabase) {
    return getSupabaseGuestMetadata(guestId);
  }
  // Mock data mode - get from localStorage
  const store = getGuestMetadataStore();
  return store.getByGuestId(guestId);
}

/**
 * Fetch metadata for multiple guests
 */
export async function getGuestsMetadata(guestIds: string[]): Promise<Map<string, GuestMetadata>> {
  const metadataMap = new Map<string, GuestMetadata>();
  
  if (useSupabase) {
    for (const guestId of guestIds) {
      try {
        const metadata = await getGuestMetadata(guestId);
        if (metadata) {
          metadataMap.set(guestId, metadata);
        }
      } catch (error) {
        // Silently skip errors (e.g., invalid UUID format in mock data mode)
        console.warn(`Skipping metadata fetch for guest ${guestId}:`, error);
      }
    }
  } else {
    // Mock data mode - get from localStorage
    const store = getGuestMetadataStore();
    for (const guestId of guestIds) {
      const metadata = store.getByGuestId(guestId);
      if (metadata) {
        metadataMap.set(guestId, metadata);
      }
    }
  }
  
  return metadataMap;
}

/**
 * Save full analysis results (importance score, enrichment, profile picture)
 */
export async function saveFullAnalysis(
  guestId: string,
  score: ImportanceScore,
  enrichment: GuestEnrichment,
  profilePicture: ProfilePictureResult,
  dataHash: string
): Promise<GuestMetadata> {
  if (useSupabase) {
    return saveSupabaseFullAnalysis(guestId, score, enrichment, profilePicture, dataHash);
  }
  
  // Mock data mode - save to localStorage
  const store = getGuestMetadataStore();
  return store.createOrUpdate(guestId, {
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

/**
 * Delete guest metadata
 */
export async function deleteGuestMetadata(guestId: string): Promise<void> {
  if (useSupabase) {
    const { deleteGuestMetadata: deleteSupabaseMetadata } = await import('@/lib/db/guest-metadata');
    return deleteSupabaseMetadata(guestId);
  }
  
  // Mock data mode - delete from localStorage
  const store = getGuestMetadataStore();
  store.delete(guestId);
}
