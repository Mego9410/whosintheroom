'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getGuests } from '@/lib/data/guests';
import type { Event, Guest } from '@/lib/types';

interface AnalyzeGuestsButtonProps {
  eventId?: string;
  event?: Event; // Optional event data to send in request body (for mock data mode)
  guestId?: string;
  analyzeAll?: boolean; // Analyze all guests (not tied to an event)
  onComplete?: () => void;
  className?: string;
}

export function AnalyzeGuestsButton({
  eventId,
  event: eventData,
  guestId,
  analyzeAll = false,
  onComplete,
  className = '',
}: AnalyzeGuestsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    console.log('[AnalyzeGuestsButton] Button clicked, starting analysis...', { eventId, guestId, analyzeAll });
    
    setIsLoading(true);
    setError(null);

    try {
      let url: string;
      let body: any = { forceRefresh: false };
      
      if (eventId) {
        url = `/api/events/${eventId}/analyze-guests`;
        // Include event data in body for mock data mode (server can't access localStorage)
        if (eventData) {
          body.event = eventData;
        }
      } else if (guestId) {
        url = `/api/guests/${guestId}/analyze`;
      } else if (analyzeAll) {
        url = `/api/guests/analyze-all`;
        // For mock data mode, fetch guests client-side and send in body (server can't access localStorage)
        console.log('[AnalyzeGuestsButton] Fetching guests client-side for analyze-all...');
        const allGuests = await getGuests();
        console.log('[AnalyzeGuestsButton] Fetched', allGuests.length, 'guests');
        body.guests = allGuests;
      } else {
        throw new Error('Either eventId, guestId, or analyzeAll must be provided');
      }

      console.log('[AnalyzeGuestsButton] Sending request to', url, 'with', body.guests?.length || 0, 'guests');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze guests');
      }

      // Show success message
      const processed = data.processed || 0;
      const total = data.total || 0;
      console.log('Analysis complete:', data);
      console.log(`Successfully analyzed ${processed} of ${total} guests`);
      
      // Show alert for user feedback
      if (processed > 0) {
        alert(`Successfully analyzed ${processed} of ${total} guests!`);
      } else {
        alert('Analysis completed, but no guests were processed. Check console for details.');
      }

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error analyzing guests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        type="button"
        onClick={handleAnalyze}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <svg
              className="-ml-1 mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            {eventId ? 'Analyze All Guests' : analyzeAll ? 'Analyze All Guests' : 'Analyze Guest'}
          </>
        )}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
