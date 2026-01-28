// Server-side in-memory storage for mock data
// This is used when API routes need to access mock data that's stored in browser localStorage

import type { Event } from '@/lib/types';
import type { Guest } from '@/lib/types';

// In-memory stores (cleared on server restart)
const serverStores = {
  events: new Map<string, Event>(),
  guests: new Map<string, Guest>(),
  initialized: false,
};

/**
 * Initialize server stores from a data payload
 * This should be called from the client before making API requests
 * or we can seed it from the seed data
 */
export function initializeServerStores(data: {
  events?: Event[];
  guests?: Guest[];
}) {
  if (data.events) {
    serverStores.events.clear();
    data.events.forEach(event => {
      serverStores.events.set(event.id, event);
    });
  }
  
  if (data.guests) {
    serverStores.guests.clear();
    data.guests.forEach(guest => {
      serverStores.guests.set(guest.id, guest);
    });
  }
  
  serverStores.initialized = true;
}

export function getServerEventsStore(): Map<string, Event> {
  return serverStores.events;
}

export function getServerGuestsStore(): Map<string, Guest> {
  return serverStores.guests;
}

export function isServerStoresInitialized(): boolean {
  return serverStores.initialized;
}
