import type { MetadataRoute } from 'next'
import { services } from '@/lib/content'
import { absoluteUrl } from '@/lib/seo'

/**
 * Sitemap: the 12 static routes plus all 47 service pages.
 *
 * /book is highest priority after the homepage — it is the page that earns the
 * money. Service pages rank above the informational routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: { path: string; priority: number; freq: 'weekly' | 'monthly' | 'yearly' }[] = [
    { path: '/', priority: 1.0, freq: 'weekly' },
    { path: '/book', priority: 0.9, freq: 'weekly' },
    { path: '/services', priority: 0.9, freq: 'weekly' },
    { path: '/gallery', priority: 0.7, freq: 'weekly' },
    { path: '/style-finder', priority: 0.6, freq: 'monthly' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/policies', priority: 0.6, freq: 'monthly' },
    { path: '/faq', priority: 0.6, freq: 'monthly' },
    { path: '/contact', priority: 0.6, freq: 'monthly' },
    { path: '/privacy', priority: 0.2, freq: 'yearly' },
    { path: '/accessibility', priority: 0.2, freq: 'yearly' },
  ]

  return [
    ...staticRoutes.map((r) => ({
      url: absoluteUrl(r.path),
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
