'use client';

import React, { useState } from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import type { Event } from '@/lib/types';

interface EventAssignmentProps {
  events: Event[];
  onAssignToExisting: (eventId: string) => void;
  onCreateAndAssign: (eventData: { name: string; date: string; location: string; description?: string }) => void;
  isLoading?: boolean;
}

export function EventAssignment({
  events,
  onAssignToExisting,
  onCreateAndAssign,
  isLoading = false,
}: EventAssignmentProps) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  const handleAssignToExisting = () => {
    if (selectedEventId) {
      onAssignToExisting(selectedEventId);
    }
  };

  const handleCreateAndAssign = () => {
    if (newEventName && newEventDate && newEventLocation) {
      // Convert datetime-local format to ISO string
      const dateISO = new Date(newEventDate).toISOString();
      onCreateAndAssign({
        name: newEventName,
        date: dateISO,
        location: newEventLocation,
        description: newEventDescription || undefined,
      });
      setShowCreateModal(false);
      // Reset form
      setNewEventName('');
      setNewEventDate('');
      setNewEventLocation('');
      setNewEventDescription('');
    }
  };

  // Get tomorrow's date as default
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[var(--color-surface)] border-2 border-blue-500 dark:border-blue-400 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-[var(--color-text)] dark:text-[var(--color-text)] mb-2">
          Assign Guests to Event (Optional)
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted)]">
          You can assign all imported guests to an existing event or create a new event for them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assign to Existing Event */}
        <div className="border border-[var(--color-border)] rounded-lg p-4">
          <h4 className="font-medium text-[var(--color-text)] mb-3">Assign to Existing Event</h4>
          <div className="space-y-3">
            <Select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              options={[
                { value: '', label: 'Select an event...' },
                ...events.map(event => ({
                  value: event.id,
                  label: event.name,
                })),
              ]}
              disabled={isLoading}
            />
            <Button
              onClick={handleAssignToExisting}
              disabled={!selectedEventId || isLoading}
              className="w-full"
              variant="secondary"
            >
              {isLoading ? 'Assigning...' : 'Assign to Selected Event'}
            </Button>
          </div>
        </div>

        {/* Create New Event */}
        <div className="border border-[var(--color-border)] rounded-lg p-4">
          <h4 className="font-medium text-[var(--color-text)] mb-3">Create New Event</h4>
          <Button
            onClick={() => setShowCreateModal(true)}
            disabled={isLoading}
            className="w-full"
            variant="secondary"
          >
            Create Event & Assign Guests
          </Button>
        </div>
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Event"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Event Name *
            </label>
            <Input
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              placeholder="e.g., Annual Conference 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Date & Time *
            </label>
            <Input
              type="datetime-local"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              min={getTomorrowDate()}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Location *
            </label>
            <Input
              value={newEventLocation}
              onChange={(e) => setNewEventLocation(e.target.value)}
              placeholder="e.g., Convention Center, New York"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Description
            </label>
            <Textarea
              value={newEventDescription}
              onChange={(e) => setNewEventDescription(e.target.value)}
              placeholder="Optional event description..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAndAssign}
              disabled={!newEventName || !newEventDate || !newEventLocation || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Event & Assign Guests'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
