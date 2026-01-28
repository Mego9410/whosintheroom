'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GuestTable } from '@/components/guests/GuestTable';
import { GuestCard } from '@/components/guests/GuestCard';
import { GuestFilters } from '@/components/guests/GuestFilters';
import { ViewToggle } from '@/components/events/ViewToggle';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnalyzeGuestsButton } from '@/components/AnalyzeGuestsButton';
import { getGuests } from '@/lib/data/guests';
import { getEvents } from '@/lib/data/events';
import { getGuestsByEvent } from '@/lib/data/event-guests';
import { seedData } from '@/lib/mock-data/seed';
import type { Guest, Event } from '@/lib/types';

type ViewMode = 'table' | 'grid';

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  useEffect(() => {
    // Seed data on first load
    seedData();
    loadData();
  }, []);

  // Refresh guests when navigating back to this page
  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Reload guests when event filter changes
  useEffect(() => {
    loadGuests();
  }, [eventFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadGuests(),
        loadEvents(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGuests = async () => {
    try {
      setError(null);
      if (eventFilter) {
        // Load guests for specific event
        const eventGuests = await getGuestsByEvent(eventFilter);
        setGuests(eventGuests);
      } else {
        // Load all guests
        const allGuests = await getGuests();
        setGuests(allGuests);
      }
    } catch (error) {
      console.error('Error loading guests:', error);
      setError(error instanceof Error ? error.message : 'Failed to load guests. Please try again.');
    }
  };

  const loadEvents = async () => {
    try {
      const allEvents = await getEvents();
      // Sort events by name
      const sortedEvents = allEvents.sort((a, b) => a.name.localeCompare(b.name));
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  // Filter and search guests
  const filteredGuests = useMemo(() => {
    let result = guests;

    // Apply search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(guest =>
        guest.first_name.toLowerCase().includes(lowerQuery) ||
        guest.last_name.toLowerCase().includes(lowerQuery) ||
        guest.email?.toLowerCase().includes(lowerQuery) ||
        guest.company?.toLowerCase().includes(lowerQuery) ||
        guest.job_title?.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort by last name
    return result.sort((a, b) => {
      const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
      const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [guests, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-[var(--color-text-muted)]">Loading guests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <ErrorMessage 
          title="Failed to load guests" 
          message={error} 
          onRetry={loadGuests}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Guests</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {filteredGuests.length} {filteredGuests.length === 1 ? 'guest' : 'guests'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
          {guests.length > 0 && (
            <AnalyzeGuestsButton
              analyzeAll={true}
              onComplete={loadGuests}
            />
          )}
          <Link href="/ai-analysis">
            <Button variant="secondary" className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Analysis
            </Button>
          </Link>
          <Link href="/guests/new">
            <Button>+ New Guest</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <GuestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        eventFilter={eventFilter}
        onEventChange={setEventFilter}
        events={events}
      />

      {/* Guests List */}
      {viewMode === 'table' ? (
        <GuestTable guests={filteredGuests} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} />
          ))}
        </div>
      )}

      {filteredGuests.length === 0 && guests.length === 0 && (
        <EmptyState
          title="No guests yet"
          description="Start building your guest list by adding guests manually or importing from a CSV file."
          actionLabel="Add Your First Guest"
          actionHref="/guests/new"
        />
      )}

      {filteredGuests.length === 0 && guests.length > 0 && (
        <EmptyState
          title="No guests match your filters"
          description="Try adjusting your search or event filter to see more results."
        />
      )}
    </div>
  );
}
