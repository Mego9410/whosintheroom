'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils/cn';

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  if (typeof window === 'undefined') return;
  try {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (error) {
    console.error('Error scrolling to section:', error);
  }
}

export function Header() {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-[var(--color-background)]/80 backdrop-blur-md',
        'border-b border-[var(--color-border)]'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 flex items-center justify-between h-16">
        <Link
          href="/"
          className={cn(
            'font-display text-xl md:text-2xl text-[var(--color-primary)]',
            'hover:opacity-80 transition-opacity',
            'flex-shrink-0'
          )}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Who&apos;s in the <span className="gradient-text">Room</span>
        </Link>

        <nav className="flex items-center gap-6 md:gap-8" aria-label="Main">
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, 'features')}
            className={cn(
              'text-sm md:text-base font-medium text-[var(--color-text-muted)]',
              'hover:text-[var(--color-accent)] transition-colors',
              'hidden sm:inline'
            )}
          >
            Features
          </a>
          <a
            href="#waitlist"
            onClick={(e) => scrollToSection(e, 'waitlist')}
            className={cn(
              'text-sm md:text-base font-semibold',
              'text-[var(--color-accent)] hover:opacity-80 transition-opacity'
            )}
          >
            Join waitlist
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
