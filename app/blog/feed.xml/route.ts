import { getAllPosts } from '@/lib/blog/posts';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://guestsync.com';
  const siteName = 'GuestSync';
  const siteDescription = 'AI-powered event guest management insights and guides';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteName} Blog</title>
    <link>${baseUrl}/blog</link>
    <description>${siteDescription}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      ${post.tags.map((tag) => `<category><![CDATA[${tag}]]></category>`).join('\n      ')}
      <content:encoded><![CDATA[${post.content.replace(/<[^>]*>/g, '')}]]></content:encoded>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
