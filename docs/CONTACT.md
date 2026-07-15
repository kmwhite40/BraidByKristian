# Contact form

## Behaviour without configuration

The form works with no environment variables: it validates, accepts, and returns success. The submission is **logged server-side with a warning** rather than delivered.

That is a deliberate trade-off — the site stays deployable with no secrets, and the logs make it obvious mail is not wired up. **Configure it before launch**, or enquiries go nowhere.

## Setup (Resend)

1. Create a key at [resend.com/api-keys](https://resend.com/api-keys)
2. Verify the sending domain in Resend (SPF + DKIM) — unverified domains land in spam
3. Set all three:
   ```bash
   RESEND_API_KEY=re_xxxxxxxx
   CONTACT_TO_EMAIL=kristian@…          # where enquiries land
   CONTACT_FROM_EMAIL=site@braidsbykristian.com   # must be on the verified domain
   ```
4. Confirm the wiring without sending mail:
   ```bash
   curl https://your-site.com/api/contact
   # {"configured":true}
   ```

All three are required. Any missing → `skipped`.

`reply_to` is set to the sender, so Kristian can just hit reply.

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
