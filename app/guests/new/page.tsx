'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GuestForm } from '@/components/guests/GuestForm';
import { createGuest } from '@/lib/data/guests';
import type { CreateGuestInput, UpdateGuestInput } from '@/lib/types';

export default function NewGuestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateGuestInput | UpdateGuestInput) => {
    try {
      setIsLoading(true);
      // Validate required fields for creation
      if (!data.first_name || !data.last_name || !data.email) {
        alert('Please fill in all required fields (first name, last name, email)');
        setIsLoading(false);
        return;
      }
      
      // Ensure all required fields are present for creation
      const createData: CreateGuestInput = {
        organization_id: data.organization_id || 'org_default',
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        company: data.company,
        job_title: data.job_title,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        created_by: data.created_by || 'user_default',
      };
      const newGuest = await createGuest(createData);
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
