import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { Testimonials } from '@/components/sections/testimonials'
import { FinalCta } from '@/components/sections/final-cta'
import { BreadcrumbJsonLd } from '@/components/structured-data'
import { about, site, catalogStats } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { formatPhone, telHref } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'About Kristian',
  description: `Meet Kristian — a part-time braider working out of a salon suite in ${site.contact.address.city}, ${site.contact.address.region}, with ${catalogStats.serviceCount} protective styles on the menu.`,
  path: '/about',
})

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={about.eyebrow}
        title={about.heading}
        breadcrumbs={breadcrumbs}
      />

      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="measure space-y-5 text-lg leading-relaxed text-ink-muted">
                {about.intro.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>

              <h2 className="mt-14 text-[length:var(--text-display-sm)] text-ink">
                How I work
              </h2>
              <div className="mt-8 space-y-8">
                {about.philosophy.map((item, i) => (
                  <div key={item.title} className="border-t border-rule pt-6">
                    <p className="font-[family-name:var(--font-display)] text-sm text-clay-700">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 text-xl text-ink">{item.title}</h3>
                    <p className="measure mt-2.5 leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <p className="measure mt-12 border-l-2 border-clay-500 pl-5 text-lg leading-relaxed text-ink">
                {about.closing}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={telHref(site.contact.phone)}
                  className="text-sm font-medium text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
                >
                  {formatPhone(site.contact.phone)}
                </a>
                <a
                  href={site.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
                >
                  {site.social.instagram.handle}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="arch-sm relative aspect-[569/799] overflow-hidden bg-clay-200">
                  <Image
                    src="/images/kristian-portrait.jpg"
                    alt="Portrait of Kristian, the braider behind Braids by Kristian, smiling in a pink jacket with feathered cuffs."
                    width={569}
                    height={799}
                    sizes="(min-width: 1024px) 38vw, 90vw"
                    className="size-full object-cover"
                  />
                </div>

                {/* Her own words, quoted rather than paraphrased. */}
                <figure className="mt-8 border-t border-rule pt-6">
                  <blockquote>
                    <p className="text-sm leading-relaxed text-ink-muted italic">
                      “{about.verbatimBio}”
                    </p>
                  </blockquote>
                  <figcaption className="mt-3 text-xs text-ink-subtle">
                    Kristian, in her own words — from her booking site.
                  </figcaption>
                </figure>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Testimonials />
      <FinalCta />
      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
