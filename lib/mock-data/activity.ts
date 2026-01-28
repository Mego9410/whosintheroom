// Activity feed mock data store

import { LocalStorage } from '@/lib/storage/local-storage';

export interface Activity {
  id: string;
  type: 'event_created' | 'event_updated' | 'guest_created' | 'guest_assigned' | 'guest_removed';
  description: string;
  entity_id: string;
  entity_type: 'event' | 'guest';
  created_at: string;
}

const STORAGE_KEY = 'crm_activity';

export class ActivityStore {
  private activities: Activity[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = LocalStorage.get<Activity[]>(STORAGE_KEY);
    if (stored && Array.isArray(stored)) {
      this.activities = stored;
    }
  }

  private saveToStorage(): void {
    LocalStorage.set(STORAGE_KEY, this.activities);
  }

  add(activity: Omit<Activity, 'id' | 'created_at'>): Activity {
    const newActivity: Activity = {
      ...activity,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    this.activities.unshift(newActivity);
    
    // Keep only last 100 activities
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(0, 100);
    }

    this.saveToStorage();
    return newActivity;
  }

  getAll(limit?: number): Activity[] {
    const activities = [...this.activities];
    return limit ? activities.slice(0, limit) : activities;
  }

  getRecent(limit: number = 10): Activity[] {
    return this.activities.slice(0, limit);
  }

  clear(): void {
    this.activities = [];
    this.saveToStorage();
  }
}

// Singleton instance
let activityStoreInstance: ActivityStore | null = null;

export function getActivityStore(): ActivityStore {
  if (!activityStoreInstance) {
    activityStoreInstance = new ActivityStore();
  }
  return activityStoreInstance;
}
