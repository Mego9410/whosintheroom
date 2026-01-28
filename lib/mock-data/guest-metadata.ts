// Mock data store for guest metadata (for when USE_SUPABASE=false)

import { LocalStorage } from '@/lib/storage/local-storage';
import type { GuestMetadata } from '@/lib/types/scoring';
import type { ImportanceScore, GuestEnrichment, ProfilePictureResult } from '@/lib/types/scoring';

const STORAGE_KEY = 'crm_guest_metadata';

export class GuestMetadataStore {
  private metadata: Map<string, GuestMetadata> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = LocalStorage.get<GuestMetadata[]>(STORAGE_KEY);
    if (stored && Array.isArray(stored)) {
      stored.forEach(meta => {
        this.metadata.set(meta.guest_id, meta);
      });
    }
  }

  private saveToStorage(): void {
    const metadataArray = Array.from(this.metadata.values());
    LocalStorage.set(STORAGE_KEY, metadataArray);
  }

  getByGuestId(guestId: string): GuestMetadata | null {
    return this.metadata.get(guestId) || null;
  }

  getAll(): GuestMetadata[] {
    return Array.from(this.metadata.values());
  }

  createOrUpdate(guestId: string, data: {
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
  }): GuestMetadata {
    const existing = this.metadata.get(guestId);
    const now = new Date().toISOString();

    const metadata: GuestMetadata = {
      id: existing?.id || `meta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      guest_id: guestId,
      importance_score: data.importance_score ?? existing?.importance_score ?? null,
      importance_reasoning: data.importance_reasoning ?? existing?.importance_reasoning ?? null,
      importance_factors: data.importance_factors ?? existing?.importance_factors ?? null,
      importance_calculated_at: data.importance_calculated_at ?? existing?.importance_calculated_at ?? null,
      importance_data_hash: data.importance_data_hash ?? existing?.importance_data_hash ?? null,
      industry: data.industry ?? existing?.industry ?? null,
      company_size_estimate: data.company_size_estimate ?? existing?.company_size_estimate ?? null,
      seniority_level: data.seniority_level ?? existing?.seniority_level ?? null,
      profile_picture_url: data.profile_picture_url ?? existing?.profile_picture_url ?? null,
      profile_picture_source: data.profile_picture_source ?? existing?.profile_picture_source ?? 'none',
      linkedin_url: existing?.linkedin_url ?? null,
      social_followers: existing?.social_followers ?? null,
      company_size: existing?.company_size ?? null,
      company_revenue: existing?.company_revenue ?? null,
      custom_tags: existing?.custom_tags ?? null,
      vip_status: existing?.vip_status ?? false,
      created_at: existing?.created_at || now,
      updated_at: now,
    };

    this.metadata.set(guestId, metadata);
    this.saveToStorage();
    return metadata;
  }

  delete(guestId: string): void {
    this.metadata.delete(guestId);
    this.saveToStorage();
  }
}

// Singleton instance
let guestMetadataStoreInstance: GuestMetadataStore | null = null;

export function getGuestMetadataStore(): GuestMetadataStore {
  if (!guestMetadataStoreInstance) {
    guestMetadataStoreInstance = new GuestMetadataStore();
  }
  return guestMetadataStoreInstance;
}
