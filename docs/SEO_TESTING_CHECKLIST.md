# SEO Testing Checklist

This document provides a comprehensive checklist for testing all SEO implementations on GuestSync.

## Pre-Deployment Testing

### 1. Technical SEO

#### Sitemap
- [ ] Verify sitemap is accessible at `/sitemap.xml`
- [ ] Check all pages are included (/, /privacy-policy, /terms)
- [ ] Validate XML structure using [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [ ] Confirm priority and changeFrequency values are set correctly

#### Robots.txt
- [ ] Verify robots.txt is accessible at `/robots.txt`
- [ ] Confirm sitemap URL is referenced correctly
- [ ] Test with [Google Search Console Robots.txt Tester](https://search.google.com/search-console)

### 2. Metadata & Open Graph

#### Homepage (/)
- [ ] Check title tag: "Never miss a VIP at your events | GuestSync"
- [ ] Verify meta description (150-160 characters)
- [ ] Test Open Graph tags using [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test Twitter Cards using [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Verify canonical URL is set correctly

#### Privacy Policy (/privacy-policy)
- [ ] Check title tag includes "Privacy Policy"
- [ ] Verify meta description
- [ ] Confirm canonical URL

#### Terms (/terms)
- [ ] Check title tag includes "Terms & Conditions"
- [ ] Verify meta description
- [ ] Confirm canonical URL

### 3. Structured Data (JSON-LD)

#### Test All Schemas
- [ ] Use [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Use [Schema.org Validator](https://validator.schema.org/)
- [ ] Verify Organization schema is present
- [ ] Verify WebSite schema is present
- [ ] Verify SoftwareApplication schema is present
- [ ] Verify FAQPage schema is present (on homepage)

#### Schema Validation Checklist
- [ ] Organization schema has name, url, logo, description
- [ ] WebSite schema has searchAction configured
- [ ] SoftwareApplication schema has correct applicationCategory
- [ ] FAQPage schema has all 8 questions and answers

### 4. Performance

#### Core Web Vitals
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Target scores: Performance > 90, Accessibility > 90, Best Practices > 90, SEO > 95
- [ ] Check Largest Contentful Paint (LCP) < 2.5s
- [ ] Check First Input Delay (FID) < 100ms
- [ ] Check Cumulative Layout Shift (CLS) < 0.1

#### Image Optimization
- [ ] Verify images use Next.js Image component
- [ ] Check images have descriptive alt text
- [ ] Confirm images are properly sized (no layout shift)
- [ ] Verify lazy loading is enabled for below-fold images

#### Caching Headers
- [ ] Verify static assets have long cache headers (31536000)
- [ ] Check HTML has appropriate cache headers
- [ ] Test with browser DevTools Network tab

### 5. Mobile Optimization

- [ ] Run [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Verify responsive design on multiple screen sizes
- [ ] Check touch targets are at least 44x44px
- [ ] Confirm text is readable without zooming
- [ ] Test on actual mobile devices

### 6. Content & On-Page SEO

#### Heading Hierarchy
- [ ] Verify single H1 tag on homepage
- [ ] Check H2 tags follow H1 logically
- [ ] Confirm proper heading structure (H1 → H2 → H3)

#### Semantic HTML
- [ ] Verify use of semantic elements (main, section, article, nav, footer)
- [ ] Check proper use of aria-labels where needed
- [ ] Confirm alt text on all images

#### Internal Linking
- [ ] Verify footer links to all main pages
- [ ] Check FAQ section is linked from footer
- [ ] Confirm anchor links work correctly

### 7. Security Headers

- [ ] Verify security headers are present (X-Frame-Options, X-Content-Type-Options, etc.)
- [ ] Test with [Security Headers](https://securityheaders.com/)
- [ ] Confirm HTTPS is enforced (in production)

## Post-Deployment Testing

### 8. Google Search Console

- [ ] Submit sitemap.xml to Google Search Console
- [ ] Request indexing for main pages
- [ ] Monitor for crawl errors
- [ ] Check Core Web Vitals report
- [ ] Review mobile usability report

### 9. Analytics Setup

- [ ] Install Google Analytics 4 (if not already done)
- [ ] Verify tracking code is firing
- [ ] Set up conversion goals
- [ ] Configure event tracking

### 10. Live Site Verification

#### URL Inspection
- [ ] Use Google Search Console URL Inspection tool
- [ ] Verify pages are indexable
- [ ] Check mobile usability
- [ ] Confirm structured data is detected

#### Search Appearance
- [ ] Test site:yourdomain.com search in Google
- [ ] Verify pages appear in search results
- [ ] Check rich snippets appear (if applicable)

## Testing Tools & Resources

### Essential Tools
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Google Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
3. **PageSpeed Insights**: https://pagespeed.web.dev/
4. **Schema.org Validator**: https://validator.schema.org/
5. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
6. **Twitter Card Validator**: https://cards-dev.twitter.com/validator

### Additional Tools
- **Google Search Console**: https://search.google.com/search-console
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
- **Ahrefs SEO Toolbar**: For on-page analysis
- **Screaming Frog SEO Spider**: For comprehensive site audit

## Common Issues & Fixes

### Issue: Sitemap not found
**Fix**: Ensure `app/sitemap.ts` exports default function correctly

### Issue: Structured data errors
**Fix**: Validate JSON-LD syntax and ensure all required fields are present

### Issue: Open Graph images not showing
**Fix**: Create `/public/og-image.png` (1200x630px) and update metadata.ts

### Issue: Mobile usability errors
**Fix**: Check viewport meta tag, font sizes, and touch targets

### Issue: Performance issues
**Fix**: Optimize images, enable compression, check bundle size

## Next Steps After Testing

1. **Fix any critical issues** found during testing
2. **Submit sitemap** to Google Search Console
3. **Request indexing** for key pages
4. **Monitor Search Console** for errors and warnings
5. **Track rankings** for target keywords
6. **Create content** (blog posts) for long-tail keywords
7. **Build backlinks** through outreach and partnerships

## Notes

- Testing should be done on both development and production environments
- Some features (like Open Graph images) may require actual image files
- Allow 24-48 hours for Google to crawl and index changes
- Monitor Search Console regularly for new issues or opportunities
