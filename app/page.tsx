import dynamic from 'next/dynamic';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { FeaturedArticles } from '@/components/landing/FeaturedArticles';
import { Footer } from '@/components/landing/Footer';
import { generateMetadata } from '@/lib/seo/metadata';

// Lazy load below-fold components for better initial load performance
const FAQ = dynamic(() => import('@/components/landing/FAQ').then((mod) => ({ default: mod.FAQ })), {
  ssr: true,
});

const WaitlistForm = dynamic(() => import('@/components/landing/WaitlistForm').then((mod) => ({ default: mod.WaitlistForm })), {
  ssr: true,
});

export const metadata = generateMetadata({
  title: 'Never miss a VIP at your events',
  description: 'AI ranks your guests so you know who to prioritize. Built for B2B event leads running conferences and summits. Free early access.',
  path: '/',
});

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <HowItWorks />
        <Features />
        <FeaturedArticles />
        <FAQ />
        <WaitlistForm />
      </main>
      <Footer />
    </>
  );
}
