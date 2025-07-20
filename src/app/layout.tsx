import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import EnhancedCursor from "@/components/enhanced-cursor";
import { TempoInit } from "@/components/tempo-init";
import ErrorBoundary from "@/components/error-boundary";
import { NotificationProvider } from "@/components/notification-system";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Pegasus - AI Fame Creator & Influencer Manager",
  description:
    "Transform into a viral sensation with AI-powered content creation and growth tools. Build, grow, and monetize your social media presence with premium AI features.",
  keywords:
    "AI content creation, social media growth, influencer tools, viral content, content creator, social media automation",
  authors: [{ name: "Pegasus AI" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://epic-raman6-4uxp6.view-3.tempo-dev.app",
    siteName: "Pegasus AI",
    title: "Pegasus - AI Fame Creator & Influencer Manager",
    description:
      "Transform into a viral sensation with AI-powered content creation and growth tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pegasus - AI Fame Creator & Influencer Manager",
    description:
      "Transform into a viral sensation with AI-powered content creation and growth tools",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="canonical"
          href="https://epic-raman6-4uxp6.view-3.tempo-dev.app"
        />
        <meta
          name="description"
          content="Transform into a viral sensation with AI-powered content creation and growth tools. Build, grow, and monetize your social media presence with premium AI features."
        />
        <meta
          name="keywords"
          content="AI content creation, social media growth, influencer tools, viral content, content creator, social media automation"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Pegasus AI" />
        <meta
          property="og:title"
          content="Pegasus - AI Fame Creator & Influencer Manager"
        />
        <meta
          property="og:description"
          content="Transform into a viral sensation with AI-powered content creation and growth tools"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://epic-raman6-4uxp6.view-3.tempo-dev.app"
        />
        <meta property="og:site_name" content="Pegasus AI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Pegasus - AI Fame Creator & Influencer Manager"
        />
        <meta
          name="twitter:description"
          content="Transform into a viral sensation with AI-powered content creation and growth tools"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          src="https://api.tempo.new/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js"
          strategy="afterInteractive"
        />
        <ErrorBoundary>
          <NotificationProvider>
            <div id="__next">
              <main role="main" aria-label="Main content">
                {children}
              </main>
            </div>
            <TempoInit />
            <EnhancedCursor />
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
