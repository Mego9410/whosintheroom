// Data access layer for Guests
// This abstraction allows us to switch between mock data and database easily

import { USE_SUPABASE } from '@/lib/config/data-source';
import { getGuestsStore } from '@/lib/mock-data/guests';
import * as SupabaseGuests from '@/lib/data/supabase/guests';
import type { Guest, CreateGuestInput, UpdateGuestInput } from '@/lib/types';

// Use Supabase if enabled, otherwise use mock data
const useSupabase = USE_SUPABASE;

export async function getGuests(organizationId?: string): Promise<Guest[]> {
  if (useSupabase) {
    return SupabaseGuests.getGuests(organizationId);
  }
  // Mock data - return synchronously wrapped in Promise
  try {
    const store = getGuestsStore();
    const guests = organizationId ? store.getByOrganization(organizationId) : store.getAll();
    console.log('getGuests: Returning', guests.length, 'guests');
    return Promise.resolve(guests);
  } catch (error) {
    console.error('getGuests error:', error);
    return Promise.resolve([]);
  }
}

export async function getGuestById(id: string): Promise<Guest | null> {
  if (useSupabase) {
    return SupabaseGuests.getGuestById(id);
  }
  const store = getGuestsStore();
  return store.getById(id);
}

export async function getGuestByEmail(email: string, organizationId: string): Promise<Guest | null> {
  if (useSupabase) {
    return SupabaseGuests.getGuestByEmail(email, organizationId);
  }
  const store = getGuestsStore();
  return store.getByEmail(email, organizationId);
}

export async function createGuest(data: CreateGuestInput): Promise<Guest> {
  if (useSupabase) {
    return SupabaseGuests.createGuest(data);
  }
  const store = getGuestsStore();
  return store.create(data);
}

export async function updateGuest(id: string, data: UpdateGuestInput): Promise<Guest> {
  const updatedGuest = useSupabase
    ? await SupabaseGuests.updateGuest(id, data)
    : getGuestsStore().update(id, data);

  // Invalidate cache when guest data changes (works for both Supabase and mock data)
  try {
    // Delete metadata to force recalculation on next analysis
    const { deleteGuestMetadata } = await import('@/lib/data/guest-metadata');
    await deleteGuestMetadata(id).catch(() => {
      // Ignore errors if metadata doesn't exist
    });
  } catch (error) {
    // Ignore errors - cache invalidation is best effort
    console.warn('Failed to invalidate guest metadata cache:', error);
  }

  return updatedGuest;
}

export async function deleteGuest(id: string): Promise<void> {
  if (useSupabase) {
    return SupabaseGuests.deleteGuest(id);
  }
  const store = getGuestsStore();
  return store.delete(id);
}

export async function searchGuests(query: string): Promise<Guest[]> {
  if (useSupabase) {
    return SupabaseGuests.searchGuests(query);
  }
  const store = getGuestsStore();
  return store.search(query);
}

export async function filterGuests(filters: {
  organizationId?: string;
  company?: string;
  jobTitle?: string;
}): Promise<Guest[]> {
  if (useSupabase) {
    return SupabaseGuests.filterGuests(filters);
  }
  const store = getGuestsStore();
  return store.filter(filters);
}
