'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import type { Event } from '@/lib/types';

interface EventTableProps {
  events: Event[];
}

const statusColors: Record<Event['status'], 'default' | 'success' | 'warning' | 'danger'> = {
  draft: 'default',
  active: 'success',
  completed: 'info',
  cancelled: 'danger',
};

export function EventTable({ events }: EventTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-muted)]">No events found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full">
        <thead className="bg-[var(--color-background-alt)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
          {events.map((event) => (
            <tr
              key={event.id}
              className="hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/events/${event.id}`}
                  className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]"
                >
                  {event.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                {formatDate(event.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                {event.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={statusColors[event.status]}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/events/${event.id}`}
                  className="text-[var(--color-accent)] hover:text-[var(--color-accent-secondary)]"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
