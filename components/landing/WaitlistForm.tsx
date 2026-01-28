'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';
import { trackWaitlistSignup } from '@/lib/analytics/gtag';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showNameField, setShowNameField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSubmittedEmail(email.trim());
      setSuccess(true);
      trackWaitlistSignup(email.trim());
      setEmail('');
      setName('');
      setShowNameField(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section id="waitlist" className="py-32 md:py-40 px-6 sm:px-8 lg:px-12 xl:px-20 bg-[var(--color-background)]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-12">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#ff3b5c] via-[#ff6b35] to-[#ffa500] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2
              className={cn(
                'font-display text-4xl md:text-5xl',
                'text-[var(--color-primary)]',
                'mb-6'
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              You&apos;re on the list!
            </h2>
            <p className="text-xl text-[var(--color-text-muted)] font-body leading-relaxed">
              {submittedEmail ? (
                <>We&apos;ll email you at <span className="font-semibold text-[var(--color-text)]">{submittedEmail}</span> when we launch.</>
              ) : (
                'We&apos;ll notify you as soon as we launch.'
              )}{' '}
              Thank you for your interest!
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setSuccess(false)}
            className="mt-8"
            size="lg"
          >
            Join Another Email
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="pt-16 md:pt-20 pb-32 md:pb-40 px-6 sm:px-8 lg:px-12 xl:px-20 bg-[var(--color-background)]">
      <div className="max-w-3xl mx-auto">
        {/* Section Header - No eyebrow; direct H2 */}
        <div className="mb-16 max-w-2xl">
          <h2
            className={cn(
              'font-display text-4xl md:text-5xl',
              'text-[var(--color-primary)]',
              'mb-6',
              'leading-tight'
            )}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Get <span className="gradient-text">early access</span>
          </h2>
          <p
            className={cn(
              'text-xl',
              'text-[var(--color-text-muted)]',
              'font-body',
              'leading-relaxed'
            )}
          >
            Be first to try Who&apos;s in the Room. Free early access—no credit card required.
          </p>
        </div>

        {/* Form - More Distinctive Design */}
        <form
          onSubmit={handleSubmit}
          className={cn(
            'relative',
            'bg-[var(--color-surface)]',
            'border-2 border-[var(--color-border)]',
            'rounded-3xl',
            'p-10 md:p-14',
            'space-y-8',
            'shadow-xl',
            'group'
          )}
        >
          {/* Decorative Corner - Top Right */}
          <div className="absolute top-0 right-0 w-24 h-24">
            <div className="w-full h-full border-t-2 border-r-2 border-[var(--color-accent)] opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-tr-3xl" />
          </div>
          
          <div className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'email-error' : undefined}
              className="text-lg"
            />
            {error && (
              <p id="email-error" className="text-sm text-red-500 font-body" role="alert">
                {error}
              </p>
            )}

            {showNameField ? (
              <Input
                type="text"
                label="Name (Optional)"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowNameField(true)}
                className={cn(
                  'text-base text-[var(--color-accent)]',
                  'hover:underline',
                  'font-body',
                  'transition-all',
                  'font-medium'
                )}
              >
                + Add name (optional)
              </button>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="xl"
            className="w-full group"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Joining...' : 'Get early access'}</span>
            {!isSubmitting && (
              <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            )}
          </Button>

          <p
            className={cn(
              'text-sm text-[var(--color-text-light)]',
              'text-center',
              'font-body',
              'pt-2'
            )}
          >
            Free early access. No credit card. We respect your privacy—unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  );
}
