import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | Who's in the Room",
  description: "Privacy policy for Who's in the Room. How we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-background)]">
        <article className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 py-16 md:py-24">
          <h1
            className="font-display text-3xl md:text-4xl lg:text-5xl text-[var(--color-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Privacy Policy
          </h1>
          <p className="text-[var(--color-text-muted)] font-body text-lg mb-12">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="prose prose-lg max-w-none space-y-8 text-[var(--color-text)] font-body leading-relaxed">
            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                1. Introduction
              </h2>
              <p>
                Who&apos;s in the Room (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This policy describes how we collect, use, and protect your information when you use our website and waitlist service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                2. Information we collect
              </h2>
              <p className="mb-4">
                We may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)]">
                <li><strong className="text-[var(--color-text)]">Contact information</strong> — Email address and, if you provide it, name when you join our waitlist.</li>
                <li><strong className="text-[var(--color-text)]">Usage data</strong> — How you use our website (e.g. pages visited, general location) to improve our service.</li>
                <li><strong className="text-[var(--color-text)]">Technical data</strong> — Device type, browser, and IP address for security and analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                3. How we use your information
              </h2>
              <p className="mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)]">
                <li>Manage the waitlist and communicate about early access.</li>
                <li>Send product updates and relevant marketing (you can opt out at any time).</li>
                <li>Improve our website and services.</li>
                <li>Comply with applicable law and protect our rights.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                4. Data sharing and disclosure
              </h2>
              <p>
                We do not sell your personal information. We may share data with service providers (e.g. hosting, email) who help us operate our business, under strict confidentiality. We may disclose information if required by law or to protect our rights, safety, or property.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                5. Data retention and security
              </h2>
              <p>
                We retain your information only as long as needed for the purposes above or as required by law. We use appropriate technical and organisational measures to protect your data against unauthorised access, loss, or misuse.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                6. Your rights
              </h2>
              <p className="mb-4">
                Depending on where you live, you may have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)]">
                <li>Access, correct, or delete your personal information.</li>
                <li>Object to or restrict certain processing.</li>
                <li>Data portability.</li>
                <li>Withdraw consent where we rely on it.</li>
                <li>Lodge a complaint with a supervisory authority.</li>
              </ul>
              <p className="mt-4">
                To exercise these rights or ask questions, contact us (see Section 8).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                7. Cookies and similar technologies
              </h2>
              <p>
                We use cookies and similar technologies to run our website, remember preferences (e.g. theme), and understand usage. You can adjust your browser settings to limit or block cookies, but some features may not work fully.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                8. Contact us
              </h2>
              <p>
                For privacy-related requests or questions, contact us at{' '}
                <a href="mailto:privacy@whosintheroom.com" className="text-[var(--color-accent)] hover:underline">
                  privacy@whosintheroom.com
                </a>
                . We will respond within a reasonable time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                9. Changes to this policy
              </h2>
              <p>
                We may update this policy from time to time. We will post the revised version on this page and update the &quot;Last updated&quot; date. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
