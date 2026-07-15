'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { ACUITY_EMBED_SCRIPT, embedUrl, serviceBookingUrl, bookingUrl } from '@/lib/booking/acuity'
import { track } from '@/lib/analytics'

/**
 * The Acuity scheduler, embedded.
 *
 * Contract with Acuity:
 *   - the iframe is the real scheduler, not a reimplementation
 *   - availability, pricing at checkout and confirmations all stay theirs
 *   - embed.js posts height messages so the frame grows with its content;
 *     without it the calendar would scroll inside a fixed box on mobile
 *   - we never read from, write to, or style the frame's contents — same-origin
 *     policy forbids it and attempting it would be user-hostile anyway
 *
 * Accessibility:
 *   - the iframe carries a `title`, so it is announced as a named frame and
 *     appears in the screen reader's frame list
 *   - the fallback link below is always present, never hidden behind a failure
 *     state — it is the escape hatch if the frame is blocked by an extension,
 *     a strict tracking-protection setting, or a slow network
 *   - keyboard focus passes into the frame normally; nothing traps it
 *
 * CSP: frame-src is pinned to Acuity's hosts in next.config.ts.
 */
export function AcuityEmbed({
  appointmentTypeId,
  serviceName,
}: {
  appointmentTypeId?: number
  serviceName?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const src = embedUrl(appointmentTypeId)
  const externalHref = appointmentTypeId
    ? serviceBookingUrl(appointmentTypeId)
    : bookingUrl()

  useEffect(() => {
    track({
      name: 'scheduler_open',
      props: { service: serviceName, mode: 'embed' },
    })
  }, [serviceName])

  return (
    <div>
      <div className="relative border border-rule bg-canvas-raised">
        {/* Reserves the frame's box so the page does not jump when it paints. */}
        {!loaded ? (
          <div
            className="absolute inset-x-0 top-0 flex h-40 items-center justify-center"
            aria-hidden="true"
          >
            <p className="text-sm text-ink-subtle">Loading Kristian’s calendar…</p>
          </div>
        ) : null}

        <iframe
          src={src}
          title={
            serviceName
              ? `Booking calendar for ${serviceName}`
              : 'Braids by Kristian booking calendar'
          }
          width="100%"
          height="800"
          onLoad={() => setLoaded(true)}
          className="block w-full"
          style={{ minHeight: 800 }}
        />
      </div>

      {/* Acuity's resizer. afterInteractive: the iframe must exist first. */}
      <Script src={ACUITY_EMBED_SCRIPT} strategy="afterInteractive" />

      <p className="mt-4 text-sm text-ink-muted">
        Calendar not loading?{' '}
        <a
          href={externalHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track({
              name: 'scheduler_open',
              props: { service: serviceName, mode: 'external' },
            })
          }
          className="inline-flex items-center gap-1 font-medium text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
        >
          Open the secure booking page
          <ExternalLink aria-hidden="true" className="size-3.5 stroke-[1.5]" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
    </div>
  )
}
