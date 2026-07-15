import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import { getCategoryName, SIZE_LABELS, type Service } from '@/lib/content'
import { cn, formatDuration, formatPrice } from '@/lib/utils'
import { HairNotice } from './hair-notice'
import { BookButton } from './book-button'
import { FavoriteButton } from '@/components/favorite-button'

/**
 * Service card.
 *
 * No image: there is no photograph of most of these 47 styles, and a stock
 * braid photo would misrepresent Kristian's work. Instead the card leads with
 * the price as display type — which is what people are actually scanning for —
 * and treats the rest as an editorial spec list. It reads as a deliberate
 * typographic catalog rather than a grid of empty image wells.
 *
 * The whole card is a link to the detail page (via the stretched pseudo-element
 * on the title), with the Book action layered above it. One tab stop for the
 * card, one for Book — not five.
 */
export function ServiceCard({
  service,
  className,
  showCategory = true,
}: {
  service: Service
  className?: string
  showCategory?: boolean
}) {
  const quoted = service.priceMode === 'quoted'

  return (
    <article
      className={cn(
        'group relative flex flex-col border-t border-rule pt-5',
        'transition-colors duration-300 hover:border-espresso-600',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {showCategory ? (
            <p className="eyebrow mb-2 text-[0.625rem]">
              {getCategoryName(service.category)}
            </p>
          ) : null}
          <h3 className="text-xl leading-tight text-ink">
            {/* The stretched link makes the whole card clickable. Its
                accessible name is just the style name — adding "view details"
                here would collide with the explicit Details link below and
                give a screen reader two near-identical links. */}
            <Link
              href={`/services/${service.slug}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {service.name}
            </Link>
          </h3>
        </div>

        <p
          className={cn(
            'shrink-0 text-right font-[family-name:var(--font-display)] leading-none text-ink',
            quoted ? 'text-base italic' : 'text-3xl',
          )}
        >
          {quoted ? 'Quoted' : formatPrice(service.price)}
        </p>
      </div>

      <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-subtle">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Scheduled time</dt>
          <Clock aria-hidden="true" className="size-3.5 stroke-[1.5]" />
          <dd>{formatDuration(service.durationMinutes)}</dd>
        </div>
        {service.size ? (
          <div>
            <dt className="sr-only">Size</dt>
            <dd>{SIZE_LABELS[service.size]}</dd>
          </div>
        ) : null}
      </dl>

      {service.notes.length > 0 ? (
        <p className="measure-tight mt-3 text-sm leading-relaxed text-ink-muted">
          {service.notes[0]}
        </p>
      ) : null}

      <div className="mt-4">
        <HairNotice service={service} compact />
      </div>

      {/* Layered above the stretched link so both remain clickable. */}
      <div className="relative z-10 mt-5 flex items-center gap-4 pb-5">
        {/* Routes via BookButton so it obeys `booking.mode` like every other
            CTA — a hardcoded /book link here would quietly diverge. */}
        <BookButton
          service={service.slug}
          placement="service-card"
          size="sm"
          className="h-9 gap-1.5 px-4 text-[0.6875rem]"
        >
          Book
          <ArrowUpRight aria-hidden="true" className="size-3.5 stroke-[1.5]" />
          <span className="sr-only">{service.name}</span>
        </BookButton>
        <Link
          href={`/services/${service.slug}`}
          className="text-[0.6875rem] font-medium tracking-[0.14em] text-ink-muted uppercase underline decoration-clay-500 underline-offset-4 transition-colors hover:text-ink"
        >
          Details
          <span className="sr-only"> for {service.name}</span>
        </Link>
        <FavoriteButton slug={service.slug} name={service.name} className="ml-auto" />
      </div>
    </article>
  )
}
