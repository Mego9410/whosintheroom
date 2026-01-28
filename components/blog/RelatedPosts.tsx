import Link from 'next/link';
import { BlogPost } from '@/lib/blog/posts';
import { cn } from '@/lib/utils/cn';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-16 border-t border-[var(--color-border)]">
      <h2
        className={cn(
          'font-display text-2xl md:text-3xl',
          'text-[var(--color-primary)]',
          'mb-8'
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={cn(
              'group block',
              'p-6',
              'bg-[var(--color-surface)]',
              'border-2 border-[var(--color-border)]',
              'rounded-xl',
              'transition-all duration-300',
              'hover:border-[var(--color-accent)]',
              'hover:shadow-lg'
            )}
          >
            <h3
              className={cn(
                'font-display text-lg md:text-xl',
                'text-[var(--color-primary)]',
                'mb-2',
                'group-hover:text-[var(--color-accent)]',
                'transition-colors',
                'line-clamp-2'
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {post.title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
              {post.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-accent)]">
              <span>Read article</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
