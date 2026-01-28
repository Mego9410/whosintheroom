import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms & Conditions | Who's in the Room",
  description: "Terms and conditions of use for Who's in the Room website and waitlist.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-background)]">
        <article className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 py-16 md:py-24">
          <h1
            className="font-display text-3xl md:text-4xl lg:text-5xl text-[var(--color-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Terms &amp; Conditions
          </h1>
          <p className="text-[var(--color-text-muted)] font-body text-lg mb-12">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <div className="prose prose-lg max-w-none space-y-8 text-[var(--color-text)] font-body leading-relaxed">
            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                1. Agreement to terms
              </h2>
              <p>
                By accessing or using the Who&apos;s in the Room website and services (including the waitlist), you agree to be bound by these Terms &amp; Conditions. If you do not agree, do not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                2. Description of services
              </h2>
              <p>
                Who&apos;s in the Room provides tools for event organisers to manage guest lists, prioritise attendees, and share information with teams and suppliers. We may offer a waitlist for early access, product updates, and related communications. Services and features may change over time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                3. Your use of the services
              </h2>
              <p className="mb-4">
                You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)]">
                <li>Provide accurate information when joining the waitlist or using our services.</li>
                <li>Use the services only for lawful purposes and in line with these terms.</li>
                <li>Not attempt to gain unauthorised access to our systems, other users&apos; data, or any third-party services we use.</li>
                <li>Not use the services to send spam, distribute malware, or otherwise harm us or others.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                4. Intellectual property
              </h2>
              <p>
                All content, branding, logos, and materials on our website and services are owned by Who&apos;s in the Room or our licensors. You may not copy, modify, distribute, or create derivative works without our prior written consent. You may view and use our website for your own lawful, personal use.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                5. Waitlist and early access
              </h2>
              <p>
                Joining our waitlist does not guarantee access to any product or feature. We may invite waitlist participants in phases at our discretion. We may use the contact details you provide to send updates about Who&apos;s in the Room; you can unsubscribe from marketing at any time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                6. Disclaimers
              </h2>
              <p>
                Our website and services are provided &quot;as is&quot; and &quot;as available&quot;. We do not warrant that they will be uninterrupted, error-free, or free of harmful components. We are not liable for any decisions you make based on information or tools we provide. Use our services at your own risk.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                7. Limitation of liability
              </h2>
              <p>
                To the fullest extent permitted by law, Who&apos;s in the Room and its affiliates, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising from your use of our services. Our total liability shall not exceed the amount you have paid us in the twelve (12) months preceding the claim, or one hundred pounds (GBP 100), whichever is greater.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                8. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless Who&apos;s in the Room and its affiliates from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your use of our services, your breach of these terms, or your violation of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                9. Termination
              </h2>
              <p>
                We may suspend or terminate your access to our services at any time, with or without notice, for any reason. You may stop using our services at any time. Provisions that by their nature should survive (e.g. intellectual property, disclaimers, limitation of liability, indemnification) will survive termination.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                10. Governing law and disputes
              </h2>
              <p>
                These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales, except where prohibited by law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                11. Changes to these terms
              </h2>
              <p>
                We may update these terms from time to time. We will post the revised version on this page and update the &quot;Last updated&quot; date. Your continued use of our services after changes constitutes acceptance of the updated terms. If you do not agree, you must stop using our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl md:text-2xl text-[var(--color-primary)] mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                12. Contact
              </h2>
              <p>
                For questions about these terms, contact us at{' '}
                <a href="mailto:legal@whosintheroom.com" className="text-[var(--color-accent)] hover:underline">
                  legal@whosintheroom.com
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
