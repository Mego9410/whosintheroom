// Caching utilities for importance scores

import crypto from 'crypto';
import type { Guest } from '@/lib/types';
import { getGuestMetadata } from '@/lib/data/guest-metadata';

/**
 * Generate a hash from guest data for cache invalidation
 */
export function generateDataHash(guest: Guest): string {
  const dataToHash = [
    guest.first_name,
    guest.last_name,
    guest.email,
    guest.company || '',
    guest.job_title || '',
    guest.notes || '',
  ].join('|');

  return crypto.createHash('sha256').update(dataToHash).digest('hex');
}

/**
 * Check if cached score is still valid
 */
export async function getCachedScore(
  guestId: string,
  currentDataHash: string
): Promise<{
  isValid: boolean;
  metadata: any | null;
}> {
  const metadata = await getGuestMetadata(guestId);

  if (!metadata || !metadata.importance_score || !metadata.importance_data_hash) {
    return { isValid: false, metadata: null };
  }

  // Check if data hash matches (data hasn't changed)
  const isValid = metadata.importance_data_hash === currentDataHash;

  return {
    isValid,
    metadata: isValid ? metadata : null,
  };
}

/**
 * Check if cache should be refreshed (based on TTL)
 */
export function shouldRefreshCache(calculatedAt: string | null, ttlDays: number = 30): boolean {
  if (!calculatedAt) {
    return true;
  }

  const calculatedDate = new Date(calculatedAt);
  const now = new Date();
  const daysSinceCalculation = (now.getTime() - calculatedDate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceCalculation > ttlDays;
}
