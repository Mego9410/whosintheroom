import type { Metadata } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Who's in the Room | AI-Powered Event Guest Management",
  description:
    "Prioritize your most important guests with AI-powered intelligence. Manage events, track suppliers, and never miss a VIP again.",
  keywords: [
    "event management",
    "guest management",
    "CRM",
    "event planning",
    "corporate events",
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
    <html lang="en">
      <body>
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
