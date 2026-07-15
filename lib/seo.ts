import type { Metadata } from 'next'
import { site } from '@/lib/content/site'

export const OG_IMAGE = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: `${site.name} — protective styling in ${site.contact.address.city}, ${site.contact.address.region}`,
}

export function absoluteUrl(path = '/'): string {
  return new URL(path, site.url).toString()
}

/**
 * Per-page metadata. `path` drives the canonical URL, which is the one thing
 * that must never be templated wrong — duplicate canonicals across a 47-service
 * catalog would flatten the whole site in search.
 */
export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
  images,
}: {
  title: string
  description: string
  path: string
  noIndex?: boolean
  images?: { url: string; width: number; height: number; alt: string }[]
}): Metadata {
  const url = absoluteUrl(path)
  const ogImages = images ?? [OG_IMAGE]

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: 'en_US',
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  }
}
