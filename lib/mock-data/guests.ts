import { Guest, CreateGuestInput, UpdateGuestInput } from '@/lib/types';
import { LocalStorage } from '@/lib/storage/local-storage';
import { getServerGuestsStore } from '@/lib/storage/server-storage';

const STORAGE_KEY = 'crm_guests';

export class GuestsStore {
  private guests: Map<string, Guest> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    // Try browser localStorage first
    const stored = LocalStorage.get<Guest[]>(STORAGE_KEY);
    if (stored && Array.isArray(stored)) {
      stored.forEach(guest => {
        this.guests.set(guest.id, guest);
      });
    } else if (typeof window === 'undefined') {
      // On server, try server-side storage
      const serverStore = getServerGuestsStore();
      if (serverStore.size > 0) {
        serverStore.forEach((guest, id) => {
          this.guests.set(id, guest);
        });
      }
    }
  }

  private saveToStorage(): void {
    const guestsArray = Array.from(this.guests.values());
    LocalStorage.set(STORAGE_KEY, guestsArray);
  }

  getAll(): Guest[] {
    return Array.from(this.guests.values());
  }

  getById(id: string): Guest | null {
    return this.guests.get(id) || null;
  }

  getByOrganization(organizationId: string): Guest[] {
    return this.getAll().filter(guest => guest.organization_id === organizationId);
  }

  getByEmail(email: string, organizationId: string): Guest | null {
    return this.getAll().find(
      guest => guest.email.toLowerCase() === email.toLowerCase() && guest.organization_id === organizationId
    ) || null;
  }

  create(data: CreateGuestInput): Guest {
    // Check for email uniqueness within organization
    const existing = this.getByEmail(data.email, data.organization_id);
    if (existing) {
      throw new Error(`Guest with email ${data.email} already exists in this organization`);
    }

    const now = new Date().toISOString();
    const guest: Guest = {
      ...data,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };
    
    this.guests.set(guest.id, guest);
    this.saveToStorage();
    return guest;
  }

  update(id: string, data: UpdateGuestInput): Guest {
    const existing = this.guests.get(id);
    if (!existing) {
      throw new Error(`Guest with id ${id} not found`);
    }

    // Check email uniqueness if email is being updated
    if (data.email && data.email !== existing.email) {
      const emailExists = this.getByEmail(data.email, existing.organization_id);
      if (emailExists && emailExists.id !== id) {
        throw new Error(`Guest with email ${data.email} already exists in this organization`);
      }
    }

    const updated: Guest = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString(),
    };

    this.guests.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  delete(id: string): void {
    if (!this.guests.has(id)) {
      throw new Error(`Guest with id ${id} not found`);
    }
    this.guests.delete(id);
    this.saveToStorage();
  }

  search(query: string): Guest[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(guest =>
      guest.first_name.toLowerCase().includes(lowerQuery) ||
      guest.last_name.toLowerCase().includes(lowerQuery) ||
      guest.email.toLowerCase().includes(lowerQuery) ||
      guest.company?.toLowerCase().includes(lowerQuery) ||
      guest.job_title?.toLowerCase().includes(lowerQuery)
    );
  }

  filter(filters: {
    organizationId?: string;
    company?: string;
    jobTitle?: string;
  }): Guest[] {
    let results = this.getAll();

    if (filters.organizationId) {
      results = results.filter(guest => guest.organization_id === filters.organizationId);
    }

    if (filters.company) {
      results = results.filter(guest => 
        guest.company?.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters.jobTitle) {
      results = results.filter(guest => 
        guest.job_title?.toLowerCase().includes(filters.jobTitle!.toLowerCase())
      );
    }

    return results;
  }

  private generateId(): string {
    return `gst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear all guests (for testing/reset)
  clear(): void {
    this.guests.clear();
    this.saveToStorage();
  }
}

// Singleton instance
let guestsStoreInstance: GuestsStore | null = null;

export function getGuestsStore(): GuestsStore {
  if (!guestsStoreInstance) {
    guestsStoreInstance = new GuestsStore();
  }
  return guestsStoreInstance;
}
