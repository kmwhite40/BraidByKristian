import type { Metadata } from 'next'
import { Instagram } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { FeaturedStack } from '@/components/gallery/featured-stack'
import { FinalCta } from '@/components/sections/final-cta'
import { BreadcrumbJsonLd } from '@/components/structured-data'
import { galleryItems, galleryCategories, site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Gallery',
  description: `Braiding work by Kristian in ${site.contact.address.city}, ${site.contact.address.region}. See her latest styles on Instagram at ${site.social.instagram.handle}.`,
  path: '/gallery',
})

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'Gallery', href: '/gallery' },
]

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="The work"
        title="Recent hands"
        lede="A look at Kristian's work and the suite she works out of. The newest installs go up on Instagram first."
        breadcrumbs={breadcrumbs}
      />

      <Section className="py-12 sm:py-16">
        <Container>
          {/* Lead with the deck; the full filterable grid follows. */}
          <FeaturedStack items={galleryItems} />

          <div className="mt-16 border-t border-rule pt-12">
            <h2 className="sr-only">All photos</h2>
            <GalleryGrid items={galleryItems} categories={galleryCategories} eagerCount={2} />
          </div>

          <div className="mt-16 border-t border-rule pt-12 text-center">
            <p className="eyebrow">More of it</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-[length:var(--text-display-sm)] leading-tight text-ink">
              Kristian’s full portfolio lives on Instagram
            </h2>
            <p className="measure mx-auto mt-4 leading-relaxed text-ink-muted">
              She posts finished installs there as she goes — it is the most complete and
              most current look at what she is doing.
            </p>
            <a
              href={site.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-13 items-center gap-2 bg-espresso-600 px-8 text-[0.8125rem] font-medium tracking-[0.14em] text-canvas uppercase transition-colors hover:bg-espresso-800"
            >
              <Instagram aria-hidden="true" className="size-4 stroke-[1.5]" />
              {site.social.instagram.handle}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </Container>
      </Section>

      <FinalCta />
      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
