import { getEventsStore } from './events';
import { getGuestsStore } from './guests';
import { getEventGuestsStore } from './event-guests';
import { initializeServerStores } from '@/lib/storage/server-storage';
import type { Event, Guest, EventGuest } from '@/lib/types';

// Default organization ID for seed data
const DEFAULT_ORG_ID = 'org_default';
const DEFAULT_USER_ID = 'user_default';

export function seedData(): void {
  try {
    console.log('seedData: Starting...');
    const eventsStore = getEventsStore();
    const guestsStore = getGuestsStore();
    const eventGuestsStore = getEventGuestsStore();

    const existingEvents = eventsStore.getAll();
    const existingGuests = guestsStore.getAll();
    
    console.log('seedData: Existing data -', existingEvents.length, 'events,', existingGuests.length, 'guests');

    // Check if data already exists
    if (existingEvents.length > 0 || existingGuests.length > 0) {
      console.log('seedData: Data already seeded, skipping...');
      return;
    }

    console.log('seedData: No existing data, creating seed data...');

  // Seed Events
  const events: Event[] = [
    {
      id: 'evt_seed_1',
      organization_id: DEFAULT_ORG_ID,
      name: 'Tech Summit 2024',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      location: 'San Francisco Convention Center',
      description: 'Annual technology summit featuring keynotes from industry leaders.',
      status: 'active',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'evt_seed_2',
      organization_id: DEFAULT_ORG_ID,
      name: 'Marketing Conference',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      location: 'New York Marriott Marquis',
      description: 'Marketing professionals gathering to discuss latest trends.',
      status: 'active',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'evt_seed_3',
      organization_id: DEFAULT_ORG_ID,
      name: 'Product Launch Event',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
      location: 'Los Angeles Convention Center',
      description: 'Launch of our new product line with VIP guests.',
      status: 'draft',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'evt_seed_4',
      organization_id: DEFAULT_ORG_ID,
      name: 'Q4 Strategy Meeting',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      location: 'Company Headquarters',
      description: 'Quarterly strategy planning meeting.',
      status: 'completed',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'evt_seed_5',
      organization_id: DEFAULT_ORG_ID,
      name: 'Networking Mixer',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      location: 'The Rooftop Bar, Downtown',
      description: 'Casual networking event for industry professionals.',
      status: 'active',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Seed Guests
  const guests: Guest[] = [
    {
      id: 'gst_seed_1',
      organization_id: DEFAULT_ORG_ID,
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@techcorp.com',
      company: 'TechCorp Inc.',
      job_title: 'CEO',
      phone: '+1-555-0101',
      notes: 'VIP - Keynote speaker',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'gst_seed_2',
      organization_id: DEFAULT_ORG_ID,
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.j@marketingpro.com',
      company: 'Marketing Pro',
      job_title: 'CMO',
      phone: '+1-555-0102',
      notes: 'Interested in partnership opportunities',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'gst_seed_3',
      organization_id: DEFAULT_ORG_ID,
      first_name: 'Michael',
      last_name: 'Chen',
      email: 'mchen@startup.io',
      company: 'Startup.io',
      job_title: 'Founder',
      phone: '+1-555-0103',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'gst_seed_4',
      organization_id: DEFAULT_ORG_ID,
      first_name: 'Emily',
      last_name: 'Davis',
      email: 'emily.davis@bigcorp.com',
      company: 'BigCorp',
      job_title: 'VP of Product',
      phone: '+1-555-0104',
      notes: 'Potential investor',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'gst_seed_5',
      organization_id: DEFAULT_ORG_ID,
      first_name: 'David',
      last_name: 'Wilson',
      email: 'dwilson@consulting.com',
      company: 'Strategic Consulting',
      job_title: 'Senior Partner',
      phone: '+1-555-0105',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'gst_seed_6',
      organization_id: DEFAULT_ORG_ID,
      first_name: 'Lisa',
      last_name: 'Anderson',
      email: 'lisa.anderson@designco.com',
      company: 'Design Co.',
      job_title: 'Creative Director',
      phone: '+1-555-0106',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'gst_seed_7',
      organization_id: DEFAULT_ORG_ID,
      first_name: 'Robert',
      last_name: 'Martinez',
      email: 'rmartinez@finance.com',
      company: 'Finance Group',
      job_title: 'CFO',
      phone: '+1-555-0107',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'gst_seed_8',
      organization_id: DEFAULT_ORG_ID,
      first_name: 'Jennifer',
      last_name: 'Taylor',
      email: 'j.taylor@techstart.com',
      company: 'TechStart',
      job_title: 'CTO',
      phone: '+1-555-0108',
      notes: 'Previous speaker',
      created_by: DEFAULT_USER_ID,
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Add events and guests to stores
  events.forEach(event => {
    eventsStore.create(event);
  });

  guests.forEach(guest => {
    guestsStore.create(guest);
  });

  // Seed Event-Guest relationships
  const relationships: Omit<EventGuest, 'id' | 'created_at' | 'updated_at'>[] = [
    // Tech Summit 2024 guests
    { event_id: 'evt_seed_1', guest_id: 'gst_seed_1', rsvp_status: 'accepted', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    { event_id: 'evt_seed_1', guest_id: 'gst_seed_3', rsvp_status: 'accepted', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    { event_id: 'evt_seed_1', guest_id: 'gst_seed_8', rsvp_status: 'invited', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    
    // Marketing Conference guests
    { event_id: 'evt_seed_2', guest_id: 'gst_seed_2', rsvp_status: 'accepted', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    { event_id: 'evt_seed_2', guest_id: 'gst_seed_6', rsvp_status: 'pending', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    
    // Product Launch Event guests
    { event_id: 'evt_seed_3', guest_id: 'gst_seed_4', rsvp_status: 'invited', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    { event_id: 'evt_seed_3', guest_id: 'gst_seed_5', rsvp_status: 'maybe', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    
    // Networking Mixer guests
    { event_id: 'evt_seed_5', guest_id: 'gst_seed_1', rsvp_status: 'accepted', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    { event_id: 'evt_seed_5', guest_id: 'gst_seed_2', rsvp_status: 'accepted', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    { event_id: 'evt_seed_5', guest_id: 'gst_seed_3', rsvp_status: 'accepted', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
    { event_id: 'evt_seed_5', guest_id: 'gst_seed_7', rsvp_status: 'pending', check_in_status: 'not_checked_in', assigned_by: DEFAULT_USER_ID },
  ];

  relationships.forEach(rel => {
    try {
      eventGuestsStore.assign(rel);
    } catch (error) {
      console.warn('Failed to assign relationship:', error);
    }
  });

    console.log('✅ Seed data loaded successfully!');
    console.log(`   - ${events.length} events`);
    console.log(`   - ${guests.length} guests`);
    console.log(`   - ${relationships.length} event-guest relationships`);
    
    // Verify data was actually saved
    const verifyEvents = eventsStore.getAll();
    const verifyGuests = guestsStore.getAll();
    console.log('seedData: Verification -', verifyEvents.length, 'events,', verifyGuests.length, 'guests in store');
    
    // Also initialize server storage for API routes (only on client side)
    if (typeof window !== 'undefined') {
      initializeServerStores({
        events: verifyEvents,
        guests: verifyGuests,
      });
      console.log('seedData: Server storage initialized');
    }
  } catch (error) {
    console.error('seedData: Error seeding data:', error);
    throw error;
  }
}
