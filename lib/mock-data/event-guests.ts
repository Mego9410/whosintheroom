import { EventGuest, CreateEventGuestInput, UpdateEventGuestInput } from '@/lib/types';
import { LocalStorage } from '@/lib/storage/local-storage';
import { getGuestsStore } from './guests';
import { getEventsStore } from './events';
import type { Guest } from '@/lib/types';
import type { Event } from '@/lib/types';

const STORAGE_KEY = 'crm_event_guests';

export class EventGuestsStore {
  private relationships: Map<string, EventGuest> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = LocalStorage.get<EventGuest[]>(STORAGE_KEY);
    if (stored && Array.isArray(stored)) {
      stored.forEach(rel => {
        const key = `${rel.event_id}_${rel.guest_id}`;
        this.relationships.set(key, rel);
      });
    }
  }

  private saveToStorage(): void {
    const relationshipsArray = Array.from(this.relationships.values());
    LocalStorage.set(STORAGE_KEY, relationshipsArray);
  }

  getAll(): EventGuest[] {
    return Array.from(this.relationships.values());
  }

  getById(id: string): EventGuest | null {
    return Array.from(this.relationships.values()).find(rel => rel.id === id) || null;
  }

  getByEvent(eventId: string): EventGuest[] {
    return Array.from(this.relationships.values()).filter(rel => rel.event_id === eventId);
  }

  getByGuest(guestId: string): EventGuest[] {
    return Array.from(this.relationships.values()).filter(rel => rel.guest_id === guestId);
  }

  getGuestsByEvent(eventId: string): Guest[] {
    const relationships = this.getByEvent(eventId);
    const guestsStore = getGuestsStore();
    return relationships
      .map(rel => guestsStore.getById(rel.guest_id))
      .filter((guest): guest is Guest => guest !== null);
  }

  getEventsByGuest(guestId: string): Event[] {
    const relationships = this.getByGuest(guestId);
    const eventsStore = getEventsStore();
    return relationships
      .map(rel => eventsStore.getById(rel.event_id))
      .filter((event): event is Event => event !== null);
  }

  assign(data: CreateEventGuestInput): EventGuest {
    const key = `${data.event_id}_${data.guest_id}`;
    
    // Check if relationship already exists
    if (this.relationships.has(key)) {
      throw new Error(`Guest is already assigned to this event`);
    }

    const now = new Date().toISOString();
    const relationship: EventGuest = {
      ...data,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };

    this.relationships.set(key, relationship);
    this.saveToStorage();
    return relationship;
  }

  update(id: string, data: UpdateEventGuestInput): EventGuest {
    const existing = Array.from(this.relationships.values()).find(rel => rel.id === id);
    if (!existing) {
      throw new Error(`Event-guest relationship with id ${id} not found`);
    }

    const updated: EventGuest = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString(),
    };

    const key = `${updated.event_id}_${updated.guest_id}`;
    this.relationships.set(key, updated);
    this.saveToStorage();
    return updated;
  }

  remove(eventId: string, guestId: string): void {
    const key = `${eventId}_${guestId}`;
    if (!this.relationships.has(key)) {
      throw new Error(`Guest is not assigned to this event`);
    }
    this.relationships.delete(key);
    this.saveToStorage();
  }

  bulkAssign(eventId: string, guestIds: string[], assignedBy: string): EventGuest[] {
    const results: EventGuest[] = [];
    const errors: string[] = [];

    guestIds.forEach(guestId => {
      try {
        const relationship = this.assign({
          event_id: eventId,
          guest_id: guestId,
          rsvp_status: 'pending',
          check_in_status: 'not_checked_in',
          assigned_by: assignedBy,
        });
        results.push(relationship);
      } catch (error) {
        errors.push(`Failed to assign guest ${guestId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    if (errors.length > 0) {
      console.warn('Some assignments failed:', errors);
    }

    return results;
  }

  private generateId(): string {
    return `evtgst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear all relationships (for testing/reset)
  clear(): void {
    this.relationships.clear();
    this.saveToStorage();
  }
}

// Singleton instance
let eventGuestsStoreInstance: EventGuestsStore | null = null;

export function getEventGuestsStore(): EventGuestsStore {
  if (!eventGuestsStoreInstance) {
    eventGuestsStoreInstance = new EventGuestsStore();
  }
  return eventGuestsStoreInstance;
}
