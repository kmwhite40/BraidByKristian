# Booking

## The contract with Acuity

Acuity Scheduling is the **single source of truth** for availability, checkout, deposits and confirmations.

This site **never**:
- stores or generates appointment slots
- mirrors the calendar into a database
- renders, proxies or imitates a payment form
- touches card data

It builds links into Kristian's scheduler and embeds it. That is the whole integration.

## The account

| | |
| --- | --- |
| Scheduler | `https://braidsbykristian.as.me/schedule/b36fc416` |
| Owner ID | `35089723` |
| Owner key | `b36fc416` |
| Timezone | `America/Chicago` |
| Calendars | Kristian Pete (`11701903`), Sydney Verdun (`12513903` — Braid Removal only) |
| Intake form | "Braiding Hair Color" (`2943302`) — asks the colour of the hair *you* are providing |

## URLs

Every Acuity URL is built in **`lib/booking/acuity.ts`** and nowhere else.

| Function | Produces |
| --- | --- |
| `bookingUrl()` | The scheduler landing page (full catalog) |
| `serviceBookingUrl(id)` | `…/schedule/b36fc416?appointmentType=<id>` — preselects one service |
| `embedUrl(id?)` | `app.acuityscheduling.com/schedule.php?owner=35089723&…` for the iframe |

`?appointmentType=` is Acuity's long-standing documented parameter and works on both the pretty URL and inside the embed, which is why it is preferred over the newer `/appointment/<id>` path form.

`assertAcuityId()` guards every interpolation — a bad id throws rather than producing a broken link.

## The deposit is NOT taken in Acuity

Worth being explicit, because it shapes the whole flow: the account has **no payment processor connected**, and every service is flagged `isOnlinePaymentNotAllowed`. Booking a slot does **not** take money.

The real sequence, per Kristian's published policy:

1. Book a slot in the scheduler
2. Send the **$25 deposit** separately by **Cash App or Zelle**
3. Confirmation follows the deposit
4. Balance is **cash** at the appointment

`/book` says this out loud so nobody assumes they are done at step 1.

## Where the Book buttons go

`booking.mode` in `lib/content/site.ts` is the one switch. Every CTA — header,
hero, footer, service cards, sticky bar — reads it through `BookButton`, so they
cannot drift apart.

| mode | Book CTAs go to |
| --- | --- |
| `'external'` (current) | Kristian's Acuity scheduler, new tab. A service CTA deep-links that exact style via `?appointmentType=<id>`. |
| `'embed'` | `/book` on this site, which gates on the prep acknowledgement then embeds the same scheduler. |

**Trade-off.** `'external'` is the shortest path to the calendar, but it skips
the prep gate — and those two requirements (clean dry hair, no oils) are where
the $45 wash fee and the reschedules come from. `/book` still exists in either
mode and is still linked from the policies and accessibility pages, so switching
back is a one-word change.

External links open in a new tab with `rel="noopener noreferrer"`. The scheduler
is a different origin; without `noopener` the opened page gets a handle on ours
via `window.opener`.

## The prep gate

`/book` puts one acknowledgement in front of the calendar: clean dry hair, no oils, deposit is non-refundable.

This is deliberate. The $45 wash fee and the reschedules both come from people arriving with oiled or undried hair. It is one checkbox, nothing is transmitted, and every policy remains readable on `/policies`.

## Embedding

`components/booking/acuity-embed.tsx`:
- a titled iframe (announced and listed by screen readers)
- Acuity's `embed.js`, loaded `afterInteractive`, posts height messages so the frame grows instead of scrolling in a fixed box
- a **fallback link** to the secure Acuity page is always visible — not hidden behind a failure state. Extensions and strict tracking protection do block third-party frames.

CSP `frame-src` is pinned to the exact Acuity hosts in `next.config.ts`. See [SECURITY.md](SECURITY.md).

## Optional: the Acuity API

Not required. The site builds and books with no credentials.

Setting `ACUITY_USER_ID` + `ACUITY_API_KEY` makes `hasAcuityApiCredentials()` return true. Nothing consumes it yet — it is the hook for a future real "next opening" indicator.

```
GET https://acuityscheduling.com/api/v1/availability/dates
    ?appointmentTypeID=<id>&month=YYYY-MM
Authorization: Basic base64(USER_ID:API_KEY)
```

Implement it as a **server route** (`app/api/next-opening/route.ts`) with a short `revalidate`. Never expose the key to the client, and never render a guessed time — with no credentials the feature must stay hidden rather than show a fake.
