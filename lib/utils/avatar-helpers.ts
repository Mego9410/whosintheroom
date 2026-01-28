// Helper functions for avatar/profile picture display

/**
 * Generate initials from name
 */
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.trim().charAt(0).toUpperCase() || '';
  const last = lastName?.trim().charAt(0).toUpperCase() || '';
  return (first + last) || '?';
}

/**
 * Get default avatar color based on name (for consistent colors)
 */
export function getAvatarColor(firstName?: string, lastName?: string): string {
  const name = `${firstName || ''}${lastName || ''}`;
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
  ];
  
  if (!name) {
    return colors[0];
  }
  
  // Simple hash function to get consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}
