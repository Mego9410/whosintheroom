'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GuestForm } from '@/components/guests/GuestForm';
import { createGuest } from '@/lib/data/guests';
import type { CreateGuestInput } from '@/lib/types';

export default function NewGuestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateGuestInput) => {
    try {
      setIsLoading(true);
      const newGuest = await createGuest(data);
      router.push(`/guests/${newGuest.id}`);
    } catch (error) {
      console.error('Error creating guest:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to create guest. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/guests');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/guests"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4 inline-block"
        >
          ← Back to Guests
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Create Guest</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Add a new guest to your database
        </p>
      </div>

      {/* Form */}
      <GuestForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
    </div>
  );
}
