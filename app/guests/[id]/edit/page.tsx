'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GuestForm } from '@/components/guests/GuestForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { getGuestById, updateGuest } from '@/lib/data/guests';
import type { Guest, UpdateGuestInput } from '@/lib/types';

export default function EditGuestPage() {
  const params = useParams();
  const router = useRouter();
  const guestId = params.id as string;

  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadGuest();
  }, [guestId]);

  const loadGuest = async () => {
    try {
      setLoading(true);
      setError(null);
      const guestData = await getGuestById(guestId);
      if (!guestData) {
        setError('Guest not found');
        return;
      }
      setGuest(guestData);
    } catch (error) {
      console.error('Error loading guest:', error);
      setError(error instanceof Error ? error.message : 'Failed to load guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateGuestInput) => {
    try {
      setIsSaving(true);
      await updateGuest(guestId, data);
      router.push(`/guests/${guestId}`);
    } catch (error) {
      console.error('Error updating guest:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to update guest. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/guests/${guestId}`);
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
          message={error || 'The guest you\'re trying to edit doesn\'t exist or has been deleted.'}
          onRetry={loadGuest}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/guests/${guestId}`}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4 inline-block"
        >
          ← Back to Guest
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Edit Guest</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Update the guest information below
        </p>
      </div>

      {/* Form */}
      <GuestForm
        guest={guest}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </div>
  );
}
