// Supabase data access layer for Guests
import { supabase } from '@/lib/supabase/client';
import type { Guest, CreateGuestInput, UpdateGuestInput } from '@/lib/types';

export async function getGuests(organizationId?: string): Promise<Guest[]> {
  let query = supabase
    .from('guests')
    .select('*')
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true });

  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching guests:', error);
    throw new Error(`Failed to fetch guests: ${error.message}`);
  }

  return (data || []).map(mapGuestFromDb);
}

export async function getGuestById(id: string): Promise<Guest | null> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching guest:', error);
    throw new Error(`Failed to fetch guest: ${error.message}`);
  }

  return data ? mapGuestFromDb(data) : null;
}

export async function getGuestByEmail(email: string, organizationId: string): Promise<Guest | null> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('email', email.toLowerCase())
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching guest by email:', error);
    throw new Error(`Failed to fetch guest: ${error.message}`);
  }

  return data ? mapGuestFromDb(data) : null;
}

export async function createGuest(data: CreateGuestInput): Promise<Guest> {
  const { data: guestData, error } = await supabase
    .from('guests')
    .insert({
      organization_id: data.organization_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email.toLowerCase(),
      company: data.company || null,
      job_title: data.job_title || null,
      phone: data.phone || null,
      address: data.address || null,
      notes: data.notes || null,
      created_by: data.created_by || null,
    })
    .select()
    .single();

  if (error) {
    // Check for duplicate email error
    if (error.code === '23505' || error.message.includes('unique') || error.message.includes('duplicate')) {
      throw new Error(`Guest with email ${data.email} already exists in this organization`);
    }
    console.error('Error creating guest:', error);
    throw new Error(`Failed to create guest: ${error.message}`);
  }

  return mapGuestFromDb(guestData);
}

export async function updateGuest(id: string, data: UpdateGuestInput): Promise<Guest> {
  const updateData: any = {};
  
  if (data.first_name !== undefined) updateData.first_name = data.first_name;
  if (data.last_name !== undefined) updateData.last_name = data.last_name;
  if (data.email !== undefined) updateData.email = data.email.toLowerCase();
  if (data.company !== undefined) updateData.company = data.company || null;
  if (data.job_title !== undefined) updateData.job_title = data.job_title || null;
  if (data.phone !== undefined) updateData.phone = data.phone || null;
  if (data.address !== undefined) updateData.address = data.address || null;
  if (data.notes !== undefined) updateData.notes = data.notes || null;

  const { data: guestData, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    // Check for duplicate email error
    if (error.code === '23505' || error.message.includes('unique') || error.message.includes('duplicate')) {
      throw new Error(`Guest with email ${updateData.email} already exists in this organization`);
    }
    console.error('Error updating guest:', error);
    throw new Error(`Failed to update guest: ${error.message}`);
  }

  return mapGuestFromDb(guestData);
}

export async function deleteGuest(id: string): Promise<void> {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting guest:', error);
    throw new Error(`Failed to delete guest: ${error.message}`);
  }
}

export async function searchGuests(query: string): Promise<Guest[]> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%,job_title.ilike.%${query}%`)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true });

  if (error) {
    console.error('Error searching guests:', error);
    throw new Error(`Failed to search guests: ${error.message}`);
  }

  return (data || []).map(mapGuestFromDb);
}

export async function filterGuests(filters: {
  organizationId?: string;
  company?: string;
  jobTitle?: string;
}): Promise<Guest[]> {
  let query = supabase.from('guests').select('*');

  if (filters.organizationId) {
    query = query.eq('organization_id', filters.organizationId);
  }

  if (filters.company) {
    query = query.ilike('company', `%${filters.company}%`);
  }

  if (filters.jobTitle) {
    query = query.ilike('job_title', `%${filters.jobTitle}%`);
  }

  query = query.order('last_name', { ascending: true }).order('first_name', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error filtering guests:', error);
    throw new Error(`Failed to filter guests: ${error.message}`);
  }

  return (data || []).map(mapGuestFromDb);
}

// Helper function to map database row to Guest type
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
