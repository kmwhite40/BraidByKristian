import { booking } from '@/lib/content/site'

/**
 * Acuity (Squarespace Scheduling) is the single source of truth for
 * availability, pricing at checkout, deposits and confirmations.
 *
 * This site NEVER:
 *   - stores or generates appointment slots
 *   - mirrors the calendar into a local database
 *   - renders or proxies a payment form
 *   - touches card data
 *
 * It only builds links into Kristian's scheduler and embeds it in an iframe.
 */

/** Guards against an appointmentType ever being interpolated unvalidated. */
function assertAcuityId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid Acuity appointmentType id: ${String(id)}`)
  }
}

/** The scheduler landing page — the full catalog. */
export function bookingUrl(): string {
  return booking.scheduleUrl
}

/**
 * Deep link that preselects one service.
 *
 * `?appointmentType=<id>` is Acuity's long-standing, documented parameter and
 * is honoured both on the pretty URL and inside the embed, which is why it is
 * preferred over the newer /appointment/<id> path form.
 */
export function serviceBookingUrl(appointmentTypeId: number): string {
  assertAcuityId(appointmentTypeId)
  const url = new URL(booking.scheduleUrl)
  url.searchParams.set('appointmentType', String(appointmentTypeId))
  return url.toString()
}

/**
 * The embeddable form of the scheduler.
 *
 * Acuity's documented embed is an iframe against app.acuityscheduling.com with
 * the owner id. `next-embed` opts into the responsive template that plays well
 * inside an iframe.
 */
export function embedUrl(appointmentTypeId?: number): string {
  const url = new URL('https://app.acuityscheduling.com/schedule.php')
  url.searchParams.set('owner', booking.ownerId)
  url.searchParams.set('ref', 'embedded_csp')
  if (appointmentTypeId !== undefined) {
    assertAcuityId(appointmentTypeId)
    url.searchParams.set('appointmentType', String(appointmentTypeId))
  }
  return url.toString()
}

/**
 * Acuity's iframe-resizing helper. Loaded once, from Acuity's own host, and
 * allowlisted in the CSP `script-src`. It posts height messages so the embed
 * grows with its content instead of scrolling inside a fixed box.
 */
export const ACUITY_EMBED_SCRIPT = 'https://embed.acuityscheduling.com/js/embed.js'

/**
 * Clients cancel and reschedule from the confirmation email Acuity sends —
 * those links are per-appointment and signed, so there is no generic URL to
 * publish. `canClientsCancel` and `canClientsReschedule` are both enabled on
 * the account, which is what lets us state the 24-hour policy as actionable.
 */
export const SELF_SERVICE = {
  canCancel: true,
  canReschedule: true,
} as const

/* ---------------------------------------------------------------------------
   Future server-side integration (optional, not required to run the site).

   Acuity exposes a REST API that could power a real "next opening" indicator.
   It needs a User ID + API key, which must stay server-side. The public site
   builds and deploys without them; `hasAcuityApiCredentials()` simply returns
   false and every dependent feature stays hidden rather than showing a
   fabricated time.

   See docs/BOOKING.md for the endpoint and the route sketch.
--------------------------------------------------------------------------- */
export function hasAcuityApiCredentials(): boolean {
  return Boolean(process.env.ACUITY_USER_ID && process.env.ACUITY_API_KEY)
}
