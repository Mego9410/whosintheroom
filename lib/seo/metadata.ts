import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://guestsync.com';
const siteName = 'GuestSync';
const defaultDescription = 'AI ranks your guests so you know who to prioritize. Built for B2B event leads running conferences and summits. Free early access.';

export interface SEOConfig {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = defaultDescription,
    path = '',
    image = `${baseUrl}/og-image.png`,
    noIndex = false,
  } = config;

  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Never miss a VIP at your events`;
  const url = `${baseUrl}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      'event management',
      'guest management',
      'CRM',
      'event planning',
      'corporate events',
      'conference',
      'summit',
      'VIP tracking',
      'AI event management',
      'event guest ranking',
      'B2B events',
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@guestsync',
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(baseUrl),
  };
}
