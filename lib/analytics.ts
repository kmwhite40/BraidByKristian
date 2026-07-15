/**
 * Privacy-conscious analytics adapter.
 *
 * Default provider is Plausible: cookieless, no cross-site tracking, no
 * personal data — which is why no consent banner ships with this site. If you
 * swap in a provider that sets cookies or profiles users, you must add a
 * consent gate before loading it. See docs/ANALYTICS.md.
 *
 * With NEXT_PUBLIC_ANALYTICS_PROVIDER unset, every track() call is a no-op and
 * no script is loaded. The site is fully functional without analytics.
 *
 * WHAT IS NEVER TRACKED
 *   - names, emails, phone numbers, message bodies
 *   - appointment dates, times, or confirmations
 *   - anything about payment
 * Events carry a service slug and a placement string. Nothing else.
 */

export type AnalyticsProvider = 'plausible' | 'vercel' | 'none'

export function getProvider(): AnalyticsProvider {
  const p = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER
  if (p === 'plausible' || p === 'vercel') return p
  return 'none'
}

/** The complete event vocabulary. Adding an event means adding it here. */
export type AnalyticsEvent =
  | { name: 'booking_cta_click'; props: { placement: string; service?: string } }
  | { name: 'scheduler_open'; props: { service?: string; mode: 'embed' | 'external' } }
  | { name: 'service_view'; props: { service: string; category: string } }
  | { name: 'service_booking_click'; props: { service: string; category: string } }
  | { name: 'contact_form_submit'; props: { status: 'success' | 'error' } }
  | { name: 'style_finder_complete'; props: { matches: number } }
  | { name: 'gallery_open'; props: { item: string } }
  | { name: 'favorite_toggle'; props: { service: string; state: 'on' | 'off' } }

type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, string | number | boolean> },
) => void

declare global {
  interface Window {
    plausible?: PlausibleFn & { q?: unknown[] }
    va?: (event: string, props?: Record<string, unknown>) => void
  }
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return
  const provider = getProvider()
  if (provider === 'none') return

  const props = Object.fromEntries(
    Object.entries(event.props).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

  try {
    if (provider === 'plausible') {
      window.plausible?.(event.name, { props })
    } else if (provider === 'vercel') {
      window.va?.('event', { name: event.name, ...props })
    }
  } catch {
    // Analytics must never break the page — especially not a booking click.
  }
}
