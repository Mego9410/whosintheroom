// Prompt templates for guest importance scoring and enrichment

import type { Guest } from '@/lib/types';
import type { Event } from '@/lib/types';

export interface GuestAnalysisContext {
  guest: Guest;
  event?: Event;
  organizationName?: string;
}

export const SYSTEM_PROMPT = `You are an expert at analyzing B2B event attendees and determining their importance/value to event organizers.

Your task is to:
1. Calculate an importance score (0-100) based on multiple factors
2. Provide reasoning for the score
3. Extract enrichment data (industry, company size estimate, seniority level)

Scoring Criteria (weighted):
- Job Title/Seniority (30%): C-Level executives, VPs, Directors score higher than Managers or Individual Contributors
- Company Size/Importance (25%): Fortune 500, large enterprises score higher than startups or small companies
- Industry Influence (20%): Industry leaders, well-known companies score higher
- Relationship to Organizer (15%): Based on notes, past interactions, referrals
- Event-Specific Relevance (10%): How relevant this person is to the specific event theme/industry

Enrichment Data:
- Industry: Classify into standard industries (e.g., "Technology", "Finance", "Healthcare", "Manufacturing", etc.)
- Company Size Estimate: Categorize as "1-10", "11-50", "51-200", "201-500", or "500+"
- Seniority Level: Classify as "C-Level", "VP", "Director", "Manager", or "Individual Contributor"

Respond with valid JSON only, no markdown formatting.`;

export function buildUserPrompt(context: GuestAnalysisContext): string {
  const { guest, event, organizationName } = context;
  
  let prompt = `Analyze this event attendee and provide an importance score and enrichment data:\n\n`;
  
  prompt += `Guest Information:\n`;
  prompt += `- Name: ${guest.first_name} ${guest.last_name}\n`;
  prompt += `- Email: ${guest.email}\n`;
  
  if (guest.company) {
    prompt += `- Company: ${guest.company}\n`;
  }
  
  if (guest.job_title) {
    prompt += `- Job Title: ${guest.job_title}\n`;
  }
  
  if (guest.phone) {
    prompt += `- Phone: ${guest.phone}\n`;
  }
  
  if (guest.notes) {
    prompt += `- Notes: ${guest.notes}\n`;
  }
  
  if (event) {
    prompt += `\nEvent Context:\n`;
    prompt += `- Event Name: ${event.name}\n`;
    prompt += `- Date: ${new Date(event.date).toLocaleDateString()}\n`;
    prompt += `- Location: ${event.location}\n`;
    if (event.description) {
      prompt += `- Description: ${event.description}\n`;
    }
  }
  
  if (organizationName) {
    prompt += `\nOrganizing Organization: ${organizationName}\n`;
  }
  
  prompt += `\nProvide your analysis in the following JSON format:\n`;
  prompt += `{\n`;
  prompt += `  "importance_score": <number 0-100>,\n`;
  prompt += `  "reasoning": "<explanation of the score>",\n`;
  prompt += `  "factors": {\n`;
  prompt += `    "jobTitle": <number 0-100>,\n`;
  prompt += `    "companySize": <number 0-100>,\n`;
  prompt += `    "industry": <number 0-100>,\n`;
  prompt += `    "seniority": <number 0-100>,\n`;
  prompt += `    "relationship": <number 0-100>,\n`;
  prompt += `    "eventRelevance": <number 0-100>\n`;
  prompt += `  },\n`;
  prompt += `  "enrichment": {\n`;
  prompt += `    "industry": "<industry classification>",\n`;
  prompt += `    "company_size_estimate": "<1-10|11-50|51-200|201-500|500+>",\n`;
  prompt += `    "seniority_level": "<C-Level|VP|Director|Manager|Individual Contributor>"\n`;
  prompt += `  }\n`;
  prompt += `}`;
  
  return prompt;
}

export const IMPORTANCE_SCORING_SCHEMA = {
  type: 'object',
  properties: {
    importance_score: {
      type: 'number',
      minimum: 0,
      maximum: 100,
      description: 'Overall importance score from 0-100',
    },
    reasoning: {
      type: 'string',
      description: 'Explanation of why this score was assigned',
    },
    factors: {
      type: 'object',
      properties: {
        jobTitle: { type: 'number', minimum: 0, maximum: 100 },
        companySize: { type: 'number', minimum: 0, maximum: 100 },
        industry: { type: 'number', minimum: 0, maximum: 100 },
        seniority: { type: 'number', minimum: 0, maximum: 100 },
        relationship: { type: 'number', minimum: 0, maximum: 100 },
        eventRelevance: { type: 'number', minimum: 0, maximum: 100 },
      },
      required: ['jobTitle', 'companySize', 'industry', 'seniority', 'relationship', 'eventRelevance'],
    },
    enrichment: {
      type: 'object',
      properties: {
        industry: {
          type: 'string',
          description: 'Industry classification',
        },
        company_size_estimate: {
          type: 'string',
          enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
          description: 'Estimated company size category',
        },
        seniority_level: {
          type: 'string',
          enum: ['C-Level', 'VP', 'Director', 'Manager', 'Individual Contributor'],
          description: 'Detected seniority level',
        },
      },
      required: ['industry', 'company_size_estimate', 'seniority_level'],
    },
  },
  required: ['importance_score', 'reasoning', 'factors', 'enrichment'],
} as const;
