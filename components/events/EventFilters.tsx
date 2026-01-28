'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import type { Event } from '@/lib/types';

interface EventFiltersProps {
  statusFilter: Event['status'] | 'all';
  onStatusChange: (status: Event['status'] | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function EventFilters({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: EventFiltersProps) {
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
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {(['all', 'draft', 'active', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              statusFilter === status
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
            )}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
