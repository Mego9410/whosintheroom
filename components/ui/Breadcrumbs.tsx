'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const breadcrumbSchema = getBreadcrumbSchema(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <nav
        aria-label="Breadcrumb"
        className={cn('flex items-center gap-2 text-sm', className)}
      >
        <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li
              key={item.url}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index < items.length - 1 ? (
                <>
                  <Link
                    href={item.url}
                    className={cn(
                      'text-[var(--color-text-muted)]',
                      'hover:text-[var(--color-accent)]',
                      'transition-colors'
                    )}
                    itemProp="item"
                  >
                    <span itemProp="name">{item.name}</span>
                  </Link>
                  <meta itemProp="position" content={(index + 1).toString()} />
                  <svg
                    className="w-4 h-4 text-[var(--color-text-muted)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              ) : (
                <span className="text-[var(--color-text)] font-medium" itemProp="name">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
