'use client';

import { getImportanceColor, getImportanceLabel, formatImportanceScore } from '@/lib/utils/importance-helpers';

interface ImportanceBadgeProps {
  score: number | null | undefined;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ImportanceBadge({ 
  score, 
  showLabel = false, 
  size = 'md',
  className = '' 
}: ImportanceBadgeProps) {
  const colorClass = getImportanceColor(score);
  const label = getImportanceLabel(score);
  const formattedScore = formatImportanceScore(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeClasses[size]} ${className}`}
      title={score !== null && score !== undefined ? `Importance Score: ${score.toFixed(1)}/100` : 'Not scored'}
    >
      <span className="font-semibold">{formattedScore}</span>
      {showLabel && score !== null && score !== undefined && (
        <span className="ml-1.5 text-xs opacity-75">({label})</span>
      )}
    </span>
  );
}
