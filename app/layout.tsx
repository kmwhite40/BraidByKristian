import type { Metadata, Viewport } from 'next'
import { fontVariables } from '@/lib/fonts'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AnnouncementBar } from '@/components/layout/announcement-bar'
import { StickyBookBar } from '@/components/layout/sticky-book-bar'
import { BusinessJsonLd } from '@/components/structured-data'
import { Analytics } from '@/components/analytics'
import { site } from '@/lib/content/site'
import { OG_IMAGE } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Braider in ${site.contact.address.city}, ${site.contact.address.region}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.stylist }],
  creator: site.stylist,
  formatDetection: { telephone: true, address: false, email: false },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: site.name,
    images: [OG_IMAGE],
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  themeColor: '#faf6f1',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        {/* Scroll-reveal sections are server-rendered with opacity:0 by motion
            and are only revealed once JS observes them. Without JS they would
            stay invisible forever, so force them visible. Paired with
            components/motion/reveal.tsx — do not remove one without the other. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: '[data-reveal]{opacity:1!important;transform:none!important}',
            }}
          />
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        {/* First tab stop on every page. */}
        <a
          href="#main"
          className="sr-only z-100 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:bg-espresso-800 focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-canvas"
        >
          Skip to main content
        </a>

        <AnnouncementBar />
        <Header />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />
        <StickyBookBar />
        {/* Keeps the sticky mobile bar from covering the last of the footer. */}
        <div aria-hidden="true" className="h-16 sm:hidden print:hidden" />

        <BusinessJsonLd />
        <Analytics />
      </body>
    </html>
  )
}
