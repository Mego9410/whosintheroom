import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/blog/posts';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { getArticleSchema } from '@/lib/seo/structured-data';
import { cn } from '@/lib/utils/cn';
import { BlogViewTracker } from '@/components/blog/BlogViewTracker';

// Lazy load RelatedPosts for better performance
const RelatedPosts = dynamic(() => import('@/components/blog/RelatedPosts').then((mod) => ({ default: mod.RelatedPosts })), {
  ssr: true,
});

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return generateSEOMetadata({
      title: 'Post Not Found',
      path: `/blog/${params.slug}`,
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://guestsync.com';
  
  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.image || `${baseUrl}/og-image.png`,
  });
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug);
  const articleSchema = getArticleSchema(post);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://guestsync.com';

  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    { name: 'Blog', url: `${baseUrl}/blog` },
    { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <Header />
      <main className="min-h-screen bg-[var(--color-background)]">
        <BlogViewTracker slug={post.slug} title={post.title} />
        {/* Breadcrumbs */}
        <section className="pt-24 pb-8 px-6 sm:px-8 lg:px-12 xl:px-20">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </section>

        {/* Article Header */}
        <article className="pb-16 px-6 sm:px-8 lg:px-12 xl:px-20">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.image && (
              <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 rounded-2xl overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Category and Meta */}
            <div className="flex items-center gap-3 mb-4 text-sm">
              <span className="px-3 py-1 rounded-full bg-[var(--color-background-alt)] text-[var(--color-text-muted)] font-medium">
                {post.category}
              </span>
              <time dateTime={post.date} className="text-[var(--color-text-muted)]">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
              <span className="text-[var(--color-text-muted)]">·</span>
              <span className="text-[var(--color-text-muted)]">{post.readingTime} min read</span>
            </div>

            {/* Title */}
            <h1
              className={cn(
                'font-display text-4xl md:text-5xl lg:text-6xl',
                'text-[var(--color-primary)]',
                'mb-4',
                'leading-tight'
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-[var(--color-text-muted)] font-body leading-relaxed mb-6">
              {post.description}
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--color-border)]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff3b5c] to-[#ff6b35] flex items-center justify-center text-white font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-[var(--color-text)]">{post.author}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{post.authorRole}</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-[var(--color-background-alt)] text-[var(--color-text-muted)] text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Article Content */}
            <div
              className={cn(
                'max-w-none',
                'text-[var(--color-text)]',
                'font-body',
                'leading-relaxed'
              )}
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />

            {/* Social Sharing */}
            <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Share this article</h3>
              <div className="flex gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${baseUrl}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[var(--color-surface)] border-2 border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${baseUrl}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[var(--color-surface)] border-2 border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function formatContent(content: string): string {
  const lines = content.split('\n');
  let html = '';
  let inList = false;
  let listItems: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];

  function closeListsAndTables() {
    if (inList && listItems.length > 0) {
      html += `<ul class="my-4 space-y-1 list-disc list-inside">\n${listItems.map(li => `  ${li}`).join('\n')}\n</ul>\n`;
      listItems = [];
      inList = false;
    }
    if (inTable && tableRows.length > 0) {
      html += formatTable(tableHeaders, tableRows);
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line === '') {
      closeListsAndTables();
      continue;
    }

    // Headers
    if (line.startsWith('#### ')) {
      closeListsAndTables();
      html += `<h4 class="text-lg font-display text-[var(--color-primary)] mt-6 mb-2">${line.replace('#### ', '')}</h4>\n`;
      continue;
    }
    if (line.startsWith('### ')) {
      closeListsAndTables();
      html += `<h3 class="text-xl font-display text-[var(--color-primary)] mt-8 mb-3">${line.replace('### ', '')}</h3>\n`;
      continue;
    }
    if (line.startsWith('## ')) {
      closeListsAndTables();
      html += `<h2 class="text-2xl font-display text-[var(--color-primary)] mt-10 mb-4">${line.replace('## ', '')}</h2>\n`;
      continue;
    }
    if (line.startsWith('# ')) {
      closeListsAndTables();
      html += `<h1 class="text-3xl font-display text-[var(--color-primary)] mt-10 mb-5">${line.replace('# ', '')}</h1>\n`;
      continue;
    }

    // Table detection (markdown table format: | col1 | col2 |)
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
      
      // Check if it's a header separator (|---|---|)
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue; // Skip separator row
      }
      
      if (!inTable) {
        inTable = true;
        // First row is headers
        tableHeaders = cells;
        continue;
      }
      
      tableRows.push(cells);
      continue;
    }

    // List items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (inTable) {
        html += formatTable(tableHeaders, tableRows);
        tableHeaders = [];
        tableRows = [];
        inTable = false;
      }
      if (!inList) {
        inList = true;
      }
      const listContent = line.replace(/^[-*] /, '');
      const processedContent = processInlineFormatting(listContent);
      listItems.push(`<li class="text-[var(--color-text)] leading-relaxed mb-1">${processedContent}</li>`);
      continue;
    }

    // Numbered list items
    if (/^\d+\.\s/.test(line)) {
      if (inTable) {
        html += formatTable(tableHeaders, tableRows);
        tableHeaders = [];
        tableRows = [];
        inTable = false;
      }
      if (!inList) {
        inList = true;
      }
      const listContent = line.replace(/^\d+\.\s/, '');
      const processedContent = processInlineFormatting(listContent);
      listItems.push(`<li class="text-[var(--color-text)] leading-relaxed mb-1">${processedContent}</li>`);
      continue;
    }

    // Regular paragraph
    closeListsAndTables();

    // Process bold and italic
    let processedLine = processInlineFormatting(line);

    // Only wrap in paragraph if it's not already HTML
    if (!processedLine.startsWith('<')) {
      html += `<p class="text-[var(--color-text)] leading-relaxed mb-4">${processedLine}</p>\n`;
    } else {
      html += `${processedLine}\n`;
    }
  }

  // Close any remaining structures
  closeListsAndTables();

  return html;
}

function processInlineFormatting(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[var(--color-text)]">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function formatTable(headers: string[], rows: string[][]): string {
  if (rows.length === 0 && headers.length === 0) return '';
  
  let table = '<div class="my-6 overflow-x-auto rounded-lg border border-[var(--color-border)]">\n';
  table += '  <table class="min-w-full border-collapse">\n';
  
  if (headers.length > 0) {
    table += '    <thead>\n';
    table += '      <tr class="bg-[var(--color-background-alt)]">\n';
    headers.forEach(header => {
      const processedHeader = processInlineFormatting(header);
      table += `        <th class="border-b border-[var(--color-border)] px-4 py-3 text-left font-semibold text-[var(--color-primary)] text-sm">${processedHeader}</th>\n`;
    });
    table += '      </tr>\n';
    table += '    </thead>\n';
  }
  
  table += '    <tbody>\n';
  rows.forEach((row, index) => {
    const bgClass = index % 2 === 0 ? 'bg-[var(--color-surface)]' : 'bg-[var(--color-background-alt)]';
    table += `      <tr class="${bgClass} hover:bg-[var(--color-background-alt)] transition-colors">\n`;
    row.forEach(cell => {
      const processedCell = processInlineFormatting(cell);
      table += `        <td class="border-b border-[var(--color-border)] px-4 py-3 text-[var(--color-text)] leading-relaxed text-sm">${processedCell}</td>\n`;
    });
    table += '      </tr>\n';
  });
  table += '    </tbody>\n';
  table += '  </table>\n';
  table += '</div>\n';
  
  return table;
}
