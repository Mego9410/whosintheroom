'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface Guest {
  id: string;
  name: string;
  title: string;
  company: string;
  score: number;
}

const mockGuests: Guest[] = [
  { id: '1', name: 'Sarah Chen', title: 'VP Product', company: 'TechCorp', score: 94 },
  { id: '2', name: 'Marcus Webb', title: 'Head of Events', company: 'Acme', score: 87 },
  { id: '3', name: 'Jordan Lee', title: 'Director', company: 'GrowthCo', score: 82 },
];

interface GuestCardProps {
  guest: Guest;
  index: number;
  isVisible: boolean;
}

function GuestCard({ guest, index, isVisible }: GuestCardProps) {
  const [score, setScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Set score immediately if reduced motion
      setScore(guest.score);
      return;
    }
    
    const duration = 1500;
    const steps = 60;
    const increment = guest.score / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newScore = Math.min(Math.round(increment * currentStep), guest.score);
      setScore(newScore);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setScore(guest.score);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, guest.score]);

  const isHighPriority = guest.score >= 90;
  const scoreGradient = guest.score >= 90 
    ? 'from-[#ff3b5c] to-[#ff6b35]' 
    : guest.score >= 85
    ? 'from-[#ff6b35] to-[#ff8c42]'
    : 'from-[#ff8c42] to-[#ffa500]';

  return (
    <div
      className={cn(
        'relative rounded-xl',
        'bg-[var(--color-surface)]',
        'border border-[var(--color-border)]',
        'p-4',
        'transition-all duration-300',
        'transform-gpu',
        isHovered && 'scale-[1.02] shadow-lg -translate-y-1',
        !isVisible && 'opacity-0 translate-y-4'
      )}
      style={{
        animationDelay: isVisible ? `${index * 150}ms` : '0ms',
        animation: isVisible ? 'fadeInUpCard 0.6s ease-out forwards' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
            {guest.name}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {guest.title} · {guest.company}
          </p>
        </div>
        <div className="flex-shrink-0">
          <div
            className={cn(
              'relative px-3 py-1.5 rounded-lg',
              'bg-gradient-to-r',
              scoreGradient,
              'text-white text-xs font-bold',
              'shadow-md',
              'min-w-[56px] text-center',
              isHighPriority && !prefersReducedMotion && 'animate-pulse-subtle'
            )}
          >
            <span className="tabular-nums">{score}</span>
            {isHighPriority && !prefersReducedMotion && (
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#ff3b5c] to-[#ff6b35] opacity-50 blur-sm -z-10 animate-pulse-glow" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnimatedMockup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Trigger animation after a short delay (or immediately if reduced motion)
    const delay = prefersReducedMotion ? 0 : 200;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [prefersReducedMotion]);

  // Reset animation on remount (for demo purposes)
  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  return (
    <div className="relative w-full" style={{ minHeight: '360px' }}>
      {/* Browser-style frame */}
      <div className="relative w-full h-full overflow-hidden bg-[var(--color-surface)]">
        {/* Top bar with window controls */}
        <div className="h-10 bg-[var(--color-background-alt)] flex items-center gap-2 px-4 border-b border-[var(--color-border)]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-border)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-border)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--color-border)]" />
          </div>
        </div>

        {/* AI Importance Badge */}
        <div className="absolute top-14 right-4 z-10 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff3b5c] to-[#ff6b35] text-white text-xs font-bold uppercase tracking-wider shadow-lg">
          AI importance
        </div>

        {/* Content area */}
        <div className="p-6 pt-16">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Guest list · Summit 2025
            </h2>
          </div>

          {/* Guest list */}
          <div className="space-y-3">
            {mockGuests.map((guest, index) => (
              <GuestCard
                key={guest.id}
                guest={guest}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Glassmorphism overlay effect */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent" />
      </div>
    </div>
  );
}
