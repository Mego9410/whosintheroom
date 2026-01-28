'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventForm } from '@/components/events/EventForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { getEventById, updateEvent } from '@/lib/data/events';
import type { Event, UpdateEventInput } from '@/lib/types';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await getEventById(eventId);
      if (!eventData) {
        setError('Event not found');
        return;
      }
      setEvent(eventData);
    } catch (error) {
      console.error('Error loading event:', error);
      setError(error instanceof Error ? error.message : 'Failed to load event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateEventInput) => {
    try {
      setIsSaving(true);
      await updateEvent(eventId, data);
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/events/${eventId}`);
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
          message={error || 'The event you\'re trying to edit doesn\'t exist or has been deleted.'}
          onRetry={loadEvent}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/events/${eventId}`}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4 inline-block"
        >
          ← Back to Event
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Edit Event</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Update the event details below
        </p>
      </div>

      {/* Form */}
      <EventForm
        event={event}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </div>
  );
}
