# Braids by Kristian

The website for **Braids by Kristian** — a braider working out of a salon suite in Garland, TX.

Booking runs on Kristian's existing **Acuity Scheduling** account. This site does not replace it, mirror it, or store appointments. It presents the catalog, answers the questions that block a booking, and hands off to the real scheduler.

```
Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Motion · Zod · Vitest · Playwright · pnpm
```

---

## Quick start

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

No environment variables are needed to run the site. See [`.env.example`](.env.example) for the optional integrations.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build (63 static pages) |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest unit + component tests |
| `pnpm test:e2e` | Playwright, across 6 viewports (builds first) |
| `pnpm verify` | typecheck → lint → test → build |

---

## The one rule

**Nothing on this site may state a business fact that Kristian has not published.**

Prices, durations, policies, hours, the address and the testimonials were all extracted from her live booking page. No years of experience, client counts, awards, or star ratings appear anywhere, because none of them are verifiable.

Where the source is silent, the UI stays silent. The clearest example: `hairProvidedBy` is `'unspecified'` for 13 services, and the "you bring the braiding hair" notice **renders nothing** for them rather than guessing. `pnpm test` enforces this — see [`tests/unit/content.test.ts`](tests/unit/content.test.ts).

---

## Editing content

Almost everything a non-developer needs is in **[`lib/content/site.ts`](lib/content/site.ts)**: phone, address, hours, social links, deposit amount, fees, and the announcement bar.

| I want to change… | Edit |
| --- | --- |
| Phone, address, hours, socials | `lib/content/site.ts` |
| Deposit / late fee / cancellation window | `lib/content/site.ts` → `deposit`, `fees` |
| The announcement bar (or turn it off) | `lib/content/site.ts` → `announcement.enabled` |
| Homepage featured styles | `lib/content/index.ts` → `featuredServiceSlugs` |
| Policies + preparation | `lib/content/policies.ts` |
| FAQs | `lib/content/faq.ts` |
| Testimonials | `lib/content/testimonials.ts` |
| Gallery photos | `lib/content/gallery.ts` |
| About copy | `lib/content/about.ts` |
| Navigation | `lib/content/navigation.ts` |
| **Prices / services** | **Do not hand-edit** — see below |

Everything is validated with Zod at module load. A bad edit fails the build instead of shipping a wrong price.

### The service catalog

[`lib/content/services.data.ts`](lib/content/services.data.ts) is **generated** from the Acuity scheduler — 47 services, 11 categories, 7 add-ons. Do not hand-edit it.

Acuity is the source of truth. To change a price, change it in Acuity, then regenerate: **[docs/CONTENT.md](docs/CONTENT.md)**.

---

## Documentation

| Doc | Covers |
| --- | --- |
| [docs/CONTENT.md](docs/CONTENT.md) | Editing content; regenerating the catalog from Acuity |
| [docs/BOOKING.md](docs/BOOKING.md) | How the Acuity integration works; the optional API adapter |
| [docs/IMAGES.md](docs/IMAGES.md) | Adding photos; why Instagram can't be scraped; the official sync |
| [docs/CONTACT.md](docs/CONTACT.md) | Contact form + Resend setup |
| [docs/ANALYTICS.md](docs/ANALYTICS.md) | Analytics adapter, event names, privacy |
| [docs/SECURITY.md](docs/SECURITY.md) | CSP, rate limiting, and their known limits |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel, DNS, launch checklist |
| [docs/DESIGN.md](docs/DESIGN.md) | The design system and why it looks the way it does |

---

## Architecture

```
app/                      Routes (App Router). 63 pages, all static but /api/contact.
  services/[slug]/        47 prerendered service pages
  api/contact/            The only dynamic route
components/
  ui/                     Primitives — button, field, card-stack, wordmark…
  sections/               Homepage sections
  layout/                 Header, footer, announcement, sticky CTA
  gallery/                Grid, lightbox, card stack
  booking/                Acuity embed + the prep gate
lib/
  content/                The typed content model — the heart of the project
  booking/acuity.ts       Every Acuity URL is built here, nowhere else
  validation/             Zod schemas shared by client and server
  hooks/                  useSyncExternalStore-based storage + scroll
public/images/            Real photography (see docs/IMAGES.md)
tests/unit/               88 Vitest tests
tests/e2e/                Playwright, 6 viewports
```

**Server-first.** Only genuinely interactive leaves are `'use client'`. The whole catalog is server-rendered, so it is complete and indexable before any JS runs.

---

## What still needs Kristian

These are tracked as `[NEEDS-INPUT]` in `lib/content/site.ts`:

1. **Photography** — only 4 photos exist, cropped from her booking-site flyers. This is the biggest gap. See [docs/IMAGES.md](docs/IMAGES.md).
2. **A conflict to resolve** — her bio says she serves *Fate, TX*, but her address and site header both say *Garland, TX*. The site uses Garland (it has a street address behind it). If Fate is right, fix `serviceArea` and `address` together.
3. **Email address** — none is published, so the contact form logs instead of delivering and the "email us" link stays hidden.
4. **TikTok** — no profile is published; the icon does not render.
5. **Domain** — `NEXT_PUBLIC_SITE_URL` is a placeholder.
6. **Testimonial attribution** — the reviews are real but the source does not say which service each client had.

---

## Licence

All rights reserved. Photography and brand assets belong to Braids by Kristian.
