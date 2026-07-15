import Script from 'next/script'
import { getProvider } from '@/lib/analytics'

/**
 * Loads the analytics script only when a provider is configured.
 *
 * Plausible is cookieless and stores no personal data, which is why no consent
 * banner ships. Swapping in anything that sets cookies or fingerprints means
 * adding a consent gate first — see docs/ANALYTICS.md.
 */
export function Analytics() {
  const provider = getProvider()
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  if (provider === 'plausible' && domain) {
    return (
      <Script
        defer
        strategy="afterInteractive"
        data-domain={domain}
        src="https://plausible.io/js/script.tagged-events.js"
      />
    )
  }

  // 'vercel' is wired through @vercel/analytics if it is installed; nothing to
  // inject here. 'none' loads nothing at all.
  return null
}
