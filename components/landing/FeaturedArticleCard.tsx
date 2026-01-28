import Link from 'next/link';
import { BlogPost } from '@/lib/blog/posts';
import { cn } from '@/lib/utils/cn';

interface FeaturedArticleCardProps {
  post: BlogPost;
}

// Generate a unique gradient based on the post slug
function getPostGradient(slug: string) {
  const gradients = [
    'from-[#ff3b5c] via-[#ff6b35] to-[#ffa500]',
    'from-[#ff6b35] via-[#ffa500] to-[#ff3b5c]',
    'from-[#ffa500] via-[#ff3b5c] to-[#ff6b35]',
    'from-[#ff3b5c] via-[#ffa500] to-[#ff6b35]',
  ];
  const index = slug.length % gradients.length;
  return gradients[index];
}

export function FeaturedArticleCard({ post }: FeaturedArticleCardProps) {
  const gradient = getPostGradient(post.slug);
  const imageUrl = post.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&q=80`;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group block',
        'bg-[var(--color-surface)]',
        'border border-[var(--color-border)]',
        'rounded-xl',
        'overflow-hidden',
        'transition-all duration-300',
        'hover:border-[var(--color-accent)]',
        'hover:shadow-lg',
        'h-full',
        'flex flex-col'
      )}
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-[var(--color-accent)]/10 via-[var(--color-accent-secondary)]/10 to-[var(--color-accent)]/5">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <>
            {/* Gradient overlay */}
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-60', gradient)} />
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            {/* Category icon/text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/30 font-display text-2xl font-bold uppercase tracking-wider">
                {post.category.charAt(0)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs px-2 py-1 rounded bg-[var(--color-background-alt)] text-[var(--color-text-muted)] font-medium">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'font-display text-base',
            'text-[var(--color-primary)]',
            'mb-2',
            'group-hover:text-[var(--color-accent)]',
            'transition-colors',
            'line-clamp-2',
            'leading-snug'
          )}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--color-text-muted)] font-body leading-relaxed line-clamp-2 mb-3 flex-1">
          {post.description}
        </p>

        {/* Read more */}
        <div className="flex items-center gap-1 text-sm text-[var(--color-accent)] font-medium mt-auto">
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
    </Link>
  );
}
