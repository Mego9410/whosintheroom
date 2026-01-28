declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific event helpers
export const trackWaitlistSignup = (email?: string) => {
  event({
    action: 'waitlist_signup',
    category: 'engagement',
    label: email || 'anonymous',
  });
};

export const trackFAQOpen = (question: string) => {
  event({
    action: 'faq_open',
    category: 'engagement',
    label: question,
  });
};

export const trackBlogView = (slug: string, title: string) => {
  event({
    action: 'blog_view',
    category: 'content',
    label: title,
  });
};

export const trackCTAClick = (ctaName: string, location: string) => {
  event({
    action: 'cta_click',
    category: 'engagement',
    label: `${ctaName} - ${location}`,
  });
};

export const trackScrollDepth = (depth: number) => {
  event({
    action: 'scroll_depth',
    category: 'engagement',
    label: `${depth}%`,
    value: depth,
  });
};
