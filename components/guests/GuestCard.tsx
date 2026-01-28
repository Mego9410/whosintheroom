'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ProfilePicture } from '@/components/ProfilePicture';
import { ImportanceBadge } from '@/components/ImportanceBadge';
import { EnrichmentBadge } from '@/components/EnrichmentBadge';
import { getGuestMetadata } from '@/lib/data/guest-metadata';
import type { Guest } from '@/lib/types';
import type { GuestMetadata } from '@/lib/types/scoring';

interface GuestCardProps {
  guest: Guest;
  metadata?: GuestMetadata | null;
}

export function GuestCard({ guest, metadata: initialMetadata }: GuestCardProps) {
  const [metadata, setMetadata] = useState<GuestMetadata | null>(initialMetadata || null);

  useEffect(() => {
    if (!initialMetadata) {
      // Fetch metadata if not provided
      getGuestMetadata(guest.id).then(setMetadata).catch(console.error);
    }
  }, [guest.id, initialMetadata]);

  return (
    <Link
      href={`/guests/${guest.id}`}
      className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all hover:border-[var(--color-accent)] hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <ProfilePicture
            url={metadata?.profile_picture_url}
            firstName={guest.first_name}
            lastName={guest.last_name}
            email={guest.email}
            size={48}
          />
        </div>

        {/* Guest Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              {guest.first_name} {guest.last_name}
            </h3>
            {metadata && (
              <ImportanceBadge score={metadata.importance_score} size="sm" />
            )}
          </div>
          
          <div className="space-y-1 text-sm text-[var(--color-text-muted)] mb-2">
            {guest.email && (
              <div className="flex items-center gap-2 truncate">
                <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{guest.email}</span>
              </div>
            )}
            {guest.company && (
              <div className="flex items-center gap-2 truncate">
                <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="truncate">{guest.company}</span>
              </div>
            )}
            {guest.job_title && (
              <div className="text-[var(--color-text-light)] truncate">
                {guest.job_title}
              </div>
            )}
          </div>

          {/* Enrichment Badges */}
          {metadata && (
            <EnrichmentBadge
              industry={metadata.industry}
              companySize={metadata.company_size_estimate}
              seniorityLevel={metadata.seniority_level}
              showAll={false}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
