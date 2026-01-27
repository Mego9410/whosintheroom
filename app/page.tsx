import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { WaitlistForm } from '@/components/landing/WaitlistForm';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <WaitlistForm />
    </main>
  );
}
