'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Event, CreateEventInput, UpdateEventInput } from '@/lib/types';

interface EventFormProps {
  event?: Event;
  onSubmit: (data: CreateEventInput | UpdateEventInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const DEFAULT_ORG_ID = 'org_default';
const DEFAULT_USER_ID = 'user_default';

export function EventForm({ event, onSubmit, onCancel, isLoading = false }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: event?.name || '',
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    location: event?.location || '',
    description: event?.description || '',
    status: event?.status || 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date and time is required';
    } else {
      const selectedDate = new Date(formData.date);
      if (selectedDate < new Date()) {
        // Allow past dates for editing existing events
        if (!event) {
          newErrors.date = 'Event date cannot be in the past';
        }
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submitData: CreateEventInput | UpdateEventInput = {
      organization_id: DEFAULT_ORG_ID,
      name: formData.name.trim(),
      date: new Date(formData.date).toISOString(),
      location: formData.location.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status as Event['status'],
      created_by: DEFAULT_USER_ID,
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 space-y-6">
        {/* Event Name */}
        <Input
          label="Event Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="e.g., Tech Summit 2024"
          required
        />

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                errors.date ? 'border-red-500' : 'border-[var(--color-border)]'
              }`}
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
            )}
          </div>

          {/* Status */}
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Event['status'] })}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </div>

        {/* Location */}
        <Input
          label="Location *"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          error={errors.location}
          placeholder="e.g., San Francisco Convention Center"
          required
        />

        {/* Description */}
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add details about your event..."
          rows={4}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        {formData.status === 'draft' ? (
          <Button type="submit" variant="secondary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Draft'}
          </Button>
        ) : null}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}
