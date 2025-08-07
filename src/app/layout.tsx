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
    url: "https://thepegasus.ca",
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
          href="https://thepegasus.ca"
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
          content="https://thepegasus.ca"
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
        {/* TikTok Pixel Code */}
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              
              ttq.load('D2A4MEBC77U5663GTKG0');
              ttq.page();
              }(window, document, 'ttq');
            `,
          }}
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
