import Image from 'next/image'
import Link from 'next/link'
import { getCategoryName } from '@/lib/content'
import type { ServicePhoto } from '@/lib/content'

/**
 * Photographs of a style, on its own service page.
 *
 * Someone choosing between forty-seven near-identically-named styles is making
 * a visual decision from a page that, until now, offered a price and a
 * duration. This is the section that answers "what does it actually look like".
 *
 * HONESTY
 * Two kinds of photo reach this component and they are captioned differently.
 * An `exact` photo is tagged with this service's own slug — it is this style,
 * and it is captioned plainly. A non-exact photo only shares the category: it
 * shows the family, but not necessarily this size or length. Those are labelled
 * as examples of the style family and say so in words, because a size-M photo
 * silently heading a size-S page is exactly the kind of quiet overclaim that
 * turns into disappointment at the chair.
 *
 * Renders nothing when there are no photographs. Most services have none today
 * — six photographs cover forty-seven services — and an empty state or a
 * placeholder would be worse than silence.
 */
export function ServicePhotos({
  photos,
  serviceName,
}: {
  photos: ServicePhoto[]
  serviceName: string
}) {
  if (photos.length === 0) return null

  const anyInexact = photos.some((p) => !p.exact)

  return (
    <section aria-labelledby="service-photos" className="mt-14">
      <h2 id="service-photos" className="text-[length:var(--text-display-sm)] text-ink">
        {photos.every((p) => p.exact) ? serviceName : 'This style'}
      </h2>

      {anyInexact ? (
        <p className="measure mt-3 leading-relaxed text-ink-muted">
          Some of these show the same style family rather than this exact size —
          each is labelled. Sizes and lengths change the look, so ask Kristian if
          you want to see something specific.
        </p>
      ) : null}

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <li key={p.id}>
            <figure>
              <div className="relative overflow-hidden border border-rule bg-canvas-sunk">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 flex flex-wrap items-baseline gap-x-2 text-sm text-ink-muted">
                <span>{p.caption}</span>
                {!p.exact && p.category ? (
                  <span className="text-xs tracking-[0.1em] text-ink-subtle uppercase">
                    {getCategoryName(p.category)} — style family
                  </span>
                ) : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Link
        href="/gallery"
        className="mt-6 inline-flex text-sm text-ink underline decoration-clay-500 underline-offset-4 hover:decoration-ink"
      >
        See the full gallery
      </Link>
    </section>
  )
}
