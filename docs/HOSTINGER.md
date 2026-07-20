# Deploying to Hostinger

This site is a **Next.js Node application**, not a static site. That decides the plan.

---

## What Kristian needs to buy

| | What | Why |
| --- | --- | --- |
| **Hosting** | **Business web hosting** (from ~$3.99/mo) — or any **Cloud** plan | The cheapest plans (Single / Premium) do **not** run Node.js. Business is the entry point that does, and it allows up to 5 Node apps. Cloud Startup (~$7.99/mo) gives more headroom (4 CPU / 4 GB) but is more than this site needs. |
| **Domain** | **Nothing — already owned** | `braidsbykristian.com` is registered through Squarespace until 2027-07-15. Do **not** take the bundled free domain; just point the existing one at Hostinger. See [Domain & DNS](#domain--dns). |
| **SSL** | Nothing to buy | Free Let's Encrypt, issued automatically once the domain resolves. |
| **Email** | **Nothing — already running** | Google Workspace already serves mail on this domain. Do not add Hostinger email; it would collide with the live `MX` record. The contact form needs no mailbox — see [CONTACT.md](CONTACT.md). |

**Do not buy a VPS.** It would work, but it means she owns OS patching, Node upgrades and process supervision for a site that gets a few hundred visits a month.

### Why not the cheap plan + static export?

It is possible, and it is a real downgrade. `output: 'export'` would cost:

- **`/api/contact`** — static hosting cannot run it. The contact form would need a third-party form service.
- **`next.config.ts` headers()** — **not applied on static export.** All 7 security headers, including the CSP that pins `frame-src` to Acuity, would have to be hand-maintained in `.htaccess`.
- **`next/image` optimisation** — needs `images.unoptimized: true`, losing automatic AVIF/WebP.

Business plan is a few dollars more and keeps all of it. Take the Business plan.

---

## Deploying

Node apps live under hPanel → **Websites** (far-left icon strip) → **Web Apps**. They are *not*
in the per-website dashboard sidebar, which is where you land by default and where you will not
find them.

1. **Web Apps** → **Get started**
2. **Import Git repository** → authorise GitHub → pick `kmwhite40/BraidByKristian`
3. Configure:

   | Setting | Value |
   | --- | --- |
   | Framework | **Next.js** (auto-detected) |
   | Node version | **22** |
   | Branch | `main` |
   | Package manager | `pnpm` |
   | Build command | `pnpm build` |
   | Start command | `pnpm start` |
   | Output directory | `.next` |
   | Entry file | *leave blank* — Next.js is a recognised framework |

4. Add environment variables (below)
5. **Deploy**

`next start` binds to whatever `PORT` Hostinger sets, so no port config is needed.

**If "Connect with GitHub" is greyed out,** no GitHub account is linked to the Hostinger account
yet. Link one — it is worth the five minutes. The fallback is **Upload your files** with a ZIP,
which works but is a one-shot snapshot: every subsequent change means building and uploading a
new ZIP by hand, where the Git connection redeploys on `git push`.

Build a clean ZIP with `git archive`, never `zip -r .`:

```bash
git archive --format=zip -o ~/Desktop/app.zip HEAD
```

`git archive` emits exactly the tracked tree, so `node_modules`, `.next`, `.git` and everything
in `.gitignore` are excluded by construction rather than by a list of `--exclude` flags you have
to keep correct. The result is ~1.2 MB, well under the 50 MB limit.

### Two build failures this project already hit

Both died during dependency install, before any application code ran. Both are fixed in the
repo — this is here so a future change does not reintroduce them.

**1. Hostinger reads `engines`, not `.nvmrc`.**

```
ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING
  at .../corepack/v1/pnpm/11.15.1/bin/pnpm.cjs:3:1
Node.js v20.19.4
```

`engines.node` was `>=20.9.0`, so Hostinger chose Node 20 — regardless of `.nvmrc` saying 22 or
the UI dropdown being set to 22. Node 20.19's bundled corepack cannot load pnpm 11. `engines` is
now `>=22.0.0`; keep it that way, and keep it in step with `.nvmrc` and the CI workflow.

**2. A pinned `packageManager` field breaks the host.**

```
This project is configured to use 11.9.0 of pnpm. Your current pnpm is v11.15.1
Corepack invoked pnpm with this version, and pnpm does not switch versions
when running under corepack.
```

`packageManager: "pnpm@11.9.0"` pinned an exact pnpm; Hostinger's corepack ships a different
patch release and pnpm refuses to run rather than proceed on a version the project did not ask
for. **The field has been removed** — the lockfile already provides reproducibility, and the pin
only cost the ability to build anywhere whose toolchain differs slightly.

CI read its pnpm version from that same field, so `.github/workflows/ci.yml` now pins `version:`
explicitly in all three jobs. If you ever restore `packageManager`, expect the host to break.

---

## Environment variables

Set these in hPanel before the first deploy. **None are required for the site to build** — every
one unlocks an optional integration, and unset the dependent feature hides itself rather than
faking it.

| Variable | Set it? | If unset |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional now | Defaults to `https://braidsbykristian.com`, which is correct. Set it explicitly only to override for a preview/staging origin — it is baked in at build time, so changing it needs a **redeploy**. |
| `RESEND_API_KEY`<br>`CONTACT_TO_EMAIL`<br>`CONTACT_FROM_EMAIL` | Before launch | The contact form validates and returns success but only **logs** the message. Set the addresses **here, never in the repo — it is public.** Verify `send.braidsbykristian.com` in Resend, not the root domain, or you break Kristian's SPF. See [CONTACT.md](CONTACT.md). |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`<br>`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | No analytics script loads at all. |
| `ACUITY_USER_ID`, `ACUITY_API_KEY` | Optional | Nothing. **Booking is unaffected** — the scheduler needs no credentials. |
| `INSTAGRAM_ACCESS_TOKEN` | Optional | No Instagram sync. |

Only the `NEXT_PUBLIC_*` ones reach the browser. Never prefix a secret with `NEXT_PUBLIC_`.

---

## Domain & DNS

### The actual situation

The domain is **already registered**, and not at Hostinger. Verified 2026-07-20:

| | |
| --- | --- |
| Domain | `braidsbykristian.com` |
| Registrar | **Squarespace Domains II LLC** (registered 2026-07-15, expires 2027-07-15) |
| DNS | `nse1–4.squarespacedns.com` |
| Currently serving | A Squarespace **"under construction" placeholder** — no real content to preserve |
| Email | **Google Workspace, live and in use** |

Two consequences:

- **Do not buy a domain with the hosting plan.** She already owns this one. The free-domain
  offer on annual Business plans is irrelevant here.
- **Email is the asset at risk, not the website.** The placeholder site can be replaced with
  zero loss. The mailbox cannot.

### Recommended: change only the A records, leave DNS at Squarespace

Squarespace → **Domains** → `braidsbykristian.com` → **DNS Settings**:

1. Delete the four Squarespace `A` records on `@`
   (`198.49.23.144`, `198.49.23.145`, `198.185.159.144`, `198.185.159.145`)
2. Add one `A` record: `@` → **the Hostinger server IP** (hPanel → Websites → Dashboard)
3. Repoint `www` — replace the `ext-sq.squarespace.com` CNAME with a `CNAME` to the root domain,
   or a second `A` record to the same IP
4. **Leave every `MX` and `TXT` record alone**

Nothing that carries mail is touched, so there is no window where email can break. Propagation is
usually well under an hour; SSL issues automatically once Hostinger sees the domain resolve.

### Alternative: move DNS to Hostinger wholesale

Tidier long-term — one panel for the customer instead of two — but it puts the mailbox at risk
for a cosmetic gain. Only do this deliberately.

Switching the nameservers to:

```
ns1.dns-parking.com
ns2.dns-parking.com
```

…discards the entire Squarespace zone, **including all three email records**. Recreate them in
Hostinger's DNS editor **before** flipping, not after:

| Type | Host | Value |
| --- | --- | --- |
| MX | `@` | `1 smtp.google.com` |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `google._domainkey` | `v=DKIM1; k=rsa; p=MIIBIjANBg…` (~400 chars) |

> ⚠ The DKIM value is a ~400-character string that must be copied **byte-exact**. Retrieve the
> live values first — do not retype them:
> ```bash
> dig +short MX braidsbykristian.com
> dig +short TXT braidsbykristian.com
> dig +short TXT google._domainkey.braidsbykristian.com
> ```
> A wrong or missing DKIM record does not bounce mail — it silently sends her outgoing email to
> spam folders, which is far harder to notice than an outright failure.

After switching, confirm mail still flows **both ways** before considering it done.

---

## ⚠ Hostinger Email will silently delete Kristian's mail records

**This happened on 2026-07-20 and took her email down.** It is the single most dangerous thing
about hosting this domain here, and it is not something the UI warns you about.

Kristian's mail is **Google Workspace**. Hostinger sells its own email service, and it
auto-provisions itself on any domain you attach to hosting. When it does, it does not merge with
what is already there — it **rewrites the DNS zone**, deleting the `MX`, `SPF`, `DKIM` and
`DMARC` records that make Google Workspace work, and substituting its own.

Observed twice in one afternoon:

1. **On adding the domain to hosting** — injected `mx1/mx2.hostinger.com` alongside Google's MX,
   plus a second `v=spf1` record. Two SPF records is a permerror: SPF then fails for *both*
   senders. Caught before saving.
2. **On attaching the domain to the Web App** — wiped all four records outright, leaving only
   `A`, `AAAA` and two `CNAME`s. Mail was already failing when it was noticed.

### The records that must survive

Capture these **before** any domain operation, and check them **after**:

| Type | Host | Value |
| --- | --- | --- |
| MX | `@` | `1 smtp.google.com` — this and nothing else |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` — exactly one SPF record |
| TXT | `google._domainkey` | `v=DKIM1; k=rsa; p=…` — 408 characters |
| TXT | `_dmarc` | `v=DMARC1; p=none` |

```bash
dig +short MX braidsbykristian.com
dig +short TXT braidsbykristian.com
dig +short TXT google._domainkey.braidsbykristian.com
dig +short TXT _dmarc.braidsbykristian.com
```

Run these against the authoritative server (`@pixel.dns-parking.com`) rather than a public
resolver — caching will show you records that no longer exist for up to 48 hours, which is
exactly how an outage stays invisible.

### What to do

- **Turn Hostinger Email off** for this domain (hPanel → Emails). There is no API for it. Until
  it is off, every future domain operation can repeat this.
- **Never add a second `MX` or `v=spf1` record.** One mail provider, one SPF.
- **Test both directions after any DNS change** — send *to* and *from* her address. A missing
  DKIM does not bounce; it quietly routes her outgoing mail to spam, which is far harder to
  notice than an outright failure and much harder to undo reputationally.
- Delete the `autodiscover` / `autoconfig` CNAMEs if they reappear. They point mail clients at
  Hostinger during auto-setup instead of Google.

---

## Attaching the real domain to the Web App

A Web App is created on a generated `*.hostingersite.com` address. Pointing the real domain at it
is a Hostinger-side association — **no DNS changes are needed or wanted**.

The domain must not already be hosted as its own site, or the attach fails with
`[Hosting:9999] Domain is already hosted`. Free it first, then add it to the Web App as a
domain/alias.

Then re-check the email records above, because this is one of the operations that wipes them.

---

## After the first deploy

- [ ] **Kristian's email still works** — send a message *to* and *from* her Workspace mailbox.
      Do this **first**, and again a few hours later once DNS has fully propagated.
- [ ] `dig +short MX braidsbykristian.com` still returns `1 smtp.google.com`
- [ ] `curl -sI https://braidsbykristian.com | grep -i content-security-policy` — present
- [ ] The same check shows **no `unsafe-eval`** (that is dev-only; if it appears, it built in dev mode)
- [ ] `/book` — the Acuity calendar loads and shows real availability
- [ ] A Book button opens the scheduler deep-linked to that style
- [ ] `curl https://braidsbykristian.com/api/contact` → `{"configured":true}`, then send a real test message
- [ ] `/sitemap.xml` lists 58 URLs on the live domain
- [ ] Submit the sitemap in Google Search Console
- [ ] Replace the watermarked photography (see [IMAGES.md](IMAGES.md))

## Rolling back

Hostinger keeps previous deployments — redeploy the last good commit from the Node.js Web App
panel. The site is almost entirely static, so a rollback is quick and safe.

## Notes for later

- **`/api/contact` is the only dynamic route.** Everything else — all 63 pages, including the 47
  service pages — is prerendered at build time. If that route is ever removed, the site becomes a
  candidate for static export and a cheaper plan (accepting the trade-offs above).
- **Rate limiting** on `/api/contact` is in-memory and resets whenever the Node process restarts.
  On a single always-on Hostinger process it behaves better than it would on serverless, but it is
  still not a real control. See [SECURITY.md](SECURITY.md).

Sources: [Node.js hosting options at Hostinger](https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/) ·
[How to deploy a Node.js website in Hostinger](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
