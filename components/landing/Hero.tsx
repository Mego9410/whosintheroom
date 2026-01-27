'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export function Hero() {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center px-6 sm:px-8 lg:px-12 xl:px-20',
        'overflow-hidden',
        'bg-[var(--color-background)]'
      )}
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

      {/* Asymmetrical Layout - Breaking Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-10 gap-12 items-center">
          {/* Main Content - Offset Left, Not Centered */}
          <div
            className={cn(
              'lg:col-span-6 lg:col-start-1',
              'space-y-8 md:space-y-12',
              'animate-slide-in-left'
            )}
            style={{ animationDelay: '0.2s', opacity: isVisible ? 1 : 0 }}
          >
            {/* Small Accent Text - Editorial Style */}
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-[var(--color-accent)]" />
              <span className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] font-medium">
                Event Intelligence
              </span>
            </div>

            {/* Main Headline - Large, Expressive Serif */}
            <h1
              className={cn(
                'font-display text-[var(--color-primary)]',
                'leading-[0.92]',
                'mb-8',
                'max-w-5xl'
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Who's in the{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Room</span>
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-[var(--color-accent)] opacity-15 -skew-x-12" />
              </span>
            </h1>

            {/* Value Proposition - More Conversational */}
            <div className="space-y-6 max-w-2xl">
              <p
                className={cn(
                  'text-2xl md:text-3xl lg:text-4xl',
                  'text-[var(--color-text)]',
                  'font-body font-light',
                  'leading-[1.25]',
                  'tracking-tight'
                )}
              >
                Never miss a VIP again.{' '}
                <span className="font-medium text-[var(--color-accent)]">
                  AI identifies your most important guests
                </span>{' '}
                so you can focus on what matters.
              </p>

              <p
                className={cn(
                  'text-lg md:text-xl',
                  'text-[var(--color-text-muted)]',
                  'font-body',
                  'leading-relaxed',
                  'max-w-xl'
                )}
              >
                The complete platform for corporate event managers who need to prioritize, organize, and coordinate with precision.
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
              <Button size="lg" variant="primary" className="min-w-[220px] group">
                <span>Join Waitlist</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToFeatures}
                className="min-w-[220px]"
              >
                See How It Works
              </Button>
            </div>

            {/* Trust Indicator - More Human */}
            <div className="pt-4">
              <p className="text-sm text-[var(--color-text-light)] font-body">
                <span className="font-semibold text-[var(--color-text)]">Free forever</span> for early access. No credit card required.
              </p>
            </div>
          </div>

          {/* Right Side - Visual Element with Depth */}
          <div
            className={cn(
              'lg:col-span-4 lg:col-start-7',
              'relative',
              'hidden lg:block',
              'animate-slide-in-right'
            )}
            style={{ animationDelay: '0.4s', opacity: isVisible ? 1 : 0 }}
          >
            {/* Layered Card Design */}
            <div className="relative">
              {/* Background Card - Offset */}
              <div className="absolute top-8 left-8 w-full h-full bg-[var(--color-accent)] opacity-5 rounded-3xl transform rotate-3" />
              
              {/* Main Card */}
              <div className="relative bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-3xl p-10 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Decorative Corner */}
                <div className="absolute -top-1 -right-1 w-20 h-20">
                  <div className="w-full h-full border-t-4 border-r-4 border-[var(--color-accent)] rounded-tr-3xl" />
                </div>
                
                {/* Content */}
                <div className="space-y-6">
                  <div className="text-5xl text-[var(--color-accent)] opacity-20 leading-none">
                    "
                  </div>
                  <p className="text-xl font-display text-[var(--color-primary)] italic leading-relaxed">
                    Finally, a tool that understands event management isn't just about lists—it's about relationships and priorities.
                  </p>
                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider font-medium">
                      Built for Event Professionals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - More Distinctive */}
      <div className="absolute bottom-12 left-12 hidden lg:block">
        <button
          onClick={scrollToFeatures}
          className="flex flex-col items-center gap-3 group"
          aria-label="Scroll to features"
        >
          <span className="text-xs text-[var(--color-text-light)] uppercase tracking-widest font-medium transform -rotate-90 whitespace-nowrap">
            Scroll
          </span>
          <div className="w-8 h-12 border-2 border-[var(--color-text-light)] rounded-full flex items-start justify-center p-2 group-hover:border-[var(--color-accent)] transition-colors">
            <div className="w-1.5 h-4 bg-[var(--color-text-light)] rounded-full group-hover:bg-[var(--color-accent)] transition-colors animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
}
