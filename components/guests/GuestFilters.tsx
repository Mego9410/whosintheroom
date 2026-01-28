'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import type { Event } from '@/lib/types';

interface GuestFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  eventFilter: string;
  onEventChange: (eventId: string) => void;
  events: Event[];
}

export function GuestFilters({
  searchQuery,
  onSearchChange,
  eventFilter,
  onEventChange,
  events,
}: GuestFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, company, or job title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Event Filter */}
      <div className="sm:w-64">
        <select
          value={eventFilter}
          onChange={(e) => onEventChange(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
