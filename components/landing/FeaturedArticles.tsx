import Link from 'next/link';
import { FeaturedArticleCard } from '@/components/landing/FeaturedArticleCard';
import { getAllPosts } from '@/lib/blog/posts';
import { cn } from '@/lib/utils/cn';

export function FeaturedArticles() {
  const allPosts = getAllPosts();
  const featuredPosts = allPosts.slice(0, 4); // Show first 4 posts

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section
      id="articles"
      className={cn(
        'relative pt-8 md:pt-12 pb-16 md:pb-20 px-6 sm:px-8 lg:px-12 xl:px-20',
        'bg-[var(--color-background-alt)]'
      )}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-px bg-[var(--color-accent)]" />
            <span className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] font-medium">
              Resources
            </span>
            <div className="w-16 h-px bg-[var(--color-accent)]" />
          </div>
          <h2
            className={cn(
              'font-display text-3xl md:text-4xl lg:text-5xl',
              'text-[var(--color-primary)]',
              'mb-3',
              'leading-tight'
            )}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Learn from our{' '}
            <span className="gradient-text">expert insights</span>
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] font-body leading-relaxed">
            Discover proven strategies for event management, VIP guest prioritization, and successful B2B conference planning.
          </p>
        </div>

        {/* Featured Blog Posts - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {featuredPosts.map((post) => (
            <FeaturedArticleCard key={post.slug} post={post} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/blog"
            className={cn(
              'inline-flex items-center gap-2',
              'px-6 py-3',
              'bg-[var(--color-surface)]',
              'border-2 border-[var(--color-border)]',
              'rounded-xl',
              'text-[var(--color-accent)]',
              'font-medium',
              'hover:border-[var(--color-accent)]',
              'transition-all duration-300',
              'hover:shadow-lg'
            )}
          >
            <span>View all articles</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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
          </Link>
        </div>
      </div>
    </section>
  );
}
