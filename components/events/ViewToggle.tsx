'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

type ViewMode = 'table' | 'grid';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 border border-[var(--color-border)] rounded-lg p-1 bg-[var(--color-surface)]">
      <button
        onClick={() => onViewChange('table')}
        className={cn(
          'p-2 rounded transition-colors',
          viewMode === 'table'
            ? 'bg-[var(--color-accent)] text-white'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
        )}
        aria-label="Table view"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
      <button
        onClick={() => onViewChange('grid')}
        className={cn(
          'p-2 rounded transition-colors',
          viewMode === 'grid'
            ? 'bg-[var(--color-accent)] text-white'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
        )}
        aria-label="Grid view"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
    </div>
  );
}
