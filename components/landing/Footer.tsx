'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  if (typeof window === 'undefined') return;

  const attemptScroll = () => {
    try {
      const el = document.getElementById(id);
      if (el) {
        const headerHeight = 64;
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  if (!attemptScroll()) {
    setTimeout(() => {
      if (!attemptScroll()) {
        setTimeout(() => attemptScroll(), 300);
      }
    }, 100);
  }
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const isHome = usePathname() === '/';

  return (
    <footer
      className={cn(
        'w-full border-t border-[var(--color-border)]',
        'bg-[var(--color-background-alt)]'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <Link
            href="/"
            className={cn(
              'font-display text-lg md:text-xl text-[var(--color-primary)]',
              'hover:opacity-80 transition-opacity',
              'flex-shrink-0'
            )}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="gradient-text">GuestSync</span>
          </Link>

          <nav className="flex items-center gap-6 md:gap-8" aria-label="Footer">
            {isHome ? (
              <>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className={cn(
                    'text-sm font-medium text-[var(--color-text-muted)]',
                    'hover:text-[var(--color-accent)] transition-colors'
                  )}
                >
                  How it works
                </a>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, 'features')}
                  className={cn(
                    'text-sm font-medium text-[var(--color-text-muted)]',
                    'hover:text-[var(--color-accent)] transition-colors'
                  )}
                >
                  Features
                </a>
                <a
                  href="#waitlist"
                  onClick={(e) => scrollToSection(e, 'waitlist')}
                  className={cn(
                    'text-sm font-semibold text-[var(--color-accent)]',
                    'hover:opacity-80 transition-opacity'
                  )}
                >
                  Join waitlist
                </a>
              </>
            ) : (
              <>
                <Link
                  href="/#how-it-works"
                  className={cn(
                    'text-sm font-medium text-[var(--color-text-muted)]',
                    'hover:text-[var(--color-accent)] transition-colors'
                  )}
                >
                  How it works
                </Link>
                <Link
                  href="/#features"
                  className={cn(
                    'text-sm font-medium text-[var(--color-text-muted)]',
                    'hover:text-[var(--color-accent)] transition-colors'
                  )}
                >
                  Features
                </Link>
                <Link
                  href="/#waitlist"
                  className={cn(
                    'text-sm font-semibold text-[var(--color-accent)]',
                    'hover:opacity-80 transition-opacity'
                  )}
                >
                  Join waitlist
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="mt-10 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-muted)] text-center sm:text-left order-2 sm:order-1">
            © {currentYear} GuestSync. All rights reserved.
          </p>
          <div className="flex items-center gap-6 order-1 sm:order-2">
            <Link
              href="/privacy-policy"
              className={cn(
                'text-sm font-medium text-[var(--color-text-muted)]',
                'hover:text-[var(--color-accent)] transition-colors'
              )}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={cn(
                'text-sm font-medium text-[var(--color-text-muted)]',
                'hover:text-[var(--color-accent)] transition-colors'
              )}
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
