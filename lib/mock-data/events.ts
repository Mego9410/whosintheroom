import { Event, CreateEventInput, UpdateEventInput } from '@/lib/types';
import { LocalStorage } from '@/lib/storage/local-storage';
import { getServerEventsStore } from '@/lib/storage/server-storage';

const STORAGE_KEY = 'crm_events';

export class EventsStore {
  private events: Map<string, Event> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    // Try browser localStorage first
    const stored = LocalStorage.get<Event[]>(STORAGE_KEY);
    if (stored && Array.isArray(stored)) {
      stored.forEach(event => {
        this.events.set(event.id, event);
      });
    } else if (typeof window === 'undefined') {
      // On server, try server-side storage
      const serverStore = getServerEventsStore();
      if (serverStore.size > 0) {
        serverStore.forEach((event, id) => {
          this.events.set(id, event);
        });
      }
    }
  }

  private saveToStorage(): void {
    const eventsArray = Array.from(this.events.values());
    LocalStorage.set(STORAGE_KEY, eventsArray);
  }

  getAll(): Event[] {
    return Array.from(this.events.values());
  }

  getById(id: string): Event | null {
    return this.events.get(id) || null;
  }

  getByOrganization(organizationId: string): Event[] {
    return this.getAll().filter(event => event.organization_id === organizationId);
  }

  create(data: CreateEventInput): Event {
    const now = new Date().toISOString();
    const event: Event = {
      ...data,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    this.events.set(event.id, event);
    this.saveToStorage();
    return event;
  }

  update(id: string, data: UpdateEventInput): Event {
    const existing = this.events.get(id);
    if (!existing) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updated: Event = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString(),
    };

    this.events.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  delete(id: string): void {
    if (!this.events.has(id)) {
      throw new Error(`Event with id ${id} not found`);
    }
    this.events.delete(id);
    this.saveToStorage();
  }

  search(query: string): Event[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(event =>
      event.name.toLowerCase().includes(lowerQuery) ||
      event.location.toLowerCase().includes(lowerQuery) ||
      event.description?.toLowerCase().includes(lowerQuery)
    );
  }

  filter(filters: {
    status?: Event['status'];
    organizationId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Event[] {
    let results = this.getAll();

    if (filters.status) {
      results = results.filter(event => event.status === filters.status);
    }

    if (filters.organizationId) {
      results = results.filter(event => event.organization_id === filters.organizationId);
    }

    if (filters.dateFrom) {
      results = results.filter(event => event.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      results = results.filter(event => event.date <= filters.dateTo!);
    }

    return results;
  }

  private generateId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear all events (for testing/reset)
  clear(): void {
    this.events.clear();
    this.saveToStorage();
  }
}

// Singleton instance
let eventsStoreInstance: EventsStore | null = null;

export function getEventsStore(): EventsStore {
  if (!eventsStoreInstance) {
    eventsStoreInstance = new EventsStore();
  }
  return eventsStoreInstance;
}
