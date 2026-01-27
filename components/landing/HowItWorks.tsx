'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

const stepIcons = {
  import: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  score: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  use: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
};

const steps = [
  {
    number: '1',
    icon: stepIcons.import,
    title: 'Import your guests',
    description: 'Upload CSV or Excel. We map columns automatically—no manual setup.',
  },
  {
    number: '2',
    icon: stepIcons.score,
    title: 'AI scores importance',
    description: 'We rank guests by influence, role, and company. You see who matters most, and your team gets the same insights automatically.',
  },
  {
    number: '3',
    icon: stepIcons.use,
    title: 'Use lists & check off live',
    description: 'Share prioritized lists with your team and suppliers. They check off guests on mobile while you see updates in real time—everyone stays aligned.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className={cn(
        'relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 xl:px-20',
        'bg-[var(--color-background-alt)]'
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20 max-w-2xl">
          <h2
            className={cn(
              'font-display text-3xl md:text-4xl lg:text-5xl',
              'text-[var(--color-primary)]',
              'leading-tight'
            )}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Understand your audience.{' '}
            <span className="gradient-text">Share with your team.</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--color-text-muted)] font-body max-w-xl">
            Three steps from guest list to prioritized, live check-off.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col"
            >
              <div className="mb-6 flex items-center gap-4">
                <span
                  className={cn(
                    'inline-flex w-14 h-14 rounded-2xl items-center justify-center shrink-0',
                    'bg-gradient-to-br from-[#ff3b5c] via-[#ff6b35] to-[#ffa500]',
                    'text-white font-display text-xl font-bold',
                    'shadow-lg'
                  )}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {step.number}
                </span>
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                    'bg-[var(--color-surface)] border-2 border-[var(--color-border)]',
                    'text-[var(--color-accent)]'
                  )}
                >
                  {step.icon}
                </div>
              </div>
              <h3
                className={cn(
                  'font-display text-2xl md:text-3xl',
                  'text-[var(--color-primary)]',
                  'mb-3',
                  'leading-tight'
                )}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  'text-lg',
                  'text-[var(--color-text-muted)]',
                  'font-body',
                  'leading-relaxed'
                )}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
