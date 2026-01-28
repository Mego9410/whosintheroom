import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import type { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
}

const statusColors: Record<Event['status'], 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  active: 'success',
  completed: 'info',
  cancelled: 'danger',
};

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Link
      href={`/events/${event.id}`}
      className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all hover:border-[var(--color-accent)] hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
            {event.name}
          </h3>
          <div className="space-y-1 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <p className="mt-3 text-sm text-[var(--color-text-muted)] line-clamp-2">
          {event.description}
        </p>
      )}
    </Link>
  );
}
