import { NextRequest, NextResponse } from 'next/server';
import { analyzeGuests } from '@/lib/services/importance-scorer';
import { getGuests } from '@/lib/data/guests';
import type { AnalyzeEventGuestsResponse } from '@/lib/types/scoring';
import type { Guest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { forceRefresh, organizationId, guests: guestsFromBody } = body;

    // For mock data mode, guests should be sent in request body (server can't access localStorage)
    // Otherwise, fetch from database/store
    let guests: Guest[] = Array.isArray(guestsFromBody) ? guestsFromBody : [];
    
    if (guests.length === 0) {
      console.log('[analyze-all] No guests in body, fetching from store...');
      guests = await getGuests(organizationId);
      console.log('[analyze-all] Fetched', guests.length, 'guests from store');
    } else {
      console.log('[analyze-all] Using', guests.length, 'guests from request body');
    }

    if (!guests || guests.length === 0) {
      console.warn('[analyze-all] No guests to analyze');
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
    console.error('Error analyzing all guests:', error);
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
