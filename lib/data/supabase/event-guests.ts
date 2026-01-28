// Supabase data access layer for Event-Guest relationships
import { supabase } from '@/lib/supabase/client';
import type { EventGuest, CreateEventGuestInput, UpdateEventGuestInput, Guest, Event } from '@/lib/types';

export async function getEventGuests(eventId: string): Promise<EventGuest[]> {
  const { data, error } = await supabase
    .from('event_guests')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching event guests:', error);
    throw new Error(`Failed to fetch event guests: ${error.message}`);
  }

  return (data || []).map(mapEventGuestFromDb);
}

export async function getGuestEvents(guestId: string): Promise<EventGuest[]> {
  const { data, error } = await supabase
    .from('event_guests')
    .select('*')
    .eq('guest_id', guestId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guest events:', error);
    throw new Error(`Failed to fetch guest events: ${error.message}`);
  }

  return (data || []).map(mapEventGuestFromDb);
}

export async function getGuestsByEvent(eventId: string): Promise<Guest[]> {
  const { data, error } = await supabase
    .from('event_guests')
    .select(`
      *,
      guests (*)
    `)
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching guests by event:', error);
    throw new Error(`Failed to fetch guests by event: ${error.message}`);
  }

  return (data || [])
    .map((row: any) => row.guests)
    .filter((guest: any) => guest !== null)
    .map(mapGuestFromDb);
}

export async function getEventsByGuest(guestId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('event_guests')
    .select(`
      *,
      events (*)
    `)
    .eq('guest_id', guestId);

  if (error) {
    console.error('Error fetching events by guest:', error);
    throw new Error(`Failed to fetch events by guest: ${error.message}`);
  }

  return (data || [])
    .map((row: any) => row.events)
    .filter((event: any) => event !== null)
    .map(mapEventFromDb);
}

export async function assignGuestToEvent(data: CreateEventGuestInput): Promise<EventGuest> {
  const { data: eventGuestData, error } = await supabase
    .from('event_guests')
    .insert({
      event_id: data.event_id,
      guest_id: data.guest_id,
      rsvp_status: data.rsvp_status || 'pending',
      check_in_status: data.check_in_status || 'not_checked_in',
      notes: data.notes || null,
      assigned_by: data.assigned_by || null,
    })
    .select()
    .single();

  if (error) {
    // Check for duplicate assignment error
    if (error.code === '23505' || error.message.includes('unique') || error.message.includes('duplicate')) {
      throw new Error(`Guest is already assigned to this event`);
    }
    console.error('Error assigning guest to event:', error);
    throw new Error(`Failed to assign guest to event: ${error.message}`);
  }

  return mapEventGuestFromDb(eventGuestData);
}

export async function updateEventGuest(id: string, data: UpdateEventGuestInput): Promise<EventGuest> {
  const updateData: any = {};
  
  if (data.rsvp_status !== undefined) updateData.rsvp_status = data.rsvp_status;
  if (data.check_in_status !== undefined) updateData.check_in_status = data.check_in_status;
  if (data.notes !== undefined) updateData.notes = data.notes || null;

  const { data: eventGuestData, error } = await supabase
    .from('event_guests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event guest:', error);
    throw new Error(`Failed to update event guest: ${error.message}`);
  }

  return mapEventGuestFromDb(eventGuestData);
}

export async function removeGuestFromEvent(eventId: string, guestId: string): Promise<void> {
  const { error } = await supabase
    .from('event_guests')
    .delete()
    .eq('event_id', eventId)
    .eq('guest_id', guestId);

  if (error) {
    console.error('Error removing guest from event:', error);
    throw new Error(`Failed to remove guest from event: ${error.message}`);
  }
}

export async function bulkAssignGuestsToEvent(
  eventId: string,
  guestIds: string[],
  assignedBy: string
): Promise<EventGuest[]> {
  const assignments = guestIds.map(guestId => ({
    event_id: eventId,
    guest_id: guestId,
    rsvp_status: 'pending' as const,
    check_in_status: 'not_checked_in' as const,
    assigned_by: assignedBy,
  }));

  const { data, error } = await supabase
    .from('event_guests')
    .upsert(assignments, { onConflict: 'event_id,guest_id', ignoreDuplicates: false })
    .select();

  if (error) {
    console.error('Error bulk assigning guests:', error);
    throw new Error(`Failed to bulk assign guests: ${error.message}`);
  }

  return (data || []).map(mapEventGuestFromDb);
}

// Helper functions to map database rows to types
function mapEventGuestFromDb(row: any): EventGuest {
  return {
    id: row.id,
    event_id: row.event_id,
    guest_id: row.guest_id,
    rsvp_status: row.rsvp_status,
    check_in_status: row.check_in_status,
    notes: row.notes || undefined,
    assigned_by: row.assigned_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapGuestFromDb(row: any): Guest {
  return {
    id: row.id,
    organization_id: row.organization_id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    company: row.company || undefined,
    job_title: row.job_title || undefined,
    phone: row.phone || undefined,
    address: row.address || undefined,
    notes: row.notes || undefined,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapEventFromDb(row: any): Event {
  return {
    id: row.id,
    organization_id: row.organization_id,
    name: row.name,
    date: row.date,
    location: row.location,
    description: row.description || undefined,
    status: row.status,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
