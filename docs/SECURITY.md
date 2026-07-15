# Security

## Threat model

This site takes **no payments**, stores **no appointments**, and has **no accounts or database**. That removes most of the risk surface by construction. What is left: the contact endpoint, the third-party frame, and the headers.

## Content Security Policy

Set in `next.config.ts`. The important line:

```
frame-src https://app.acuityscheduling.com https://secure.acuityscheduling.com
          https://embed.acuityscheduling.com https://app.squarespacescheduling.com
          https://braidsbykristian.as.me
```

**The scheduler is the only third-party frame permitted.** Pinned to exact hosts — no wildcard, no blanket `https:`. This was the explicit requirement: allow Acuity without opening the door to arbitrary frames.

Also: `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'` (nobody frames us), `base-uri 'self'` (no base-tag injection), `form-action 'self'`.

### Two known compromises

1. **`script-src` includes `'unsafe-inline'`.** Next.js injects inline bootstrap and flight-data scripts on statically generated pages. Removing it needs per-request nonces via middleware, which would opt **every route out of static rendering** — the thing that makes this site fast. The trade was made deliberately.
   *Upgrade path:* if the site ever goes dynamic, add nonce middleware and drop `'unsafe-inline'`.

2. **`'unsafe-eval'` in development only.** React's dev build uses `eval()` to rebuild stack traces. Gated on `NODE_ENV === 'development'` — it is never sent in production. Verify after deploying:
   ```bash
   curl -sI https://your-site.com | grep -i content-security-policy
   ```

## Other headers

`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `Referrer-Policy: strict-origin-when-cross-origin` · `Strict-Transport-Security` (2y, preload) · `Permissions-Policy` (camera/mic/geolocation off) · `X-Powered-By` removed.

## Rate limiting — read this

`app/api/contact/route.ts` limits 5 requests per IP per minute.

> **This is not a real control.** The counter lives in the module scope of a single serverless instance. Cold starts reset it; instances do not share state. It stops naive floods and nothing more.
>
> **Before launch, put a real limiter in front of the route** — Vercel WAF rate limiting (no code) or Upstash Ratelimit (durable, ~10 lines).

## Payments

The application never sees card data. There is no checkout, no processor, no card field. The deposit is sent to Kristian directly by Cash App or Zelle; the balance is cash. Acuity itself has **no payment processor connected** and every service is flagged `isOnlinePaymentNotAllowed`.

Never add a payment form that imitates or intercepts Acuity's.

## Secrets

- `.env*` is gitignored; `.env.example` carries no real values.
- Only `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ANALYTICS_PROVIDER` and `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` are public — none is sensitive.
- `RESEND_API_KEY`, `ACUITY_API_KEY`, `INSTAGRAM_ACCESS_TOKEN` are **server-only**. Never prefix them `NEXT_PUBLIC_`.

## Injection

- **XSS** — React escapes by default. `dangerouslySetInnerHTML` appears twice: JSON-LD (`JSON.stringify` + `<` escaped to `<`, so content cannot break out of the tag) and a static `<noscript>` style with no interpolation.
- **HTML email** — every user value is escaped by `escapeHtml()` in `lib/email.ts` before interpolation.
- **Open redirect** — no route takes a redirect target. `?style=` is looked up against the catalog and ignored if unknown; it is never used as a URL.
- **Acuity ids** — `assertAcuityId()` rejects anything that is not a positive integer before it reaches a URL.

## Images

`images.remotePatterns` is **empty on purpose**. Adding a remote host lets the optimizer be used as a proxy for that host. All production imagery is local. This is also why Instagram photos must be downloaded at build time, not hotlinked.

## Dependencies

`pnpm audit` in CI. Dependabot is configured weekly. The tree is deliberately small — Resend is called over `fetch` rather than adding its SDK.
