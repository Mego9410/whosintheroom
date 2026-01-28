'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { AddGuestModal } from '@/components/events/AddGuestModal';
import { EventGuestList } from '@/components/events/EventGuestList';
import { AnalyzeGuestsButton } from '@/components/AnalyzeGuestsButton';
import { getEventById, deleteEvent } from '@/lib/data/events';
import { getGuestsByEvent } from '@/lib/data/event-guests';
import type { Event } from '@/lib/types';
import type { Guest } from '@/lib/types';

const statusColors: Record<Event['status'], 'default' | 'success' | 'warning' | 'danger'> = {
  draft: 'default',
  active: 'success',
  completed: 'info',
  cancelled: 'danger',
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);

  const loadEventData = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await getEventById(eventId);
      if (!eventData) {
        setError('Event not found');
        return;
      }
      setEvent(eventData);

      // Load guests for this event
      const eventGuests = await getGuestsByEvent(eventId);
      setGuests(eventGuests);
    } catch (error) {
      console.error('Error loading event:', error);
      setError(error instanceof Error ? error.message : 'Failed to load event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshGuests = async () => {
    if (!eventId) return;
    try {
      const eventGuests = await getGuestsByEvent(eventId);
      setGuests(eventGuests);
    } catch (error) {
      console.error('Error refreshing guests:', error);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  // Refresh guests when navigating back to this page or when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (event) {
        // Reload guests when window regains focus (user might have assigned guests from import)
        refreshGuests();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [event, eventId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteEvent(eventId);
      router.push('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleGuestsUpdate = async () => {
    // Reload guests after adding/removing
    const eventGuests = await getGuestsByEvent(eventId);
    setGuests(eventGuests);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-[var(--color-text-muted)]">Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div>
        <Link
          href="/events"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4 inline-block"
        >
          ← Back to Events
        </Link>
        <ErrorMessage 
          title={error || 'Event not found'} 
          message={error || 'The event you\'re looking for doesn\'t exist or has been deleted.'}
          onRetry={loadEventData}
        />
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/events"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            ← Back to Events
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/events/${event.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="outline" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">{event.name}</h1>
            <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formattedDate} at {formattedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
            </div>
          </div>
          <Badge variant={statusColors[event.status]}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>

        {event.description && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">Description</h2>
            <p className="text-[var(--color-text)]">{event.description}</p>
          </div>
        )}
      </div>

        {/* Guests Section */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Guests</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {guests.length} {guests.length === 1 ? 'guest' : 'guests'} assigned
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={refreshGuests}
              title="Refresh guests list"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
            <Button 
              type="button"
              onClick={() => setIsAddGuestModalOpen(true)}
            >
              + Add Guests
            </Button>
            {guests.length > 0 && event && (
              <AnalyzeGuestsButton
                eventId={eventId}
                event={event}
                onComplete={handleGuestsUpdate}
              />
            )}
          </div>
        </div>

        {guests.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-muted)]">
            <p className="mb-4">No guests assigned to this event yet</p>
            <Button 
              type="button"
              variant="secondary" 
              onClick={() => setIsAddGuestModalOpen(true)}
            >
              Add Guests
            </Button>
          </div>
        ) : (
          <EventGuestList eventId={eventId} guests={guests} onUpdate={handleGuestsUpdate} />
        )}
      </div>

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={isAddGuestModalOpen}
        onClose={() => setIsAddGuestModalOpen(false)}
        eventId={eventId}
        onSuccess={handleGuestsUpdate}
      />
    </div>
  );
}
