import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Who's in the Room | Never miss a VIP at your events",
  description:
    "AI ranks your guests so you know who to prioritize. Built for B2B event leads running conferences and summits. Free early access.",
  keywords: [
    "event management",
    "guest management",
    "CRM",
    "event planning",
    "corporate events",
    "conference",
    "summit",
    "VIP tracking",
    "AI event management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        {children}
      </body>
    </html>
  );
}
