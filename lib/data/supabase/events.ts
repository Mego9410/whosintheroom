// Supabase data access layer for Events
import { supabase } from '@/lib/supabase/client';
import type { Event, CreateEventInput, UpdateEventInput } from '@/lib/types';

export async function getEvents(organizationId?: string): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return (data || []).map(mapEventFromDb);
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching event:', error);
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data ? mapEventFromDb(data) : null;
}

export async function createEvent(data: CreateEventInput): Promise<Event> {
  const { data: eventData, error } = await supabase
    .from('events')
    .insert({
      organization_id: data.organization_id,
      name: data.name,
      date: data.date,
      location: data.location,
      description: data.description || null,
      status: data.status || 'draft',
      created_by: data.created_by || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return mapEventFromDb(eventData);
}

export async function updateEvent(id: string, data: UpdateEventInput): Promise<Event> {
  const updateData: any = {};
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.date !== undefined) updateData.date = data.date;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.status !== undefined) updateData.status = data.status;

  const { data: eventData, error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return mapEventFromDb(eventData);
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

export async function searchEvents(query: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .or(`name.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error searching events:', error);
    throw new Error(`Failed to search events: ${error.message}`);
  }

  return (data || []).map(mapEventFromDb);
}

export async function filterEvents(filters: {
  status?: Event['status'];
  organizationId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Event[]> {
  let query = supabase.from('events').select('*');

  if (filters.organizationId) {
    query = query.eq('organization_id', filters.organizationId);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.dateFrom) {
    query = query.gte('date', filters.dateFrom);
  }

  if (filters.dateTo) {
    query = query.lte('date', filters.dateTo);
  }

  query = query.order('date', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error filtering events:', error);
    throw new Error(`Failed to filter events: ${error.message}`);
  }

  return (data || []).map(mapEventFromDb);
}

// Helper function to map database row to Event type
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
