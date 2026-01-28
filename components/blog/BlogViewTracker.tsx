'use client';

import { useEffect } from 'react';
import { trackBlogView } from '@/lib/analytics/gtag';

interface BlogViewTrackerProps {
  slug: string;
  title: string;
}

export function BlogViewTracker({ slug, title }: BlogViewTrackerProps) {
  useEffect(() => {
    trackBlogView(slug, title);
  }, [slug, title]);

  return null;
}
