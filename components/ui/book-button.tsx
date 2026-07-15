'use client'

import Link from 'next/link'
import { Button, type ButtonProps } from './button'
import { track } from '@/lib/analytics'

/**
 * The booking action, everywhere.
 *
 * Routes to /book (our page, wrapping the scheduler in Kristian's own site)
 * rather than throwing people straight out to Acuity — the handoff is where
 * bookings leak. `external` is available for the deliberate escape hatch.
 */
export function BookButton({
  service,
  placement,
  children = 'Book an appointment',
  external = false,
  href,
  ...props
}: {
  /** Service slug — for analytics and to preselect the style on /book. */
  service?: string
  /** Where this button lives, e.g. "header", "hero", "service-detail". */
  placement: string
  children?: React.ReactNode
  external?: boolean
  href?: string
} & Omit<ButtonProps, 'asChild' | 'children'>) {
  const target = href ?? (service ? `/book?style=${encodeURIComponent(service)}` : '/book')

  return (
    <Button asChild {...props}>
      <Link
        href={target}
        prefetch={!external}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={() => track({ name: 'booking_cta_click', props: { placement, service } })}
      >
        {children}
      </Link>
    </Button>
  )
}
