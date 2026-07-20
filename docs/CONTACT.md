# Contact form

## Behaviour without configuration

The form works with no environment variables: it validates, accepts, and returns success. The submission is **logged server-side with a warning** rather than delivered.

That is a deliberate trade-off — the site stays deployable with no secrets, and the logs make it obvious mail is not wired up. **Configure it before launch**, or enquiries go nowhere.

## Where enquiries go

Kristian has a **Google Workspace mailbox on `braidsbykristian.com`**. That address is the
delivery target — but it is deliberately **not published anywhere on the site**.

`site.contact.email` is `null`, which hides the "email us" link. That is a decision, not an
unfilled placeholder: a mailto in public HTML is harvested within weeks, and this is her only
business inbox. Enquiries reach her through the form instead. **Delivery and publication are
separate concerns, and only delivery is wired up.**

The address is never committed — **this repository is public.** It lives only in the host's
environment panel.

## Setup (Resend)

1. Create a key at [resend.com/api-keys](https://resend.com/api-keys)
2. Verify a **`send.` subdomain** in Resend — not the root domain. See the SPF warning below.
3. Set all three in the host's env panel:
   ```bash
   RESEND_API_KEY=re_xxxxxxxx
   CONTACT_TO_EMAIL=<Kristian's Workspace mailbox>
   CONTACT_FROM_EMAIL=site@send.braidsbykristian.com
   ```
4. Confirm the wiring without sending mail:
   ```bash
   curl https://braidsbykristian.com/api/contact
   # {"configured":true}
   ```

All three are required. Any missing → `skipped`.

`reply_to` is set to the sender, so Kristian can just hit reply.

### ⚠ Do not verify the root domain in Resend

`braidsbykristian.com` already publishes an SPF record for Google Workspace:

```
TXT  @   v=spf1 include:_spf.google.com ~all
```

**A domain may only have one `v=spf1` record.** Adding Resend's as a second one is an SPF
*permerror* — receivers stop evaluating, and delivery degrades for Resend **and for Kristian's
own mail**. Merging both into a single record works but leaves one fragile string that a future
edit in either service can break.

Verify **`send.braidsbykristian.com`** instead. The subdomain carries its own SPF and DKIM, so
Resend's DNS records never touch the root zone and her Workspace email is unaffected.

Her live email records — preserve these through any DNS change:

| Type | Host | Value |
| --- | --- | --- |
| MX | `@` | `1 smtp.google.com` |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `google._domainkey` | `v=DKIM1; k=rsa; p=MIIBIjANBg…` (~400 chars) |

There is currently **no DMARC record**. Adding `_dmarc` with `v=DMARC1; p=none; rua=…` is
worth doing once Resend is verified, to get visibility before enforcing anything.

## Another provider

`lib/email.ts` is one `fetch`. Swap the endpoint and payload in `sendContactEmail()`; keep the `SendResult` shape (`ok: true | false | 'skipped'`) and the route keeps working.

## Validation

One Zod schema — `lib/validation/contact.ts` — is used by **both** the client form and the server route, so they cannot disagree. The server always re-validates; client validation is a convenience, never a control.

## Anti-spam

- **Honeypot** — a visually hidden `company` field, `aria-hidden` + `tabIndex={-1}` so it never reaches a screen reader or the tab order. Filled → the route returns `200` so a bot cannot tell it was caught.
- **Rate limit** — 5 requests per IP per minute.

> **The rate limit is not a real control.** The counter is in the module scope of one serverless instance: cold starts reset it and instances do not share state. It stops naive floods. For production, put Vercel WAF or Upstash Ratelimit in front of the route. See [SECURITY.md](SECURITY.md).

## Accessibility

Real `<label for>` on every field; errors wired via `aria-describedby` + `aria-invalid` and announced; the result is a `role="status"` live region; submit reports `aria-busy`. Errors are text, never colour alone.
