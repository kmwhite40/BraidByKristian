import Link from 'next/link'
import { ArrowRight, Instagram } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/ui/section'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { galleryItems, galleryCategories, site } from '@/lib/content'

/**
 * Gallery preview.
 *
 * The honest position: there are only a handful of photographs of Kristian's
 * work in any source we can verify, and filling the rest with stock braid
 * photography would misrepresent her work to the exact audience best able to
 * spot it. So the section shows what is real and sends people to Instagram —
 * which is where her actual portfolio lives — rather than padding.
 *
 * As real photos arrive, add them in lib/content/gallery.ts and this grows.
 */
export function GalleryPreview() {
  if (galleryItems.length === 0) return null

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="The work" title="Recent hands" />
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 pb-2 text-[0.8125rem] font-medium tracking-[0.12em] text-ink uppercase"
          >
            Full gallery
            <ArrowRight
              aria-hidden="true"
              className="size-4 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <GalleryGrid items={galleryItems} categories={galleryCategories} className="mt-10" />

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="measure text-sm leading-relaxed text-ink-muted">
            Kristian posts her newest work on Instagram — it is the fullest look at what
            she is doing right now.
          </p>
          <a
            href={site.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 border border-rule-strong px-5 text-[0.75rem] font-medium tracking-[0.12em] text-ink uppercase transition-colors hover:border-ink hover:bg-clay-50"
          >
            <Instagram aria-hidden="true" className="size-4 stroke-[1.5]" />
            {site.social.instagram.handle}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </Container>
    </Section>
  )
}
