'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

// Dynamic Interactive Preview Component
function InteractivePreview() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveFeature((prev) => (prev + 1) % 4);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const previewStates = [
    {
      title: 'Guest list',
      value: '12.5K',
      label: 'guests',
      bars: [65, 80, 75, 88],
      color: 'from-[#ff3b5c] to-[#ff6b35]',
    },
    {
      title: 'AI Score',
      value: '94%',
      label: 'accuracy',
      bars: [85, 92, 78, 94],
      color: 'from-[#ff6b35] to-[#ffa500]',
    },
    {
      title: 'Events',
      value: '247',
      label: 'active',
      bars: [70, 85, 60, 90],
      color: 'from-[#ffa500] to-[#ff3b5c]',
    },
    {
      title: 'Import',
      value: '2.3s',
      label: 'avg',
      bars: [90, 95, 85, 98],
      color: 'from-[#ff3b5c] to-[#ffa500]',
    },
  ];

  const currentState = previewStates[activeFeature];

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Card - Animated */}
      <div className="absolute top-6 right-6 w-full h-full bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-700" />
      
      {/* Main Preview Card - UI frame */}
      <div className="relative bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xl transform -rotate-1 group-hover:rotate-0 group-hover:shadow-2xl transition-all duration-500">
        {/* Decorative Corner - Animated */}
        <div className="absolute -top-1 -right-1 w-16 h-16 border-t-2 border-r-2 border-[var(--color-accent)] rounded-tr-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 z-10 pointer-events-none" />
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-background-alt)] border-b border-[var(--color-border)]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border)]" />
          </div>
          <span className="text-xs text-[var(--color-text-muted)] font-medium ml-2">GuestSync — Product preview</span>
        </div>
        {/* Preview Content */}
        <div className="p-8 space-y-6">
          {/* Header with Animated Dots */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#ff3b5c] to-[#ff6b35] animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ffa500] animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#ffa500] to-[#ff3b5c] animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
          
          {/* Dynamic Stats Display */}
          <div className="space-y-4">
            {/* Main Metric - Animated */}
            <div className="space-y-2">
              <div className="text-sm text-[var(--color-text-muted)] font-medium uppercase tracking-wider">
                {currentState.title}
              </div>
              <div className="flex items-baseline gap-3">
                <span 
                  key={activeFeature}
                  className={cn(
                    'text-4xl font-display font-bold',
                    'bg-gradient-to-r',
                    currentState.color,
                    'bg-clip-text text-transparent',
                    'transition-all duration-500',
                    'inline-block'
                  )}
                  style={{
                    animation: 'fadeIn 0.5s ease-out',
                  }}
                >
                  {currentState.value}
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {currentState.label}
                </span>
              </div>
            </div>

            {/* Animated Progress Bars */}
            <div className="space-y-3 pt-2">
              {currentState.bars.map((value, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                    <span>{['VIP score', 'Influence', 'Role', 'Company'][index]}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <div className="relative h-2.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'absolute top-0 left-0 h-full rounded-full',
                        'bg-gradient-to-r',
                        currentState.color,
                        'transition-all duration-1000 ease-out',
                        'shadow-sm relative'
                      )}
                      style={{
                        width: `${value}%`,
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Indicators - Interactive */}
            <div className="grid grid-cols-4 gap-2 pt-4">
              {previewStates.map((state, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={cn(
                    'h-12 rounded-xl border-2 transition-all duration-300',
                    'relative overflow-hidden group/indicator',
                    activeFeature === index
                      ? 'border-[var(--color-accent)] shadow-lg scale-105'
                      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                  )}
                >
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br opacity-0 group-hover/indicator:opacity-10 transition-opacity',
                      state.color
                    )}
                  />
                  {activeFeature === index && (
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-br opacity-20',
                        state.color
                      )}
                    />
                  )}
                  <div className="relative h-full flex items-center justify-center">
                    <div
                      className={cn(
                        'rounded-full transition-all duration-500 ease-out',
                        activeFeature === index
                          ? 'w-8 h-2 bg-gradient-to-r ' + state.color + ' shadow-sm'
                          : 'w-2 h-2 bg-[var(--color-text-muted)]'
                      )}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const features: Feature[] = [
  {
    color: 'from-[#ff3b5c] to-[#ff6b35]',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Never miss a VIP',
    description:
      'AI scores guests by influence, job title, and company. Share prioritized lists with your team so everyone knows who matters most.',
  },
  {
    color: 'from-[#ff6b35] to-[#ffa500]',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'One place for events and guests',
    description:
      'Organize events, guests, and relationships in a single platform. Your team and suppliers see the same real-time data—no more scattered spreadsheets or outdated lists.',
  },
  {
    color: 'from-[#ffa500] to-[#ff3b5c]',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Check off guests in real time',
    description:
      'Suppliers use mobile apps to check off guests and add notes. Your whole team—organizers, staff, and suppliers—stays aligned with live updates.',
  },
  {
    color: 'from-[#ff3b5c] to-[#ffa500]',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: 'Import thousands of guests in seconds',
    description:
      'Upload CSV or Excel—we detect and map columns automatically. No manual mapping or duplicate entry. Get your lists ready fast.',
  },
];

export function Features() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index]);
            }, index * 120);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach((card) => observer.observe(card));

    return () => {
      cards?.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className={cn(
        'relative pt-16 md:pt-20 pb-32 md:pb-40 px-6 sm:px-8 lg:px-12 xl:px-20',
        'bg-[var(--color-background-alt)]'
      )}
    >
      {/* Background Pattern - Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            var(--color-accent) 40px,
            var(--color-accent) 41px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            var(--color-accent) 40px,
            var(--color-accent) 41px
          )`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header - Asymmetrical with Visual Element */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16 md:mb-20">
          {/* Left: Text Content */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-px bg-[var(--color-accent)]" />
              <span className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] font-medium">
                Capabilities
              </span>
            </div>
            <h2
              className={cn(
                'font-display text-[var(--color-primary)]',
                'mb-6',
                'leading-tight'
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Understand your audience.{' '}
              <span className="gradient-text">Share insights with your team.</span>
            </h2>
            <p
              className={cn(
                'text-xl md:text-2xl',
                'text-[var(--color-text-muted)]',
                'font-body',
                'leading-relaxed'
              )}
            >
              Powerful features that feel natural, not robotic.
            </p>
          </div>

          {/* Right: Dynamic Interactive Preview */}
          <div className="lg:col-span-6 hidden lg:block">
            <InteractivePreview />
          </div>
        </div>

        {/* Product mockup - visible on mobile (replaces hidden InteractivePreview), supplemental on desktop */}
        <div className="mb-16 md:mb-20 lg:hidden">
          <div className="rounded-2xl overflow-hidden border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
            <Image
              src="/hero-mockup.svg"
              alt="Guest list with AI importance scores"
              width={480}
              height={360}
              className="w-full h-auto object-contain"
              unoptimized
            />
          </div>
          <p className="mt-4 text-sm text-[var(--color-text-muted)] font-body text-center">
            Guest list with AI importance scores
          </p>
        </div>

        {/* Feature Grid - Asymmetrical, Overlapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              className={cn(
                'relative group',
                visibleCards.includes(index) || visibleCards.length === 0
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8',
                'transition-all duration-700',
                index % 2 === 1 && 'md:mt-12',
                index === 0 && 'md:ml-0',
                index === 2 && 'md:ml-8'
              )}
            >
              {/* Background Card - Offset for Depth */}
              <div className="absolute top-4 left-4 w-full h-full bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent rounded-3xl transform rotate-2 group-hover:rotate-3 transition-transform duration-500" />
              
              {/* Main Card */}
              <div
                className={cn(
                  'relative p-10',
                  'bg-[var(--color-surface)]',
                  'border-2 border-[var(--color-border)]',
                  'rounded-3xl',
                  'transition-all duration-500',
                  'hover:border-[var(--color-accent)]',
                  'hover:shadow-2xl',
                  'hover:-translate-y-2',
                  'group'
                )}
              >
                {/* Decorative Corner - Dynamic */}
                <div className={cn(
                  'absolute top-0 right-0 w-24 h-24',
                  'border-t-2 border-r-2',
                  'border-[var(--color-accent)]',
                  'opacity-0 group-hover:opacity-30',
                  'transition-opacity duration-500',
                  'rounded-tr-3xl'
                )} />

                {/* Icon - Gradient Background */}
                <div className={cn(
                  'w-16 h-16 rounded-2xl',
                  'bg-gradient-to-br',
                  feature.color,
                  'flex items-center justify-center',
                  'text-white mb-8',
                  'transform group-hover:scale-110 group-hover:rotate-6',
                  'transition-transform duration-500',
                  'shadow-lg'
                )}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    'font-display text-2xl md:text-3xl',
                    'text-[var(--color-primary)]',
                    'mb-4',
                    'leading-tight'
                  )}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className={cn(
                    'text-lg',
                    'text-[var(--color-text-muted)]',
                    'font-body',
                    'leading-relaxed'
                  )}
                >
                  {feature.description}
                </p>

                {/* Bottom Accent Line */}
                <div className={cn(
                  'absolute bottom-0 left-0 w-24 h-1',
                  'bg-gradient-to-r',
                  feature.color,
                  'opacity-0 group-hover:opacity-60',
                  'transition-opacity duration-500',
                  'rounded-full'
                )} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
