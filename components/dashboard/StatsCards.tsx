'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  href?: string;
  trend?: {
    value: number;
    label: string;
  };
}

function StatCard({ title, value, icon, href, trend }: StatCardProps) {
  const content = (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[var(--color-text)]">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm mt-2",
              trend.value > 0 ? "text-green-600" : trend.value < 0 ? "text-red-600" : "text-[var(--color-text-muted)]"
            )}>
              {trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'} {trend.label}
            </p>
          )}
        </div>
        <div className="text-[var(--color-accent)] opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

interface StatsCardsProps {
  stats: {
    totalEvents: number;
    totalGuests: number;
    upcomingEvents: number;
    recentAdditions: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Events"
        value={stats.totalEvents}
        href="/events"
        icon={
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />
      <StatCard
        title="Total Guests"
        value={stats.totalGuests}
        href="/guests"
        icon={
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
      <StatCard
        title="Upcoming Events"
        value={stats.upcomingEvents}
        href="/events"
        icon={
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        title="Recent Additions"
        value={stats.recentAdditions}
        href="/guests"
        icon={
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
      />
    </div>
  );
}
