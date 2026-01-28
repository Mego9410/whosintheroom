'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only';
  className?: string;
  showText?: boolean;
  href?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

export function Logo({
  size = 'md',
  variant = 'icon-only',
  className,
  showText = false,
  href = '/',
  onClick,
}: LogoProps) {
  const iconSize = sizeMap[size];
  
  const logoContent = (
    <>
      <span
        className="flex-shrink-0 inline-block"
        style={{ width: iconSize, height: iconSize }}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          fill="none"
          width={iconSize}
          height={iconSize}
          className="w-full h-full"
          role="img"
          aria-label="GuestSync Logo"
        >
          <title>GuestSync Logo</title>
          <defs>
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff3b5c" />
              <stop offset="50%" stopColor="#ff6b35" />
              <stop offset="100%" stopColor="#ffa500" />
            </linearGradient>
          </defs>
          <rect x="20" y="80" width="20" height="20" rx="4" fill="url(#brandGradient)" opacity="0.4" />
          <rect x="50" y="60" width="20" height="40" rx="4" fill="url(#brandGradient)" opacity="0.7" />
          <rect x="80" y="30" width="20" height="70" rx="4" fill="url(#brandGradient)" />
          <path d="M 30 90 Q 50 85 70 80" stroke="url(#brandGradient)" strokeWidth="2" fill="none" opacity="0.3" />
        </svg>
      </span>
      {(showText || variant === 'full') && (
        <span
          className={cn(
            'font-display text-[var(--color-primary)]',
            'gradient-text'
          )}
          style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.25rem' : size === 'lg' ? '1.5rem' : '2rem'
          }}
        >
          GuestSync
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-3',
          'transition-opacity duration-300',
          'hover:opacity-80 cursor-pointer',
          className
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {logoContent}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-3',
        'transition-opacity duration-300',
        'hover:opacity-80',
        className
      )}
      aria-label="GuestSync Home"
    >
      {logoContent}
    </Link>
  );
}
