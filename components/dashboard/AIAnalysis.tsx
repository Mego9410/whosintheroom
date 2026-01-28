'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalyzeGuestsButton } from '@/components/AnalyzeGuestsButton';
import { ImportanceBadge } from '@/components/ImportanceBadge';
import { ProfilePicture } from '@/components/ProfilePicture';
import { EnrichmentBadge } from '@/components/EnrichmentBadge';
import { getGuests } from '@/lib/data/guests';
import { getGuestsMetadata } from '@/lib/data/guest-metadata';
import type { Guest } from '@/lib/types';
import type { GuestMetadata } from '@/lib/types/scoring';

export function AIAnalysis() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [metadataMap, setMetadataMap] = useState<Map<string, GuestMetadata>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allGuests = await getGuests();
      setGuests(allGuests);

      // Load metadata for all guests
      const guestIds = allGuests.map(g => g.id);
      const metadata = await getGuestsMetadata(guestIds);
      setMetadataMap(metadata);
    } catch (error) {
      console.error('Error loading AI analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get guests with importance scores (sorted by score)
  const analyzedGuests = guests
    .map(guest => {
      const metadata = metadataMap.get(guest.id);
      return {
        guest,
        metadata,
        score: metadata?.importance_score || 0,
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Top 5 VIPs

  // Get guests without analysis
  const unanalyzedGuests = guests.filter(guest => {
    const metadata = metadataMap.get(guest.id);
    return !metadata || !metadata.importance_score;
  });

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">AI Analysis</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">AI Analysis</h2>
        <Link href="/guests" className="text-sm text-[var(--color-accent)] hover:underline">
          View all
        </Link>
      </div>

      {/* Quick Action */}
      {unanalyzedGuests.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-medium text-[var(--color-text)] mb-1">
                {unanalyzedGuests.length} guest{unanalyzedGuests.length !== 1 ? 's' : ''} need analysis
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Analyze guests to get importance scores and enrichment data
              </p>
            </div>
            <AnalyzeGuestsButton
              analyzeAll={true}
              onComplete={loadData}
            />
          </div>
        </div>
      )}

      {/* Top VIPs */}
      {analyzedGuests.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">
            Top VIPs (by Importance Score)
          </h3>
          <div className="space-y-3">
            {analyzedGuests.map(({ guest, metadata }) => (
              <Link
                key={guest.id}
                href={`/guests/${guest.id}`}
                className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <ProfilePicture
                  url={metadata?.profile_picture_url}
                  firstName={guest.first_name}
                  lastName={guest.last_name}
                  email={guest.email}
                  size={40}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[var(--color-text)] truncate">
                      {guest.first_name} {guest.last_name}
                    </span>
                    <ImportanceBadge score={metadata?.importance_score} size="sm" />
                  </div>
                  {guest.company && (
                    <p className="text-sm text-[var(--color-text-muted)] truncate mb-1">
                      {guest.company}
                    </p>
                  )}
                  {metadata && (
                    <EnrichmentBadge
                      industry={metadata.industry}
                      companySize={metadata.company_size_estimate}
                      seniorityLevel={metadata.seniority_level}
                      showAll={false}
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-[var(--color-text-muted)] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            No guests analyzed yet
          </p>
          <AnalyzeGuestsButton
            analyzeAll={true}
            onComplete={loadData}
          />
        </div>
      )}
    </div>
  );
}
