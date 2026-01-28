'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { Guest, CreateGuestInput, UpdateGuestInput } from '@/lib/types';

interface GuestFormProps {
  guest?: Guest;
  onSubmit: (data: CreateGuestInput | UpdateGuestInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const DEFAULT_ORG_ID = 'org_default';
const DEFAULT_USER_ID = 'user_default';

export function GuestForm({ guest, onSubmit, onCancel, isLoading = false }: GuestFormProps) {
  const [formData, setFormData] = useState({
    first_name: guest?.first_name || '',
    last_name: guest?.last_name || '',
    email: guest?.email || '',
    company: guest?.company || '',
    job_title: guest?.job_title || '',
    phone: guest?.phone || '',
    address: guest?.address || '',
    notes: guest?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submitData: CreateGuestInput | UpdateGuestInput = {
      organization_id: DEFAULT_ORG_ID,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim().toLowerCase(),
      company: formData.company.trim() || undefined,
      job_title: formData.job_title.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      address: formData.address.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      created_by: DEFAULT_USER_ID,
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      // Handle email uniqueness error
      if (error instanceof Error && error.message.includes('already exists')) {
        setErrors({ email: 'A guest with this email already exists' });
      } else {
        throw error;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name *"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            error={errors.first_name}
            placeholder="John"
            required
          />
          <Input
            label="Last Name *"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            error={errors.last_name}
            placeholder="Smith"
            required
          />
        </div>

        {/* Email */}
        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="john.smith@example.com"
          required
        />

        {/* Company & Job Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Inc."
          />
          <Input
            label="Job Title"
            value={formData.job_title}
            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
            placeholder="CEO"
          />
        </div>

        {/* Phone */}
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1-555-0100"
        />

        {/* Address */}
        <Textarea
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="123 Main St, City, State, ZIP"
          rows={2}
        />

        {/* Notes */}
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes about this guest..."
          rows={4}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : guest ? 'Update Guest' : 'Create Guest'}
        </Button>
      </div>
    </form>
  );
}
