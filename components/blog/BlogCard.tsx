import Link from 'next/link';
import type { BlogPost } from '@/lib/blog/posts';
import { cn } from '@/lib/utils/cn';

// BlogCard doesn't need the content field
type BlogPostPreview = Omit<BlogPost, 'content'>;

interface BlogCardProps {
  post: BlogPostPreview;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article
      className={cn(
        'group relative',
        'bg-[var(--color-surface)]',
        'border-2 border-[var(--color-border)]',
        'rounded-2xl',
        'overflow-hidden',
        'transition-all duration-300',
        'hover:border-[var(--color-accent)]',
        'hover:shadow-xl',
        'hover:-translate-y-1'
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image placeholder or featured image */}
        {post.image ? (
          <div className="relative h-48 bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent-secondary)]/10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-[var(--color-accent)]/10 via-[var(--color-accent-secondary)]/10 to-[var(--color-accent)]/5 flex items-center justify-center">
            <div className="text-6xl opacity-20">📝</div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Category and Date */}
          <div className="flex items-center gap-3 mb-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-[var(--color-background-alt)] text-[var(--color-text-muted)] font-medium">
              {post.category}
            </span>
            <span className="text-[var(--color-text-muted)]">
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="text-[var(--color-text-muted)]">·</span>
            <span className="text-[var(--color-text-muted)]">{post.readingTime} min read</span>
          </div>

          {/* Title */}
          <h2
            className={cn(
              'font-display text-xl md:text-2xl',
              'text-[var(--color-primary)]',
              'mb-3',
              'group-hover:text-[var(--color-accent)]',
              'transition-colors',
              'line-clamp-2'
            )}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {post.title}
          </h2>

          {/* Description */}
          <p className="text-[var(--color-text-muted)] font-body leading-relaxed line-clamp-3 mb-4">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded bg-[var(--color-background-alt)] text-[var(--color-text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Read More */}
          <div className="flex items-center gap-2 text-[var(--color-accent)] font-medium group-hover:gap-3 transition-all">
            <span>Read more</span>
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
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff3b5c] to-[#ff6b35] text-white text-xs font-bold uppercase tracking-wider">
            Featured
          </div>
        )}
      </Link>
    </article>
  );
}
