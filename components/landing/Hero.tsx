'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AnimatedMockup } from '@/components/landing/AnimatedMockup';
import { cn } from '@/lib/utils/cn';
import { trackWaitlistSignup, trackCTAClick } from '@/lib/analytics/gtag';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [heroEmail, setHeroEmail] = useState('');
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroError, setHeroError] = useState('');
  const [heroSuccess, setHeroSuccess] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined') return;
    
    const attemptScroll = () => {
      try {
        const el = document.getElementById(id);
        if (el) {
          // Calculate offset for sticky header
          const headerHeight = 64; // Approximate header height
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error scrolling to section:', error);
        return false;
      }
    };

    // Try immediately
    if (!attemptScroll()) {
      // Try after a short delay
      setTimeout(() => {
        if (!attemptScroll()) {
          // Try after a longer delay as last resort
          setTimeout(() => {
            attemptScroll();
          }, 300);
        }
      }, 100);
    }
  };

  const scrollToHowItWorks = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    scrollToSection('how-it-works');
  };
  
  const scrollToWaitlist = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    scrollToSection('waitlist');
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroError('');
    if (!heroEmail?.trim()) {
      setHeroError('Enter your email');
      return;
    }
    if (!emailRegex.test(heroEmail.trim())) {
      setHeroError('Valid email required');
      return;
    }
    setHeroSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: heroEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHeroError(data.error || 'Something went wrong.');
        return;
      }
      setHeroSuccess(true);
      trackWaitlistSignup(heroEmail.trim());
      setHeroEmail('');
    } catch {
      setHeroError('Something went wrong. Try again.');
    } finally {
      setHeroSubmitting(false);
    }
  };

  return (
    <section
      className={cn(
        'relative flex items-start pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20 lg:pb-24 px-6 sm:px-8 lg:px-12 xl:px-20',
        'overflow-hidden',
        'bg-[var(--color-background)]'
      )}
      aria-label="Hero section"
    >
      {/* Dynamic Background Elements - More Organic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large Organic Blob */}
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-[#ff3b5c]/8 via-[#ff6b35]/5 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#ffa500]/6 via-transparent to-[#ff3b5c]/4 rounded-full blur-[100px]" />
        
        {/* Geometric Accent */}
        <div className="absolute top-1/4 right-1/4 w-2 h-32 bg-[var(--color-accent)] opacity-20 rotate-12" />
        <div className="absolute bottom-1/3 left-1/5 w-32 h-2 bg-[var(--color-accent-secondary)] opacity-15 -rotate-6" />
      </div>

      {/* Asymmetrical Layout - Two columns on lg */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-16 items-center">
          {/* Main Content - Left */}
          <div
            className={cn(
              'lg:col-span-6',
              'space-y-8 md:space-y-12',
              'animate-slide-in-left'
            )}
            style={{ animationDelay: '0.2s', opacity: isVisible ? 1 : 0 }}
          >
            {/* Small Accent Text - Editorial Style */}
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-[var(--color-accent)]" />
              <span className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] font-medium">
                For conference & summit organizers
              </span>
            </div>

            {/* Main Headline - Large, Expressive Serif */}
            <h1
              className={cn(
                'font-display text-[var(--color-primary)]',
                'leading-[0.92]',
                'mb-10',
                'max-w-5xl'
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="gradient-text">GuestSync</span>{' '}
              <span className="sr-only">- AI-Powered Event Guest Management</span>
            </h1>

            {/* Value Proposition - Outcome-led */}
            <div className="space-y-6 max-w-2xl">
              <h2
                className={cn(
                  'text-3xl md:text-4xl lg:text-5xl',
                  'text-[var(--color-text)]',
                  'font-body font-light',
                  'leading-[1.2]',
                  'tracking-tight'
                )}
              >
                <span className="font-medium text-[var(--color-accent)]">
                  AI ranks your guests
                </span>{' '}
                so your whole team knows who to prioritize.
              </h2>

              <p
                className={cn(
                  'text-base md:text-lg',
                  'text-[var(--color-text-muted)]',
                  'font-body',
                  'leading-relaxed'
                )}
              >
                Ditch spreadsheets. Share prioritized lists with your team and suppliers in real time.
              </p>
            </div>

            {/* CTAs - Asymmetrical Layout */}
            <div
              className={cn(
                'flex flex-col sm:flex-row gap-4',
                'items-start',
                'pt-2'
              )}
            >
              <Button
                size="xl"
                variant="primary"
                className="min-w-[260px] group"
                onClick={(e) => {
                  trackCTAClick('Join Waitlist', 'Hero');
                  scrollToWaitlist(e);
                }}
              >
                <span>Join Waitlist</span>
                <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={(e) => {
                  trackCTAClick('See How It Works', 'Hero');
                  scrollToHowItWorks(e);
                }}
                className="min-w-[260px]"
              >
                See How It Works
              </Button>
            </div>

            {/* Inline email capture - high-intent */}
            <div className="pt-2 max-w-xl">
              {heroSuccess ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-accent)]/30">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#ff3b5c] to-[#ff6b35] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-[var(--color-text)]">
                    You&apos;re on the list. We&apos;ll be in touch.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={cn(
                      'flex-1 min-w-0 px-4 py-3 rounded-xl',
                      'bg-[var(--color-surface)] border-2 border-[var(--color-border)]',
                      'text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]',
                      'focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20',
                      'transition-all duration-200',
                      heroError && 'border-red-500'
                    )}
                    disabled={heroSubmitting}
                    aria-invalid={!!heroError}
                    aria-describedby={heroError ? 'hero-email-error' : undefined}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="xl"
                    className="sm:min-w-[200px] shrink-0"
                    disabled={heroSubmitting}
                  >
                    {heroSubmitting ? 'Joining…' : 'Get early access'}
                  </Button>
                </form>
              )}
              {heroError && (
                <p id="hero-email-error" className="mt-2 text-sm text-red-500 font-body" role="alert">
                  {heroError}
                </p>
              )}
              <p className="mt-3 text-sm font-body text-[var(--color-text-muted)]">
                <span className="font-semibold text-[var(--color-text)]">Free early access.</span> No credit card required.
              </p>
            </div>
          </div>

          {/* Hero Visual - Right column on lg */}
          <div
            className={cn(
              'lg:col-span-4 lg:col-start-7',
              'hidden lg:block',
              'relative',
              'animate-slide-in-right'
            )}
            style={{ animationDelay: '0.4s', opacity: isVisible ? 1 : 0 }}
          >
            <div className="relative group/mockup">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff3b5c] via-[#ff6b35] to-[#ffa500] rounded-2xl opacity-20 blur-xl group-hover/mockup:opacity-30 transition-opacity duration-500" />
              <div className="absolute top-6 right-6 w-full h-full bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent rounded-3xl transform rotate-3" />
              <div
                className={cn(
                  'relative rounded-2xl overflow-hidden',
                  'bg-[var(--color-surface)]',
                  'border-2 border-[var(--color-border)]',
                  'shadow-2xl',
                  'transform -rotate-1 group-hover/mockup:rotate-0 group-hover/mockup:scale-[1.02]',
                  'transition-all duration-500',
                  'ring-2 ring-transparent group-hover/mockup:ring-[var(--color-accent)]/30'
                )}
              >
                <AnimatedMockup />
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
