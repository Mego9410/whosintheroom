'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getGuests } from '@/lib/data/guests';
import { getGuestsByEvent, assignGuestToEvent } from '@/lib/data/event-guests';
import type { Guest } from '@/lib/types';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
}

const DEFAULT_USER_ID = 'user_default';

export function AddGuestModal({ isOpen, onClose, eventId, onSuccess }: AddGuestModalProps) {
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [assignedGuestIds, setAssignedGuestIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      // Reset state when modal closes
      setSearchQuery('');
      setSelectedGuests(new Set());
    }
  }, [isOpen, eventId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [guests, assignedGuests] = await Promise.all([
        getGuests(),
        getGuestsByEvent(eventId),
      ]);
      setAllGuests(guests);
      setAssignedGuestIds(new Set(assignedGuests.map(g => g.id)));
    } catch (error) {
      console.error('Error loading guests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter guests
  const availableGuests = useMemo(() => {
    return allGuests.filter(guest => {
      // Filter out already assigned guests
      if (assignedGuestIds.has(guest.id)) {
        return false;
      }
      // Apply search filter
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          guest.first_name.toLowerCase().includes(lowerQuery) ||
          guest.last_name.toLowerCase().includes(lowerQuery) ||
          guest.email?.toLowerCase().includes(lowerQuery) ||
          guest.company?.toLowerCase().includes(lowerQuery)
        );
      }
      return true;
    });
  }, [allGuests, assignedGuestIds, searchQuery]);

  const handleToggleGuest = (guestId: string) => {
    const newSelected = new Set(selectedGuests);
    if (newSelected.has(guestId)) {
      newSelected.delete(guestId);
    } else {
      newSelected.add(guestId);
    }
    setSelectedGuests(newSelected);
  };

  const handleAssign = async () => {
    if (selectedGuests.size === 0) {
      alert('Please select at least one guest');
      return;
    }

    try {
      setIsAssigning(true);
      const guestIds = Array.from(selectedGuests);
      
      // Assign each guest
      for (const guestId of guestIds) {
        await assignGuestToEvent({
          event_id: eventId,
          guest_id: guestId,
          rsvp_status: 'pending',
          check_in_status: 'not_checked_in',
          assigned_by: DEFAULT_USER_ID,
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning guests:', error);
      alert('Failed to assign guests. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Guests to Event"
      size="lg"
    >
      <div className="space-y-4">
        {/* Search */}
        <Input
          placeholder="Search guests by name, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Guest List */}
        <div className="border border-[var(--color-border)] rounded-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-[var(--color-text-muted)]">
              Loading guests...
            </div>
          ) : availableGuests.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-text-muted)]">
              {searchQuery ? 'No guests found matching your search' : 'No available guests'}
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {availableGuests.map((guest) => {
                const isSelected = selectedGuests.has(guest.id);
                const initials = `${guest.first_name[0]}${guest.last_name[0]}`.toUpperCase();
                
                return (
                  <label
                    key={guest.id}
                    className={`
                      flex items-center gap-3 p-4 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors
                      ${isSelected ? 'bg-[var(--color-accent)]/10' : ''}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleGuest(guest.id)}
                      className="w-4 h-4 text-[var(--color-accent)] rounded focus:ring-[var(--color-accent)]"
                    />
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ff3b5c] to-[#ff6b35] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--color-text)]">
                        {guest.first_name} {guest.last_name}
                      </div>
                      <div className="text-sm text-[var(--color-text-muted)] truncate">
                        {guest.email}
                        {guest.company && ` • ${guest.company}`}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Selection Info */}
        {selectedGuests.size > 0 && (
          <div className="text-sm text-[var(--color-text-muted)]">
            {selectedGuests.size} {selectedGuests.size === 1 ? 'guest' : 'guests'} selected
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button variant="outline" onClick={onClose} disabled={isAssigning}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isAssigning || selectedGuests.size === 0}>
            {isAssigning ? 'Assigning...' : `Assign ${selectedGuests.size > 0 ? `(${selectedGuests.size})` : ''}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
