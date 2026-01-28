'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getInitials, getAvatarColor } from '@/lib/utils/avatar-helpers';

interface ProfilePictureProps {
  url?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function ProfilePicture({
  url,
  firstName,
  lastName,
  email,
  size = 40,
  className = '',
  alt,
}: ProfilePictureProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(firstName, lastName);
  const colorClass = getAvatarColor(firstName, lastName);
  const displayAlt = alt || `${firstName || ''} ${lastName || ''}`.trim() || email || 'Guest';

  // Show initials if no URL or image failed to load
  if (!url || imageError) {
    return (
      <div
        className={`flex items-center justify-center rounded-full ${colorClass} text-white font-medium flex-shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        title={displayAlt}
      >
        {initials}
      </div>
    );
  }

  // Show image if URL is available
  return (
    <div
      className={`relative flex-shrink-0 rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={url}
        alt={displayAlt}
        width={size}
        height={size}
        className="object-cover"
        onError={() => setImageError(true)}
        unoptimized // Gravatar URLs are external, may need unoptimized
      />
    </div>
  );
}
