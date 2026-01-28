// Core types for the CRM platform

export interface Event {
  id: string;
  organization_id: string;
  name: string;
  date: string; // ISO timestamp
  location: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  job_title?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EventGuest {
  id: string;
  event_id: string;
  guest_id: string;
  rsvp_status: 'pending' | 'invited' | 'accepted' | 'declined' | 'maybe';
  check_in_status: 'not_checked_in' | 'checked_in';
  notes?: string;
  assigned_by: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Input types for creating/updating
export type CreateEventInput = Omit<Event, 'id' | 'created_at' | 'updated_at'>;
export type UpdateEventInput = Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>;

export type CreateGuestInput = Omit<Guest, 'id' | 'created_at' | 'updated_at'>;
export type UpdateGuestInput = Partial<Omit<Guest, 'id' | 'created_at' | 'updated_at'>>;

export type CreateEventGuestInput = Omit<EventGuest, 'id' | 'created_at' | 'updated_at'>;
export type UpdateEventGuestInput = Partial<Omit<EventGuest, 'id' | 'created_at' | 'updated_at'>>;
