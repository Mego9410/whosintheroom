// Data access layer for Event-Guest relationships
// This abstraction allows us to switch between mock data and database easily

import { USE_SUPABASE } from '@/lib/config/data-source';
import { getEventGuestsStore } from '@/lib/mock-data/event-guests';
import * as SupabaseEventGuests from '@/lib/data/supabase/event-guests';
import type { EventGuest, CreateEventGuestInput, UpdateEventGuestInput, Guest, Event } from '@/lib/types';

// Use Supabase if enabled, otherwise use mock data
const useSupabase = USE_SUPABASE;

export async function getEventGuests(eventId: string): Promise<EventGuest[]> {
  if (useSupabase) {
    return SupabaseEventGuests.getEventGuests(eventId);
  }
  const store = getEventGuestsStore();
  return store.getByEvent(eventId);
}

export async function getGuestEvents(guestId: string): Promise<EventGuest[]> {
  if (useSupabase) {
    return SupabaseEventGuests.getGuestEvents(guestId);
  }
  const store = getEventGuestsStore();
  return store.getByGuest(guestId);
}

export async function getGuestsByEvent(eventId: string): Promise<Guest[]> {
  if (useSupabase) {
    return SupabaseEventGuests.getGuestsByEvent(eventId);
  }
  const store = getEventGuestsStore();
  return store.getGuestsByEvent(eventId);
}

export async function getEventsByGuest(guestId: string): Promise<Event[]> {
  if (useSupabase) {
    return SupabaseEventGuests.getEventsByGuest(guestId);
  }
  const store = getEventGuestsStore();
  return store.getEventsByGuest(guestId);
}

export async function assignGuestToEvent(data: CreateEventGuestInput): Promise<EventGuest> {
  if (useSupabase) {
    return SupabaseEventGuests.assignGuestToEvent(data);
  }
  const store = getEventGuestsStore();
  return store.assign(data);
}

export async function updateEventGuest(id: string, data: UpdateEventGuestInput): Promise<EventGuest> {
  if (useSupabase) {
    return SupabaseEventGuests.updateEventGuest(id, data);
  }
  const store = getEventGuestsStore();
  return store.update(id, data);
}

export async function removeGuestFromEvent(eventId: string, guestId: string): Promise<void> {
  if (useSupabase) {
    return SupabaseEventGuests.removeGuestFromEvent(eventId, guestId);
  }
  const store = getEventGuestsStore();
  return store.remove(eventId, guestId);
}

export async function bulkAssignGuestsToEvent(
  eventId: string,
  guestIds: string[],
  assignedBy: string
): Promise<EventGuest[]> {
  if (useSupabase) {
    return SupabaseEventGuests.bulkAssignGuestsToEvent(eventId, guestIds, assignedBy);
  }
  const store = getEventGuestsStore();
  return store.bulkAssign(eventId, guestIds, assignedBy);
}
