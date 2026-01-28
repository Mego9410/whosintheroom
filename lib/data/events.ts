// Data access layer for Events
// This abstraction allows us to switch between mock data and database easily

import { USE_SUPABASE } from '@/lib/config/data-source';
import { getEventsStore } from '@/lib/mock-data/events';
import * as SupabaseEvents from '@/lib/data/supabase/events';
import type { Event, CreateEventInput, UpdateEventInput } from '@/lib/types';

// Use Supabase if enabled, otherwise use mock data
const useSupabase = USE_SUPABASE;

export async function getEvents(organizationId?: string): Promise<Event[]> {
  if (useSupabase) {
    return SupabaseEvents.getEvents(organizationId);
  }
  // Mock data - return synchronously wrapped in Promise
  try {
    const store = getEventsStore();
    const events = organizationId ? store.getByOrganization(organizationId) : store.getAll();
    console.log('getEvents: Returning', events.length, 'events');
    return Promise.resolve(events);
  } catch (error) {
    console.error('getEvents error:', error);
    return Promise.resolve([]);
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  if (useSupabase) {
    return SupabaseEvents.getEventById(id);
  }
  const store = getEventsStore();
  const event = store.getById(id);
  console.log('getEventById:', { id, found: !!event, eventName: event?.name });
  return event;
}

export async function createEvent(data: CreateEventInput): Promise<Event> {
  if (useSupabase) {
    return SupabaseEvents.createEvent(data);
  }
  const store = getEventsStore();
  return store.create(data);
}

export async function updateEvent(id: string, data: UpdateEventInput): Promise<Event> {
  if (useSupabase) {
    return SupabaseEvents.updateEvent(id, data);
  }
  const store = getEventsStore();
  return store.update(id, data);
}

export async function deleteEvent(id: string): Promise<void> {
  if (useSupabase) {
    return SupabaseEvents.deleteEvent(id);
  }
  const store = getEventsStore();
  return store.delete(id);
}

export async function searchEvents(query: string): Promise<Event[]> {
  if (useSupabase) {
    return SupabaseEvents.searchEvents(query);
  }
  const store = getEventsStore();
  return store.search(query);
}

export async function filterEvents(filters: {
  status?: Event['status'];
  organizationId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Event[]> {
  if (useSupabase) {
    return SupabaseEvents.filterEvents(filters);
  }
  const store = getEventsStore();
  return store.filter(filters);
}
