import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Ruler, Scissors, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { BookButton } from '@/components/ui/book-button'
import { ServiceCard } from '@/components/ui/service-card'
import { HairNotice } from '@/components/ui/hair-notice'
import { FaqSection } from '@/components/sections/faq-section'
import { ShareButton } from '@/components/share-button'
import { TrackServiceView } from '@/components/services/track-service-view'
import { BreadcrumbJsonLd, ServiceJsonLd } from '@/components/structured-data'
import { ServicePhotos } from '@/components/services/service-photos'
import {
  getAddons,
  getCategoryName,
  getRelatedServices,
  getService,
  getServicePhotos,
  services,
  faqs,
  preparation,
  site,
  SIZE_LABELS,
} from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { formatDuration, formatPrice } from '@/lib/utils'

/** All 47 pages are prerendered at build time. */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}

  const price =
    service.priceMode === 'quoted'
      ? 'Price quoted after you describe the style'
      : `${formatPrice(service.price)}`
  const city = `${site.contact.address.city}, ${site.contact.address.region}`

  return buildMetadata({
    title: `${service.name} — ${price}`,
    description: `${service.name} in ${city}. ${price}, about ${formatDuration(service.durationMinutes)} in the chair. ${service.hairProvidedBy === 'client' ? 'You bring the braiding hair. ' : ''}Book online with a ${formatPrice(site.deposit.amount)} deposit.`,
    path: `/services/${service.slug}`,
  })
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const addons = getAddons(service.addonIds)
  const related = getRelatedServices(service)
  const photos = getServicePhotos(service)
  const categoryName = getCategoryName(service.category)
  const quoted = service.priceMode === 'quoted'

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: service.name, href: `/services/${service.slug}` },
  ]

  /** Only the questions that bear on this style. */
  const serviceFaqs = faqs.filter((f) =>
    service.hairProvidedBy === 'not-applicable'
      ? ['How should my hair be prepared?', 'Is a deposit required?', 'What happens if I am running late?'].includes(f.question)
      : [
          'Is the braiding hair included?',
          'How should my hair be prepared?',
          'Is a deposit required?',
          'What happens if I am running late?',
        ].includes(f.question),
  )

  return (
    <>
      <TrackServiceView slug={service.slug} category={service.category} />

      <PageHeader
        eyebrow={categoryName}
        title={service.name}
        breadcrumbs={breadcrumbs}
        lede={service.notes.length > 0 ? service.notes.join(' ') : undefined}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <BookButton service={service.slug} placement="service-detail-header" size="lg">
            Book this style
          </BookButton>
          <ShareButton
            title={`${service.name} — ${site.name}`}
            path={`/services/${service.slug}`}
          />
        </div>
      </PageHeader>

      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Detail */}
            <div className="lg:col-span-7">
              {/* The four numbers that decide the booking. */}
              <dl className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
                <div className="bg-canvas p-4">
                  <dt className="flex items-center gap-1.5 text-[0.625rem] tracking-[0.12em] text-ink-subtle uppercase">
                    <Wallet aria-hidden="true" className="size-3 stroke-[1.5]" />
                    Price
                  </dt>
                  <dd
                    className={
                      quoted
                        ? 'mt-2 font-[family-name:var(--font-display)] text-base italic text-ink'
                        : 'mt-2 font-[family-name:var(--font-display)] text-2xl text-ink'
                    }
                  >
                    {quoted ? 'Quoted' : formatPrice(service.price)}
                  </dd>
                </div>
                <div className="bg-canvas p-4">
                  <dt className="flex items-center gap-1.5 text-[0.625rem] tracking-[0.12em] text-ink-subtle uppercase">
                    <Clock aria-hidden="true" className="size-3 stroke-[1.5]" />
                    In the chair
                  </dt>
                  <dd className="mt-2 font-[family-name:var(--font-display)] text-2xl text-ink">
                    {formatDuration(service.durationMinutes)}
                  </dd>
                </div>
                <div className="bg-canvas p-4">
                  <dt className="flex items-center gap-1.5 text-[0.625rem] tracking-[0.12em] text-ink-subtle uppercase">
                    <Wallet aria-hidden="true" className="size-3 stroke-[1.5]" />
                    Deposit
                  </dt>
                  <dd className="mt-2 font-[family-name:var(--font-display)] text-2xl text-ink">
                    {formatPrice(site.deposit.amount)}
                  </dd>
                </div>
                <div className="bg-canvas p-4">
                  <dt className="flex items-center gap-1.5 text-[0.625rem] tracking-[0.12em] text-ink-subtle uppercase">
                    <Ruler aria-hidden="true" className="size-3 stroke-[1.5]" />
                    Size
                  </dt>
                  <dd className="mt-2 font-[family-name:var(--font-display)] text-lg leading-tight text-ink">
                    {service.size ? SIZE_LABELS[service.size] : '—'}
                  </dd>
                </div>
              </dl>

              {quoted ? (
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  This style is priced once Kristian knows what you want. Book it, then
                  send a description of the style and she will confirm the price with you.
                </p>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {formatPrice(site.deposit.amount)} of that is the deposit, sent by{' '}
                  {site.deposit.methods.join(' or ')}. The remaining{' '}
                  {formatPrice(service.price - site.deposit.amount)} is cash at your
                  appointment.
                </p>
              )}

              {/* Braiding hair */}
              {service.hairProvidedBy !== 'unspecified' ? (
                <div className="mt-10">
                  <h2 className="text-xl text-ink">Braiding hair</h2>
                  <HairNotice service={service} className="mt-4" />
                  {service.requiresHairColorForm ? (
                    <p className="measure mt-4 text-sm leading-relaxed text-ink-muted">
                      When you book, the scheduler asks for the hair colour you are
                      bringing (1, 1B, 2, 4…) so everything is prepped before you arrive.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Add-ons */}
              {addons.length > 0 ? (
                <div className="mt-10">
                  <h2 className="text-xl text-ink">Add-ons for this style</h2>
                  <p className="measure mt-2 text-sm leading-relaxed text-ink-muted">
                    Chosen in the scheduler when you book. Only these apply to{' '}
                    {service.name}.
                  </p>
                  <ul className="mt-5 border-t border-rule">
                    {addons.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-baseline justify-between gap-4 border-b border-rule py-3.5"
                      >
                        <span className="text-base text-ink">{a.name}</span>
                        <span className="font-[family-name:var(--font-display)] text-lg text-ink">
                          {a.price === 0 ? 'Included' : `+${formatPrice(a.price)}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Preparation */}
              <div className="mt-10">
                <h2 className="text-xl text-ink">Before your appointment</h2>
                <ul className="mt-5 space-y-4">
                  {preparation.map((p) => (
                    <li key={p.id} className="flex gap-3">
                      <Scissors
                        aria-hidden="true"
                        className="mt-1 size-3.5 shrink-0 stroke-[1.5] text-clay-700"
                      />
                      <p className="text-sm leading-relaxed text-ink-muted">
                        <span className="font-medium text-ink">{p.title}.</span>{' '}
                        {p.body}
                      </p>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/policies"
                  className="mt-5 inline-block text-sm text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
                >
                  Full policies and preparation
                </Link>
              </div>

              {/* Aftercare — only claims that follow from the catalog itself. */}
              <div className="mt-10">
                <h2 className="text-xl text-ink">Keeping it fresh</h2>
                <p className="measure mt-3 text-sm leading-relaxed text-ink-muted">
                  {service.category === 'locs'
                    ? 'A Loc Re-Twist keeps the roots neat between installs — it is bookable on its own.'
                    : service.category === 'natural-hair'
                      ? 'Styled on your own hair with no added length, so there is no take-down appointment to plan for.'
                      : 'When the perimeter starts to loosen, a touch-up redoes the front 2–3 rows and includes a take-down and wash — rather than reinstalling the whole head. Braid Removal is bookable separately.'}
                </p>
                <Link
                  href="/services?category=touch-ups"
                  className="mt-4 inline-block text-sm text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
                >
                  See touch-ups &amp; removal
                </Link>
              </div>
            </div>

            {/* Sticky booking rail */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="border border-rule bg-canvas-sunk p-6 sm:p-8">
                  <p className="eyebrow">Book {service.name}</p>
                  <p className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] leading-none text-ink">
                    {quoted ? 'Quoted' : formatPrice(service.price)}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">
                    {formatDuration(service.durationMinutes)} in the chair ·{' '}
                    {formatPrice(site.deposit.amount)} deposit
                  </p>

                  <BookButton
                    service={service.slug}
                    placement="service-detail-rail"
                    size="lg"
                    className="mt-6 w-full"
                  >
                    Check availability
                  </BookButton>

                  <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
                    Opens Kristian’s live calendar. Nothing is charged on this site — the
                    deposit is sent separately by {site.deposit.methods.join(' or ')}.
                  </p>

                  <dl className="mt-6 space-y-2.5 border-t border-rule pt-5 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-subtle">Category</dt>
                      <dd className="text-right text-ink">
                        <Link
                          href={`/services?category=${service.category}`}
                          className="underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
                        >
                          {categoryName}
                        </Link>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-subtle">Balance</dt>
                      <dd className="text-right text-ink">Cash at appointment</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-subtle">Cancelling</dt>
                      <dd className="text-right text-ink">
                        {site.cancellationNoticeHours}h notice
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </aside>
          </div>

          {/* Renders nothing for services with no tagged photographs. */}
          <ServicePhotos photos={photos} serviceName={service.name} />
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 ? (
        <Section tone="sunk" className="py-16">
          <Container>
            <h2 className="text-[length:var(--text-display-sm)] text-ink">
              You might also like
            </h2>
            <div className="mt-8 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ServiceCard key={r.slug} service={r} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <FaqSection faqs={serviceFaqs} heading="About this style" eyebrow="Good to know" />

      <ServiceJsonLd service={service} />
      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
