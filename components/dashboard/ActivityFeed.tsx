'use client';

import React from 'react';
import Link from 'next/link';
import { getActivityStore } from '@/lib/mock-data/activity';
import type { Activity } from '@/lib/mock-data/activity';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'event_created':
      case 'event_updated':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'guest_created':
      case 'guest_assigned':
      case 'guest_removed':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActivityLink = (activity: Activity) => {
    if (activity.entity_type === 'event') {
      return `/events/${activity.entity_id}`;
    } else {
      return `/guests/${activity.entity_id}`;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Recent Activity</h2>
        <p className="text-[var(--color-text-muted)] text-center py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={getActivityLink(activity)}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors group"
          >
            <div className="text-[var(--color-accent)] mt-0.5 flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                {activity.description}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {formatTime(activity.created_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
