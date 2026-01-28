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

export default function AIAnalysisPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [metadataMap, setMetadataMap] = useState<Map<string, GuestMetadata>>(new Map());
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');

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
    .sort((a, b) => {
      if (sortBy === 'score') {
        return b.score - a.score;
      } else {
        return `${a.guest.first_name} ${a.guest.last_name}`.localeCompare(
          `${b.guest.first_name} ${b.guest.last_name}`
        );
      }
    });

  // Get guests without analysis
  const unanalyzedGuests = guests.filter(guest => {
    const metadata = metadataMap.get(guest.id);
    return !metadata || !metadata.importance_score;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">AI Analysis</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Analyze your guests to get importance scores and enrichment data
            </p>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">AI Analysis</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Analyze your guests to get importance scores and enrichment data
          </p>
        </div>
        {unanalyzedGuests.length > 0 && (
          <AnalyzeGuestsButton
            analyzeAll={true}
            onComplete={loadData}
          />
        )}
      </div>

      {/* Quick Action Card */}
      {unanalyzedGuests.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                {unanalyzedGuests.length} guest{unanalyzedGuests.length !== 1 ? 's' : ''} need analysis
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Get AI-powered importance scores, industry classification, company size estimates, and seniority levels for your guests.
              </p>
            </div>
            <AnalyzeGuestsButton
              analyzeAll={true}
              onComplete={loadData}
            />
          </div>
        </div>
      )}

      {/* Analyzed Guests Section */}
      {analyzedGuests.length > 0 ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              Analyzed Guests ({analyzedGuests.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-muted)]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'score' | 'name')}
                className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="score">Importance Score</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {analyzedGuests.map(({ guest, metadata }) => (
              <Link
                key={guest.id}
                href={`/guests/${guest.id}`}
                className="flex items-center gap-4 p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <ProfilePicture
                  url={metadata?.profile_picture_url}
                  firstName={guest.first_name}
                  lastName={guest.last_name}
                  email={guest.email}
                  size={48}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[var(--color-text)]">
                      {guest.first_name} {guest.last_name}
                    </span>
                    <ImportanceBadge score={metadata?.importance_score} size="sm" />
                  </div>
                  {guest.company && (
                    <p className="text-sm text-[var(--color-text-muted)] mb-2">
                      {guest.company}
                      {guest.job_title && ` • ${guest.job_title}`}
                    </p>
                  )}
                  {metadata && (
                    <EnrichmentBadge
                      industry={metadata.industry}
                      companySize={metadata.company_size_estimate}
                      seniorityLevel={metadata.seniority_level}
                      showAll={true}
                    />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--color-accent)]">
                    {metadata?.importance_score?.toFixed(0) || '0'}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">Score</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-[var(--color-text-muted)] mb-4"
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
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
            No guests analyzed yet
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Start analyzing your guests to see importance scores, industry classifications, and more.
          </p>
          {unanalyzedGuests.length > 0 ? (
            <AnalyzeGuestsButton
              analyzeAll={true}
              onComplete={loadData}
            />
          ) : (
            <Link href="/guests">
              <button className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                Add Guests
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Unanalyzed Guests Section */}
      {unanalyzedGuests.length > 0 && analyzedGuests.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            Guests Pending Analysis ({unanalyzedGuests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unanalyzedGuests.slice(0, 12).map((guest) => (
              <Link
                key={guest.id}
                href={`/guests/${guest.id}`}
                className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <ProfilePicture
                  firstName={guest.first_name}
                  lastName={guest.last_name}
                  email={guest.email}
                  size={40}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--color-text)] truncate">
                    {guest.first_name} {guest.last_name}
                  </p>
                  {guest.company && (
                    <p className="text-xs text-[var(--color-text-muted)] truncate">
                      {guest.company}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {unanalyzedGuests.length > 12 && (
            <div className="mt-4 text-center">
              <Link href="/guests" className="text-sm text-[var(--color-accent)] hover:underline">
                View all {unanalyzedGuests.length} unanalyzed guests →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
