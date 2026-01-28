import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from 'next/font/google';
import "./globals.css";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { getOrganizationSchema, getWebSiteSchema, getSoftwareApplicationSchema } from "@/lib/seo/structured-data";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: '400',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = generateSEOMetadata({
  title: "Never miss a VIP at your events",
  description:
    "AI ranks your guests so you know who to prioritize. Built for B2B event leads running conferences and summits. Free early access.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();
  const softwareSchema = getSoftwareApplicationSchema();

  return (
    <html lang="en" suppressHydrationWarning className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareSchema),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                if (!savedTheme) {
                  document.documentElement.removeAttribute('data-theme');
                } else if (savedTheme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.removeAttribute('data-theme');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
