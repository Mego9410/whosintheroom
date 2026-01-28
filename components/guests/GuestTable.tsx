'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { Guest } from '@/lib/types';

interface GuestTableProps {
  guests: Guest[];
}

export function GuestTable({ guests }: GuestTableProps) {
  const getInitials = (guest: Guest) => {
    return `${guest.first_name[0]}${guest.last_name[0]}`.toUpperCase();
  };

  if (guests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-muted)]">No guests found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full">
        <thead className="bg-[var(--color-background-alt)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Job Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[var(--color-surface)] divide-y divide-[var(--color-border)]">
          {guests.map((guest) => {
            const initials = getInitials(guest);
            return (
              <tr
                key={guest.id}
                className="hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#ff3b5c] to-[#ff6b35] flex items-center justify-center text-white text-xs font-semibold">
                      {initials}
                    </div>
                    <Link
                      href={`/guests/${guest.id}`}
                      className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]"
                    >
                      {guest.first_name} {guest.last_name}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                  {guest.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                  {guest.company || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                  {guest.job_title || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
                  {guest.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/guests/${guest.id}`}
                    className="text-[var(--color-accent)] hover:text-[var(--color-accent-secondary)]"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
