'use client'

import Link from 'next/link'
import { Button, type ButtonProps } from './button'
import { track } from '@/lib/analytics'
import { booking } from '@/lib/content/site'
import { getService } from '@/lib/content'
import { bookingUrl, serviceBookingUrl } from '@/lib/booking/acuity'

/**
 * The booking action, everywhere.
 *
 * Destination is controlled by `booking.mode` in lib/content/site.ts — this
 * component is the only place that decides it, so the header, hero, footer,
 * cards and sticky bar can never drift apart.
 *
 * In 'external' mode this routes straight to Kristian's Acuity scheduler. When
 * a `service` is given it deep-links to that exact style via
 * ?appointmentType=<id>, so someone booking Medium Knotless lands on Medium
 * Knotless rather than the full 47-item menu.
 *
 * External links open in a new tab: the scheduler is a different origin, and
 * losing the site mid-decision is worse than a second tab. `rel="noopener"` is
 * required — without it the opened page gets a handle on ours via window.opener.
 */
export function BookButton({
  service,
  placement,
  children = 'Book an appointment',
  external,
  href,
  ...props
}: {
  /** Service slug — deep-links the scheduler and labels the analytics event. */
  service?: string
  /** Where this button lives, e.g. "header", "hero", "service-detail". */
  placement: string
  children?: React.ReactNode
  /** Force the external scheduler regardless of `booking.mode`. */
  external?: boolean
  href?: string
} & Omit<ButtonProps, 'asChild' | 'children'>) {
  const goExternal = external ?? booking.mode === 'external'
  const svc = service ? getService(service) : undefined

  // An unknown slug must never produce a broken link — fall back to the full menu.
  const target =
    href ??
    (goExternal
      ? svc
        ? serviceBookingUrl(svc.id)
        : bookingUrl()
      : service
        ? `/book?style=${encodeURIComponent(service)}`
        : '/book')

  const onClick = () => {
    track({ name: 'booking_cta_click', props: { placement, service } })
    if (goExternal) {
      track({ name: 'scheduler_open', props: { service, mode: 'external' } })
    }
  }

  if (goExternal) {
    return (
      <Button asChild {...props}>
        <a href={target} target="_blank" rel="noopener noreferrer" onClick={onClick}>
          {children}
          <span className="sr-only"> (opens the booking calendar in a new tab)</span>
        </a>
      </Button>
    )
  }

  return (
    <Button asChild {...props}>
      <Link href={target} prefetch onClick={onClick}>
        {children}
      </Link>
    </Button>
  )
}
