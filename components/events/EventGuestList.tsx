'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { ProfilePicture } from '@/components/ProfilePicture';
import { ImportanceBadge } from '@/components/ImportanceBadge';
import { EnrichmentBadge } from '@/components/EnrichmentBadge';
import { getEventGuests, updateEventGuest, removeGuestFromEvent } from '@/lib/data/event-guests';
import { getGuestsMetadata } from '@/lib/data/guest-metadata';
import type { EventGuest, Guest } from '@/lib/types';
import type { GuestMetadata } from '@/lib/types/scoring';

interface EventGuestListProps {
  eventId: string;
  guests: Guest[];
  onUpdate: () => void;
}

const RSVP_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'invited', label: 'Invited' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'maybe', label: 'Maybe' },
] as const;

const rsvpColors: Record<EventGuest['rsvp_status'], 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'default',
  invited: 'info',
  accepted: 'success',
  declined: 'danger',
  maybe: 'warning',
};

export function EventGuestList({ eventId, guests, onUpdate }: EventGuestListProps) {
  const [relationships, setRelationships] = useState<Map<string, EventGuest>>(new Map());
  const [metadataMap, setMetadataMap] = useState<Map<string, GuestMetadata>>(new Map());
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadRelationships();
  }, [eventId, guests]);

  React.useEffect(() => {
    loadMetadata();
  }, [guests]);

  const loadRelationships = async () => {
    try {
      setLoading(true);
      const eventGuests = await getEventGuests(eventId);
      const relMap = new Map<string, EventGuest>();
      eventGuests.forEach(rel => {
        relMap.set(rel.guest_id, rel);
      });
      setRelationships(relMap);
    } catch (error) {
      console.error('Error loading relationships:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetadata = async () => {
    try {
      const guestIds = guests.map(g => g.id);
      const metadata = await getGuestsMetadata(guestIds);
      setMetadataMap(metadata);
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  };

  const handleRSVPChange = async (guestId: string, newStatus: EventGuest['rsvp_status']) => {
    try {
      const relationship = relationships.get(guestId);
      if (!relationship) return;

      await updateEventGuest(relationship.id, { rsvp_status: newStatus });
      await loadRelationships();
      onUpdate();
    } catch (error) {
      console.error('Error updating RSVP status:', error);
      alert('Failed to update RSVP status');
    }
  };

  const handleRemove = async (guestId: string) => {
    if (!confirm('Remove this guest from the event?')) {
      return;
    }

    try {
      await removeGuestFromEvent(eventId, guestId);
      await loadRelationships();
      onUpdate();
    } catch (error) {
      console.error('Error removing guest:', error);
      alert('Failed to remove guest');
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-[var(--color-text-muted)]">Loading...</div>;
  }

  if (guests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {guests.map((guest) => {
        const relationship = relationships.get(guest.id);
        const rsvpStatus = relationship?.rsvp_status || 'pending';
        const initials = `${guest.first_name[0]}${guest.last_name[0]}`.toUpperCase();

        const metadata = metadataMap.get(guest.id);

        return (
          <div
            key={guest.id}
            className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Profile Picture */}
              <ProfilePicture
                url={metadata?.profile_picture_url}
                firstName={guest.first_name}
                lastName={guest.last_name}
                email={guest.email}
                size={40}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/guests/${guest.id}`}
                    className="font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] truncate"
                  >
                    {guest.first_name} {guest.last_name}
                  </Link>
                  {metadata && (
                    <ImportanceBadge score={metadata.importance_score} size="sm" />
                  )}
                </div>
                {guest.company && (
                  <p className="text-sm text-[var(--color-text-muted)] truncate mb-1">{guest.company}</p>
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
            </div>

            <div className="flex items-center gap-3">
              {/* RSVP Status */}
              <Select
                value={rsvpStatus}
                onChange={(e) => handleRSVPChange(guest.id, e.target.value as EventGuest['rsvp_status'])}
                options={RSVP_STATUSES}
                className="w-32"
              />

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(guest.id)}
                className="text-red-600 hover:text-red-700 p-2 rounded transition-colors"
                aria-label="Remove guest"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
