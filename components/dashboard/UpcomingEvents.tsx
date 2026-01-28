'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import type { Event } from '@/lib/types';

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Past';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  if (events.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Upcoming Events</h2>
        <p className="text-[var(--color-text-muted)] text-center py-8">
          No upcoming events. <Link href="/events/new" className="text-[var(--color-accent)] hover:underline">Create one</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Upcoming Events</h2>
        <Link href="/events" className="text-sm text-[var(--color-accent)] hover:underline">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[var(--color-text)] mb-1 truncate">
                  {event.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                  <span>{formatDate(event.date)}</span>
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
              <Badge variant={event.status === 'active' ? 'success' : 'default'}>
                {event.status}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
