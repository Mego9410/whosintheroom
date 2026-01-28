'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EventForm } from '@/components/events/EventForm';
import { createEvent } from '@/lib/data/events';
import type { CreateEventInput } from '@/lib/types';

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateEventInput) => {
    try {
      setIsLoading(true);
      const newEvent = await createEvent(data);
      router.push(`/events/${newEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/events');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/events"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4 inline-block"
        >
          ← Back to Events
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Create Event</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Fill in the details to create a new event
        </p>
      </div>

      {/* Form */}
      <EventForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
    </div>
  );
}
