import { NextRequest, NextResponse } from 'next/server';
import { analyzeGuest } from '@/lib/services/importance-scorer';
import { getGuestById } from '@/lib/data/guests';
import { getEventById } from '@/lib/data/events';
import type { AnalyzeGuestRequest, AnalyzeGuestResponse } from '@/lib/types/scoring';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guestId = params.id;
    
    if (!guestId) {
      return NextResponse.json(
        { success: false, error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body: AnalyzeGuestRequest = await request.json().catch(() => ({}));
    const { eventId, forceRefresh } = body;

    // Fetch guest
    const guest = await getGuestById(guestId);
    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      );
    }

    // Fetch event if eventId provided
    let event = undefined;
    if (eventId) {
      event = await getEventById(eventId);
    }

    // Analyze guest
    const result = await analyzeGuest({
      guest,
      event,
      forceRefresh: forceRefresh || false,
    });

    const response: AnalyzeGuestResponse = {
      success: true,
      data: result,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error analyzing guest:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    const response: AnalyzeGuestResponse = {
      success: false,
      error: errorMessage,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
