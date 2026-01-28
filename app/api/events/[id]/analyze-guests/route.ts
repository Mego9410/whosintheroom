import { NextRequest, NextResponse } from 'next/server';
import { analyzeGuests } from '@/lib/services/importance-scorer';
import { getEventById } from '@/lib/data/events';
import { getGuestsByEvent } from '@/lib/data/event-guests';
import type { AnalyzeEventGuestsRequest, AnalyzeEventGuestsResponse } from '@/lib/types/scoring';

// Force dynamic rendering to prevent build-time analysis
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    
    console.log('[analyze-guests] Event ID:', eventId);
    
    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body: AnalyzeEventGuestsRequest = await request.json().catch(() => ({}));
    const { forceRefresh, event: eventFromBody } = body as any;

    // Fetch event - try from body first (for mock data mode), then from store
    let event = eventFromBody;
    if (!event) {
      console.log('[analyze-guests] Fetching event with ID:', eventId);
      event = await getEventById(eventId);
      console.log('[analyze-guests] Event found:', event ? 'Yes' : 'No', event?.name || 'N/A');
    } else {
      console.log('[analyze-guests] Using event from request body:', event.name);
    }
    
    if (!event) {
      console.error('[analyze-guests] Event not found for ID:', eventId);
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Fetch all guests for this event
    const guests = await getGuestsByEvent(eventId);

    if (guests.length === 0) {
      return NextResponse.json(
        {
          success: true,
          total: 0,
          processed: 0,
          failed: 0,
          results: [],
        },
        { status: 200 }
      );
    }

    // Analyze all guests
    const results = await analyzeGuests(guests, {
      event,
      forceRefresh: forceRefresh || false,
    });

    const processed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    const response: AnalyzeEventGuestsResponse = {
      success: true,
      total: guests.length,
      processed,
      failed,
      results: results.map(r => ({
        guestId: r.guestId,
        success: r.success,
        data: r.result,
        error: r.error,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error analyzing event guests:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        total: 0,
        processed: 0,
        failed: 0,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
