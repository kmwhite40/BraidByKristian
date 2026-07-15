import type { NextConfig } from 'next'

/**
 * Content Security Policy.
 *
 * The scheduler is the only third-party frame this site permits. `frame-src` is
 * pinned to the exact Acuity / Squarespace Scheduling hosts that serve the
 * Braids by Kristian scheduler — no wildcard, no blanket `https:`.
 *
 * `script-src` allows `'unsafe-inline'` because Next.js injects inline bootstrap
 * and flight-data scripts on statically generated pages. Removing it requires
 * per-request nonces via middleware, which would opt every route out of static
 * rendering. See docs/SECURITY.md for the rationale and the upgrade path.
 */
const ACUITY_HOSTS = [
  'https://app.acuityscheduling.com',
  'https://secure.acuityscheduling.com',
  'https://embed.acuityscheduling.com',
  'https://app.squarespacescheduling.com',
  'https://braidsbykristian.as.me',
]

const isDev = process.env.NODE_ENV === 'development'

/**
 * True only on a real deployed origin (Vercel sets VERCEL_ENV). False for
 * `next dev` AND for a local `next start`, which is what the E2E suite serves.
 *
 * This gates the two HTTPS-transport headers. They are meaningless over local
 * HTTP, and actively harmful there — see the HSTS note below.
 */
const isDeployed = Boolean(process.env.VERCEL_ENV)

const csp = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  // 'unsafe-eval' is DEV ONLY — React's development build uses eval() to
  // rebuild cross-environment stack traces. It is never sent in production.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://embed.acuityscheduling.com https://plausible.io`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://cdn-s.acuityscheduling.com`,
  `font-src 'self' data:`,
  `connect-src 'self' https://plausible.io ${ACUITY_HOSTS.join(' ')}`,
  `frame-src ${ACUITY_HOSTS.join(' ')}`,
  // Only meaningful on a real https origin, and it breaks local HTTP on WebKit
  // (which, unlike Chromium, applies the upgrade to 127.0.0.1). See below.
  ...(isDeployed ? ['upgrade-insecure-requests'] : []),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  /**
   * HSTS — deployed origins only.
   *
   * RFC 6797 §7.2 says a UA MUST ignore HSTS received over non-secure
   * transport. WebKit does not: served over http://127.0.0.1 it registers the
   * policy and force-upgrades every subresource to https, which has no
   * certificate — so the CSS, the JS chunks and the fonts all fail their TLS
   * handshake, hydration never runs, and every interactive test dies on Safari
   * while passing on Chromium.
   *
   * Sending HSTS from localhost is a footgun regardless of tests: it can pin
   * every future localhost:* project to https in that browser.
   */
  ...(isDeployed
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // All production imagery is served from /public. No remote patterns are
    // configured on purpose: it keeps the image optimizer from being used as an
    // open proxy for arbitrary third-party hosts.
    remotePatterns: [],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
