// Profile picture fetching service (Gravatar + LinkedIn)

import crypto from 'crypto';
import type { ProfilePictureResult } from '@/lib/types/scoring';

/**
 * Generate MD5 hash for Gravatar
 */
function md5Hash(text: string): string {
  return crypto.createHash('md5').update(text.toLowerCase().trim()).digest('hex');
}

/**
 * Generate Gravatar URL from email
 */
function getGravatarUrl(email: string, size: number = 200): string {
  const hash = md5Hash(email);
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=${size}`;
}

/**
 * Check if a URL returns a valid image (not 404)
 */
async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

/**
 * Fetch profile picture from Gravatar
 */
export async function fetchGravatarPicture(email: string): Promise<ProfilePictureResult | null> {
  if (!email) {
    return null;
  }

  try {
    const gravatarUrl = getGravatarUrl(email);
    const exists = await checkImageExists(gravatarUrl);
    
    if (exists) {
      return {
        url: gravatarUrl,
        source: 'gravatar',
      };
    }
  } catch (error) {
    console.error('Error fetching Gravatar:', error);
  }

  return null;
}

/**
 * Attempt to fetch profile picture from LinkedIn
 * Note: LinkedIn profile picture fetching without official API is limited.
 * This is a placeholder for future implementation with LinkedIn API.
 */
export async function fetchLinkedInPicture(linkedinUrl?: string | null): Promise<ProfilePictureResult | null> {
  if (!linkedinUrl) {
    return null;
  }

  // TODO: Implement LinkedIn profile picture fetching
  // This would require LinkedIn API access or web scraping (not recommended)
  // For now, return null and let Gravatar be the primary source
  
  return null;
}

/**
 * Fetch profile picture from multiple sources (Gravatar first, then LinkedIn)
 */
export async function fetchProfilePicture(
  email: string,
  linkedinUrl?: string | null
): Promise<ProfilePictureResult> {
  // Try Gravatar first (most reliable, free)
  const gravatarResult = await fetchGravatarPicture(email);
  if (gravatarResult) {
    return gravatarResult;
  }

  // Try LinkedIn if Gravatar fails
  const linkedinResult = await fetchLinkedInPicture(linkedinUrl);
  if (linkedinResult) {
    return linkedinResult;
  }

  // No picture found
  return {
    url: null,
    source: 'none',
  };
}
