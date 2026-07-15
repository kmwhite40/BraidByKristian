# Analytics

## Off by default

With `NEXT_PUBLIC_ANALYTICS_PROVIDER` unset, **no script loads** and every `track()` call is a no-op. The site is fully functional without it.

```bash
NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=braidsbykristian.com
```

Supported: `plausible`, `vercel`, or empty.

## Why there is no cookie banner

Plausible is **cookieless** and stores no personal data, so no consent is required under GDPR/ePrivacy.

> **If you swap in a provider that sets cookies or fingerprints — including Google Analytics — you must add a consent gate before loading it, and update `/privacy`.** The absence of a banner is a consequence of the provider choice, not an oversight.

## Events

The complete vocabulary is the `AnalyticsEvent` union in `lib/analytics.ts`. Adding an event means adding it there — the type is the spec.

| Event | Props | Fires when |
| --- | --- | --- |
| `booking_cta_click` | `placement`, `service?` | Any Book button. `placement` says which one. |
| `scheduler_open` | `service?`, `mode` | The Acuity embed mounts, or the fallback link is used. |
| `service_view` | `service`, `category` | A service page renders. |
| `service_booking_click` | `service`, `category` | Book from a service page. |
| `contact_form_submit` | `status` | Form succeeds or fails. |
| `style_finder_complete` | `matches` | Finder reaches results. |
| `gallery_open` | `item` | Lightbox opens / deck changes. |
| `favorite_toggle` | `service`, `state` | A style is saved or unsaved. |

## What is never tracked

- Names, emails, phone numbers, message bodies
- Appointment dates, times, confirmations
- Anything about payment

Events carry a service slug and a placement string. Nothing else. `track()` is wrapped in try/catch — analytics must never break a booking click.

## The useful funnel

`booking_cta_click` → `scheduler_open` → (Acuity). The site cannot see conversions past the handoff — Acuity owns that. Compare `scheduler_open` counts against Acuity's own booking numbers to find where the drop is.
