import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { BlogListing } from '@/components/blog/BlogListing';
import { getAllPosts, getAllCategories } from '@/lib/blog/posts';
import { generateMetadata } from '@/lib/seo/metadata';
import { cn } from '@/lib/utils/cn';

export const metadata = generateMetadata({
  title: 'Blog',
  description: 'Expert insights on event management, guest prioritization, and B2B conference planning. Learn how to never miss a VIP at your events.',
  path: '/blog',
});

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  // Remove content field for client component
  const postsForClient = posts.map(({ content, ...post }) => post);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-background)]">
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-6 sm:px-8 lg:px-12 xl:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 max-w-3xl">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-px bg-[var(--color-accent)]" />
                <span className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] font-medium">
                  Blog
                </span>
                <div className="w-16 h-px bg-[var(--color-accent)]" />
              </div>
              <h1
                className={cn(
                  'font-display text-4xl md:text-5xl lg:text-6xl',
                  'text-[var(--color-primary)]',
                  'mb-6',
                  'leading-tight'
                )}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Event Management{' '}
                <span className="gradient-text">Insights & Guides</span>
              </h1>
              <p className="text-xl text-[var(--color-text-muted)] font-body leading-relaxed">
                Learn proven strategies for managing VIP guests, organizing successful B2B events, and leveraging AI-powered tools for better event outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Listing with Filters */}
        <BlogListing posts={postsForClient} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
