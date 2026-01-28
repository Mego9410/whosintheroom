'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { getGuestById, deleteGuest } from '@/lib/data/guests';
import { getEventsByGuest } from '@/lib/data/event-guests';
import { getGuestMetadata } from '@/lib/data/guest-metadata';
import { AnalyzeGuestsButton } from '@/components/AnalyzeGuestsButton';
import { ImportanceBadge } from '@/components/ImportanceBadge';
import { ProfilePicture } from '@/components/ProfilePicture';
import { EnrichmentBadge } from '@/components/EnrichmentBadge';
import type { Guest } from '@/lib/types';
import type { Event } from '@/lib/types';
import type { GuestMetadata } from '@/lib/types/scoring';

export default function GuestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const guestId = params.id as string;

  const [guest, setGuest] = useState<Guest | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [metadata, setMetadata] = useState<GuestMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadGuestData();
  }, [guestId]);

  const loadGuestData = async () => {
    try {
      setLoading(true);
      setError(null);
      const guestData = await getGuestById(guestId);
      if (!guestData) {
        setError('Guest not found');
        return;
      }
      setGuest(guestData);

      // Load events for this guest
      const guestEvents = await getEventsByGuest(guestId);
      setEvents(guestEvents);

      // Load AI analysis metadata
      const guestMetadata = await getGuestMetadata(guestId);
      setMetadata(guestMetadata);
    } catch (error) {
      console.error('Error loading guest:', error);
      setError(error instanceof Error ? error.message : 'Failed to load guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this guest? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteGuest(guestId);
      router.push('/guests');
    } catch (error) {
      console.error('Error deleting guest:', error);
      alert('Failed to delete guest. Please try again.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-[var(--color-text-muted)]">Loading guest...</p>
      </div>
    );
  }

  if (error || !guest) {
    return (
      <div>
        <Link
          href="/guests"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4 inline-block"
        >
          ← Back to Guests
        </Link>
        <ErrorMessage 
          title={error || 'Guest not found'} 
          message={error || 'The guest you\'re looking for doesn\'t exist or has been deleted.'}
          onRetry={loadGuestData}
        />
      </div>
    );
  }


  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/guests"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            ← Back to Guests
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/guests/${guest.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="outline" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Guest Details */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <ProfilePicture
              url={metadata?.profile_picture_url}
              firstName={guest.first_name}
              lastName={guest.last_name}
              email={guest.email}
              size={80}
            />
          </div>

          {/* Guest Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-[var(--color-text)]">
                {guest.first_name} {guest.last_name}
              </h1>
              {metadata?.importance_score && (
                <ImportanceBadge score={metadata.importance_score} size="lg" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guest.email && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Email</h3>
                  <p className="text-[var(--color-text)]">{guest.email}</p>
                </div>
              )}
              {guest.phone && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Phone</h3>
                  <p className="text-[var(--color-text)]">{guest.phone}</p>
                </div>
              )}
              {guest.company && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Company</h3>
                  <p className="text-[var(--color-text)]">{guest.company}</p>
                </div>
              )}
              {guest.job_title && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Job Title</h3>
                  <p className="text-[var(--color-text)]">{guest.job_title}</p>
                </div>
              )}
              {guest.address && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Address</h3>
                  <p className="text-[var(--color-text)]">{guest.address}</p>
                </div>
              )}
            </div>

            {guest.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">Notes</h3>
                <p className="text-[var(--color-text)] whitespace-pre-wrap">{guest.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">AI Analysis</h2>
          {!metadata?.importance_score && (
            <AnalyzeGuestsButton
              guestId={guestId}
              onComplete={loadGuestData}
            />
          )}
        </div>

        {metadata?.importance_score ? (
          <div className="space-y-6">
            {/* Importance Score */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">Importance Score</h3>
                <div className="text-3xl font-bold text-[var(--color-accent)]">
                  {metadata.importance_score.toFixed(0)}
                </div>
              </div>
              {metadata.importance_reasoning && (
                <p className="text-sm text-[var(--color-text)] bg-[var(--color-surface-hover)] p-3 rounded-lg">
                  {metadata.importance_reasoning}
                </p>
              )}
              {metadata.importance_factors && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(metadata.importance_factors).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="text-[var(--color-text-muted)] capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="ml-1 font-medium text-[var(--color-text)]">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enrichment Data */}
            {(metadata.industry || metadata.company_size_estimate || metadata.seniority_level) && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">Enrichment Data</h3>
                <EnrichmentBadge
                  industry={metadata.industry}
                  companySize={metadata.company_size_estimate}
                  seniorityLevel={metadata.seniority_level}
                  showAll={true}
                />
              </div>
            )}

            {/* Analysis Date */}
            {metadata.importance_calculated_at && (
              <div className="text-xs text-[var(--color-text-muted)] pt-4 border-t border-[var(--color-border)]">
                Last analyzed: {new Date(metadata.importance_calculated_at).toLocaleString()}
              </div>
            )}
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
              This guest hasn't been analyzed yet. Run AI analysis to get importance scores and enrichment data.
            </p>
            <AnalyzeGuestsButton
              guestId={guestId}
              onComplete={loadGuestData}
            />
          </div>
        )}
      </div>

      {/* Events Section */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Events</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {events.length} {events.length === 1 ? 'event' : 'events'} assigned
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <EmptyState
            title="No events assigned"
            description="This guest hasn't been assigned to any events yet."
            className="py-8"
          />
        ) : (
          <div className="space-y-2">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const formattedDate = eventDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[var(--color-text)]">{event.name}</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {formattedDate} • {event.location}
                      </p>
                    </div>
                    <svg className="h-5 w-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
