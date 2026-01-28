const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://guestsync.com';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GuestSync',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'AI-powered event guest management platform for B2B conferences and summits',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@guestsync.com',
    },
    sameAs: [
      // Add social media links when available
      // 'https://twitter.com/guestsync',
      // 'https://linkedin.com/company/guestsync',
    ],
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GuestSync',
    url: baseUrl,
    description: 'AI ranks your guests so you know who to prioritize. Built for B2B event leads running conferences and summits.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GuestSync',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free early access',
    },
    description: 'AI-powered event guest management platform that ranks guests by importance and shares prioritized lists with your team and suppliers.',
    featureList: [
      'AI-powered guest ranking',
      'Real-time guest check-off',
      'Team collaboration',
      'Supplier mobile apps',
      'CSV/Excel import',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getArticleSchema(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  readingTime: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://guestsync.com';
  const url = `${baseUrl}/blog/${post.slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image ? `${baseUrl}${post.image}` : `${baseUrl}/og-image.png`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GuestSync',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    timeRequired: `PT${post.readingTime}M`,
    url,
  };
}
