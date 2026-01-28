// Helper functions for importance scoring display

/**
 * Get color class based on importance score
 */
export function getImportanceColor(score: number | null | undefined): string {
  if (score === null || score === undefined) {
    return 'bg-gray-100 text-gray-600';
  }

  if (score >= 80) {
    return 'bg-red-100 text-red-800 border-red-200';
  } else if (score >= 60) {
    return 'bg-orange-100 text-orange-800 border-orange-200';
  } else if (score >= 40) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  } else if (score >= 20) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  } else {
    return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

/**
 * Get importance label
 */
export function getImportanceLabel(score: number | null | undefined): string {
  if (score === null || score === undefined) {
    return 'Not Scored';
  }

  if (score >= 80) {
    return 'Very High';
  } else if (score >= 60) {
    return 'High';
  } else if (score >= 40) {
    return 'Medium';
  } else if (score >= 20) {
    return 'Low';
  } else {
    return 'Very Low';
  }
}

/**
 * Format importance score for display
 */
export function formatImportanceScore(score: number | null | undefined): string {
  if (score === null || score === undefined) {
    return '—';
  }
  return Math.round(score).toString();
}
