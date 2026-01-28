// OpenAI client setup and configuration

import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default model configuration
export const DEFAULT_MODEL = 'gpt-4o-mini' as const;
export const DEFAULT_TEMPERATURE = 0.0; // For consistent results

// Rate limiting configuration
// gpt-4o-mini: 3,500 RPM (requests per minute)
export const RATE_LIMIT_RPM = 3500;
export const RATE_LIMIT_DELAY_MS = (60 * 1000) / RATE_LIMIT_RPM; // ~17ms between requests

// Simple rate limiter (for sequential requests)
let lastRequestTime = 0;

export async function rateLimitedRequest<T>(
  requestFn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY_MS) {
    const delay = RATE_LIMIT_DELAY_MS - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
  return requestFn();
}

// Error handling utilities
export class OpenAIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export function handleOpenAIError(error: unknown): OpenAIError {
  if (error instanceof OpenAI.APIError) {
    return new OpenAIError(
      error.message || 'OpenAI API error',
      error.status,
      error
    );
  }
  
  if (error instanceof Error) {
    return new OpenAIError(error.message, undefined, error);
  }
  
  return new OpenAIError('Unknown OpenAI error', undefined, error);
}
