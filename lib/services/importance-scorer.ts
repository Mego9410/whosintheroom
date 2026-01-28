// Importance scoring and enrichment service using OpenAI

import { openai, rateLimitedRequest, DEFAULT_MODEL, DEFAULT_TEMPERATURE, handleOpenAIError } from './openai';
import { SYSTEM_PROMPT, buildUserPrompt, IMPORTANCE_SCORING_SCHEMA } from '@/lib/prompts/importance-prompt';
import { generateDataHash, getCachedScore } from '@/lib/cache/importance-cache';
import { saveFullAnalysis } from '@/lib/data/guest-metadata';
import { fetchProfilePicture } from './profile-picture';
import type { Guest } from '@/lib/types';
import type { Event } from '@/lib/types';
import type { GuestAnalysisResult, ImportanceScore, GuestEnrichment } from '@/lib/types/scoring';

export interface AnalyzeGuestOptions {
  guest: Guest;
  event?: Event;
  organizationName?: string;
  forceRefresh?: boolean;
}

/**
 * Analyze a guest and return importance score, enrichment data, and profile picture
 */
export async function analyzeGuest(options: AnalyzeGuestOptions): Promise<GuestAnalysisResult> {
  const { guest, event, organizationName, forceRefresh = false } = options;

  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const dataHash = generateDataHash(guest);
    const cached = await getCachedScore(guest.id, dataHash);

    if (cached.isValid && cached.metadata) {
      // Return cached result
      return {
        importance: {
          score: cached.metadata.importance_score!,
          reasoning: cached.metadata.importance_reasoning || '',
          factors: cached.metadata.importance_factors || {},
        },
        enrichment: {
          industry: cached.metadata.industry || undefined,
          company_size_estimate: cached.metadata.company_size_estimate || undefined,
          seniority_level: cached.metadata.seniority_level || undefined,
        },
        profilePicture: {
          url: cached.metadata.profile_picture_url || null,
          source: cached.metadata.profile_picture_source || 'none',
        },
      };
    }
  }

  // Fetch profile picture (can be done in parallel, but doing sequentially for simplicity)
  const profilePicture = await fetchProfilePicture(guest.email, null); // TODO: Add LinkedIn URL support

  // Calculate importance score and enrichment using OpenAI
  const dataHash = generateDataHash(guest);
  const { importance, enrichment } = await calculateImportanceScore({
    guest,
    event,
    organizationName,
  });

  // Save all results to database
  await saveFullAnalysis(guest.id, importance, enrichment, profilePicture, dataHash);

  return {
    importance,
    enrichment,
    profilePicture,
  };
}

/**
 * Calculate importance score and enrichment using OpenAI
 */
async function calculateImportanceScore(options: {
  guest: Guest;
  event?: Event;
  organizationName?: string;
}): Promise<{ importance: ImportanceScore; enrichment: GuestEnrichment }> {
  const { guest, event, organizationName } = options;

  try {
    const userPrompt = buildUserPrompt({ guest, event, organizationName });

    const response = await rateLimitedRequest(() =>
      openai.chat.completions.create({
        model: DEFAULT_MODEL,
        temperature: DEFAULT_TEMPERATURE,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
      })
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    const parsed = JSON.parse(content);

    // Validate and map response
    const importance: ImportanceScore = {
      score: Math.max(0, Math.min(100, parsed.importance_score || 0)),
      reasoning: parsed.reasoning || 'No reasoning provided',
      factors: {
        jobTitle: parsed.factors?.jobTitle || 0,
        companySize: parsed.factors?.companySize || 0,
        industry: parsed.factors?.industry || 0,
        seniority: parsed.factors?.seniority || 0,
        relationship: parsed.factors?.relationship || 0,
        eventRelevance: parsed.factors?.eventRelevance || 0,
      },
    };

    const enrichment: GuestEnrichment = {
      industry: parsed.enrichment?.industry,
      company_size_estimate: parsed.enrichment?.company_size_estimate,
      seniority_level: parsed.enrichment?.seniority_level,
    };

    return { importance, enrichment };
  } catch (error) {
    const openaiError = handleOpenAIError(error);
    console.error('Error calculating importance score:', openaiError);
    throw new Error(`Failed to calculate importance score: ${openaiError.message}`);
  }
}

/**
 * Analyze multiple guests (for batch processing)
 */
export async function analyzeGuests(
  guests: Guest[],
  options?: {
    event?: Event;
    organizationName?: string;
    forceRefresh?: boolean;
  }
): Promise<Array<{ guestId: string; success: boolean; result?: GuestAnalysisResult; error?: string }>> {
  const results = [];

  for (const guest of guests) {
    try {
      const result = await analyzeGuest({
        guest,
        event: options?.event,
        organizationName: options?.organizationName,
        forceRefresh: options?.forceRefresh,
      });
      results.push({
        guestId: guest.id,
        success: true,
        result,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        guestId: guest.id,
        success: false,
        error: errorMessage,
      });
    }
  }

  return results;
}
