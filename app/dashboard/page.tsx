'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { AIAnalysis } from '@/components/dashboard/AIAnalysis';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { getEvents } from '@/lib/data/events';
import { getGuests } from '@/lib/data/guests';
import { getActivityStore } from '@/lib/mock-data/activity';
import { seedData } from '@/lib/mock-data/seed';
import { USE_SUPABASE } from '@/lib/config/data-source';
import type { Event } from '@/lib/types';
import type { Guest } from '@/lib/types';
import type { Activity } from '@/lib/mock-data/activity';

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted immediately
    setMounted(true);
    
    // Only run in browser (client-side)
    if (typeof window === 'undefined') {
      return;
    }
    
    // Debug logging
    console.log('Dashboard: USE_SUPABASE =', USE_SUPABASE);
    console.log('Dashboard: Starting data load...');
    
    // Small delay to ensure everything is ready
    const timer = setTimeout(() => {
      // Seed data on first load (with error handling)
      try {
        console.log('Dashboard: Seeding data...');
        seedData();
        console.log('Dashboard: Data seeded successfully');
      } catch (error) {
        console.warn('Error seeding data:', error);
      }
      
      loadDashboardData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const loadDashboardData = async () => {
    console.log('Dashboard: loadDashboardData called');
    try {
      setLoading(true);
      setError(null);
      
      console.log('Dashboard: Fetching events and guests...');
      
      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.warn('Dashboard data loading timeout - using empty data');
        setEvents([]);
        setGuests([]);
        setActivities([]);
        setLoading(false);
      }, 5000); // 5 second timeout
      
      try {
        console.log('Dashboard: Calling getEvents()...');
        const eventsPromise = getEvents().catch(err => {
          console.error('Error loading events:', err);
          return [];
        });
        
        console.log('Dashboard: Calling getGuests()...');
        const guestsPromise = getGuests().catch(err => {
          console.error('Error loading guests:', err);
          return [];
        });
        
        console.log('Dashboard: Waiting for Promise.all...');
        const [allEvents, allGuests] = await Promise.all([eventsPromise, guestsPromise]);
        
        clearTimeout(timeoutId);
        
        console.log('Dashboard: Loaded', allEvents?.length || 0, 'events and', allGuests?.length || 0, 'guests');
        console.log('Dashboard: Events:', allEvents);
        console.log('Dashboard: Guests:', allGuests);
        
        setEvents(Array.isArray(allEvents) ? allEvents : []);
        setGuests(Array.isArray(allGuests) ? allGuests : []);

        // Load recent activity
        try {
          const activityStore = getActivityStore();
          const recentActivities = activityStore.getRecent(10);
          setActivities(recentActivities || []);
        } catch (err) {
          console.warn('Error loading activity:', err);
          setActivities([]);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data. Please try again.');
      // Set empty arrays on error so page can still render
      setEvents([]);
      setGuests([]);
      setActivities([]);
    } finally {
      console.log('Dashboard: Loading complete');
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= sevenDaysFromNow && event.status !== 'completed' && event.status !== 'cancelled';
    });

    const recentAdditions = guests.filter(guest => {
      const guestDate = new Date(guest.created_at);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return guestDate >= sevenDaysAgo;
    }).length;

    return {
      totalEvents: events.length,
      totalGuests: guests.length,
      upcomingEvents: upcomingEvents.length,
      recentAdditions,
    };
  }, [events, guests]);

  // Get upcoming events (next 5-7 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= sevenDaysFromNow && event.status !== 'completed' && event.status !== 'cancelled';
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [events]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-[var(--color-text-muted)] mb-4">Loading dashboard...</p>
        <button
          onClick={() => {
            console.log('Manual refresh clicked');
            setLoading(false);
            loadDashboardData();
          }}
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          Click here if loading takes too long
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Dashboard</h1>
        <ErrorMessage 
          title="Failed to load dashboard" 
          message={error} 
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Welcome back! Here's what's happening with your events.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* AI Analysis Section */}
      <AIAnalysis />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <UpcomingEvents events={upcomingEvents} />

        {/* Recent Activity */}
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}
