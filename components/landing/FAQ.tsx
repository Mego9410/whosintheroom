'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { getFAQPageSchema } from '@/lib/seo/structured-data';
import { trackFAQOpen } from '@/lib/analytics/gtag';

const faqs = [
  {
    question: 'How does GuestSync rank guests by importance?',
    answer: 'GuestSync uses AI to analyze multiple factors including job title, company size, industry influence, and role seniority to calculate an importance score for each guest. This helps you prioritize VIPs and ensure your team knows who to focus on at your events.',
  },
  {
    question: 'Can I import my existing guest lists?',
    answer: 'Yes! GuestSync supports CSV and Excel imports. Our system automatically detects and maps columns, so you can upload thousands of guests in seconds without manual data entry or duplicate handling.',
  },
  {
    question: 'How do suppliers access guest lists?',
    answer: 'Suppliers receive access through mobile apps where they can view prioritized guest lists, check off attendees in real-time, and add notes. All updates sync instantly so your entire team stays aligned.',
  },
  {
    question: 'Is GuestSync suitable for large conferences?',
    answer: 'Absolutely. GuestSync is built specifically for B2B event organizers running conferences and summits. It handles thousands of guests efficiently and scales to support multiple events simultaneously.',
  },
  {
    question: 'What makes GuestSync different from spreadsheets?',
    answer: 'Unlike spreadsheets, GuestSync provides real-time collaboration, AI-powered guest ranking, mobile check-off capabilities, and automatic updates across your entire team and supplier network. No more outdated lists or manual coordination.',
  },
  {
    question: 'How accurate is the AI importance scoring?',
    answer: 'Our AI scoring algorithm analyzes multiple data points including professional titles, company information, and industry signals to provide highly accurate importance rankings. The system continuously learns and improves its accuracy.',
  },
  {
    question: 'Can multiple team members use GuestSync simultaneously?',
    answer: 'Yes, GuestSync is designed for team collaboration. Multiple team members can access and update guest lists in real-time, with all changes syncing instantly across desktop and mobile devices.',
  },
  {
    question: 'Is there a free trial or early access?',
    answer: 'Yes! We offer free early access to GuestSync. Join our waitlist to get priority access - no credit card required. Early access users will receive the full platform at no cost during the beta period.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    const newIndex = openIndex === index ? null : index;
    setOpenIndex(newIndex);
    if (newIndex !== null) {
      trackFAQOpen(faqs[newIndex].question);
    }
  };

  // Generate structured data
  const faqSchema = getFAQPageSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <section
        id="faq"
        className={cn(
          'relative pt-24 md:pt-32 pb-8 md:pb-12 px-6 sm:px-8 lg:px-12 xl:px-20',
          'bg-[var(--color-background)]'
        )}
        aria-label="Frequently Asked Questions"
      >
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 md:mb-16 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-px bg-[var(--color-accent)]" />
              <span className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] font-medium">
                FAQ
              </span>
              <div className="w-16 h-px bg-[var(--color-accent)]" />
            </div>
            <h2
              className={cn(
                'font-display text-3xl md:text-4xl lg:text-5xl',
                'text-[var(--color-primary)]',
                'mb-4',
                'leading-tight'
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Questions?{' '}
              <span className="gradient-text">We have answers.</span>
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] font-body max-w-2xl mx-auto">
              Everything you need to know about GuestSync and how it helps event organizers manage VIP guests.
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  'relative group',
                  'bg-[var(--color-surface)]',
                  'border-2 border-[var(--color-border)]',
                  'rounded-2xl',
                  'transition-all duration-300',
                  openIndex === index && 'border-[var(--color-accent)] shadow-lg'
                )}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={cn(
                    'w-full px-4 py-4 md:px-5 md:py-5',
                    'flex items-center justify-between gap-2',
                    'text-left',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 rounded-2xl'
                  )}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3
                    className={cn(
                      'font-display text-lg md:text-xl',
                      'text-[var(--color-primary)]',
                      'pr-3',
                      'flex-1',
                      'leading-relaxed'
                    )}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-lg',
                      'flex items-center justify-center',
                      'bg-[var(--color-background-alt)]',
                      'text-[var(--color-accent)]',
                      'transition-transform duration-300',
                      openIndex === index && 'rotate-180'
                    )}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-4 pb-4 md:px-5 md:pb-5 pt-3">
                    <p className="text-base md:text-lg text-[var(--color-text-muted)] font-body leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-base text-[var(--color-text-muted)] font-body mb-3">
              Still have questions?
            </p>
            <a
              href="mailto:support@guestsync.com"
              className={cn(
                'inline-flex items-center gap-2',
                'text-[var(--color-accent)]',
                'font-medium',
                'hover:opacity-80 transition-opacity'
              )}
            >
              Contact Support
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
