'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQueryParam } from '@/lib/hooks/use-query-param'
import { AlertCircle, Check } from 'lucide-react'
import { AcuityEmbed } from './acuity-embed'
import { getService, preparation, site } from '@/lib/content'
import { formatDuration, formatPrice } from '@/lib/utils'

/**
 * The booking page body.
 *
 * `?style=<slug>` preselects a service in the scheduler. An unknown slug is
 * ignored and the full menu loads — a bad link should never dead-end someone
 * who is trying to give Kristian money.
 *
 * The acknowledgement gate in front of the calendar is deliberate. The two
 * requirements it restates (clean dry hair, no oils) are exactly what the $45
 * wash fee and the reschedules come from. It is one checkbox, not a funnel, and
 * it is the last honest moment to say it before someone picks a date.
 */
export function BookingClient() {
  // Read after mount rather than via useSearchParams, which would opt this
  // component out of prerendering and leave /book as a bare Suspense fallback.
  // See lib/hooks/use-query-param.ts.
  const slug = useQueryParam('style')
  const service = slug ? getService(slug) : undefined
  const [acknowledged, setAcknowledged] = useState(false)

  const required = preparation.filter((p) => p.required)

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
      {/* Prep rail */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          {service ? (
            <div className="mb-6 border border-espresso-600 bg-clay-50 p-5">
              <p className="eyebrow">Booking</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-xl leading-tight text-ink">
                {service.name}
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                {service.priceMode === 'quoted'
                  ? 'Price quoted after you describe the style'
                  : formatPrice(service.price)}{' '}
                · {formatDuration(service.durationMinutes)}
              </p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-3 inline-block text-sm text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
              >
                Style details
              </Link>
            </div>
          ) : null}

          {/* An unrecognised ?style= is worth saying out loud rather than
              silently ignoring — the link they followed was wrong. */}
          {slug && !service ? (
            <div className="mb-6 flex gap-3 border border-rule bg-canvas-sunk p-4">
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 stroke-[1.5] text-espresso-600"
              />
              <p className="text-sm leading-relaxed text-ink-muted">
                That style link is not one we recognise, so the full menu is loaded
                below. <Link href="/services" className="underline underline-offset-4">Browse all styles</Link>.
              </p>
            </div>
          ) : null}

          <h2 className="text-xl text-ink">Before you pick a date</h2>
          <ul className="mt-5 space-y-5">
            {required.map((p) => (
              <li key={p.id} className="border-l-2 border-espresso-600 pl-4">
                <p className="text-sm font-medium text-ink">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{p.body}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-8 space-y-3 border-t border-rule pt-6 text-sm">
            <div>
              <dt className="font-medium text-ink">
                {formatPrice(site.deposit.amount)} deposit
              </dt>
              <dd className="mt-1 leading-relaxed text-ink-muted">
                Non-refundable, comes off your total. Sent by{' '}
                {site.deposit.methods.join(' or ')} after you pick a time — not on this
                site.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Balance in cash</dt>
              <dd className="mt-1 leading-relaxed text-ink-muted">
                Paid at your appointment.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink">
                {site.gracePeriodMinutes}-minute grace period
              </dt>
              <dd className="mt-1 leading-relaxed text-ink-muted">
                After that, a {formatPrice(site.fees.late)} late fee. More than{' '}
                {site.gracePeriodMinutes} minutes and the appointment is cancelled.
              </dd>
            </div>
          </dl>

          <Link
            href="/policies"
            className="mt-6 inline-block text-sm text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
          >
            Read the full policies
          </Link>
        </div>
      </aside>

      {/* Scheduler */}
      <div className="lg:col-span-8">
        {!acknowledged ? (
          <div className="border border-rule bg-canvas-sunk p-6 sm:p-10">
            <p className="eyebrow">One thing first</p>
            <h2 className="mt-4 text-[length:var(--text-display-sm)] leading-tight text-ink">
              Two requirements, then the calendar
            </h2>
            <ul className="mt-6 space-y-3">
              {required.map((p) => (
                <li key={p.id} className="flex gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 stroke-[1.5] text-espresso-600"
                  />
                  <p className="text-sm leading-relaxed text-ink-muted">
                    <span className="font-medium text-ink">{p.title}.</span> {p.body}
                  </p>
                </li>
              ))}
            </ul>

            <label className="mt-8 flex cursor-pointer items-start gap-3 border border-rule-strong bg-canvas-raised p-4 transition-colors hover:border-espresso-600">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-[var(--color-espresso-600)]"
              />
              <span className="text-sm leading-relaxed text-ink">
                Got it — I’ll come with clean, dry, tangle-free hair and no oil-based
                products, and I understand the {formatPrice(site.deposit.amount)} deposit
                is non-refundable.
              </span>
            </label>

            <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
              This is just an acknowledgement — nothing is sent anywhere, and you can
              still read everything on the{' '}
              <Link href="/policies" className="underline underline-offset-4">
                policies page
              </Link>
              .
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl text-ink">Pick your date and time</h2>
                <p className="mt-1.5 text-sm text-ink-muted">
                  Live availability from Kristian’s calendar, in{' '}
                  {site.contact.timezone.replace('America/', '').replace('_', ' ')} time.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAcknowledged(false)}
                className="shrink-0 text-xs text-ink-subtle underline underline-offset-4 hover:text-ink"
              >
                Back to requirements
              </button>
            </div>
            <AcuityEmbed
              appointmentTypeId={service?.id}
              serviceName={service?.name}
            />
          </div>
        )}
      </div>
    </div>
  )
}
