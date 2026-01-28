'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { EventTable } from '@/components/events/EventTable';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { ViewToggle } from '@/components/events/ViewToggle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { getEvents, filterEvents, searchEvents } from '@/lib/data/events';
import { seedData } from '@/lib/mock-data/seed';
import type { Event } from '@/lib/types';

type ViewMode = 'table' | 'grid';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Event['status'] | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  useEffect(() => {
    // Seed data on first load
    seedData();
    loadEvents();
  }, []);

  // Refresh events when navigating back to this page
  useEffect(() => {
    const handleFocus = () => {
      loadEvents();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const allEvents = await getEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setError(error instanceof Error ? error.message : 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let result = events;

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(event => event.status === statusFilter);
    }

    // Sort by date (upcoming first)
    return result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }, [events, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-[var(--color-text-muted)]">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <ErrorMessage 
          title="Failed to load events" 
          message={error} 
          onRetry={loadEvents}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Events</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
          <Link href="/events/new">
            <Button>+ New Event</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <EventFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Events List */}
      {viewMode === 'table' ? (
        <EventTable events={filteredEvents} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && events.length === 0 && (
        <EmptyState
          title="No events yet"
          description="Get started by creating your first event. You can manage guests, track attendance, and more."
          actionLabel="Create Your First Event"
          actionHref="/events/new"
        />
      )}

      {filteredEvents.length === 0 && events.length > 0 && (
        <EmptyState
          title="No events match your filters"
          description="Try adjusting your search or filter criteria to see more results."
        />
      )}
    </div>
  );
}
