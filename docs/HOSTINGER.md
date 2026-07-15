# Deploying to Hostinger

This site is a **Next.js Node application**, not a static site. That decides the plan.

---

## What Kristian needs to buy

| | What | Why |
| --- | --- | --- |
| **Hosting** | **Business web hosting** (from ~$3.99/mo) — or any **Cloud** plan | The cheapest plans (Single / Premium) do **not** run Node.js. Business is the entry point that does, and it allows up to 5 Node apps. Cloud Startup (~$7.99/mo) gives more headroom (4 CPU / 4 GB) but is more than this site needs. |
| **Domain** | One domain, e.g. `braidsbykristian.com` | Business plans on an annual term normally include a **free domain for the first year**. If she already owns one, point it at Hostinger instead of buying again. |
| **SSL** | Nothing to buy | Free Let's Encrypt, issued automatically once the domain resolves. |
| **Email** | Optional | Only needed if she wants `hello@braidsbykristian.com`. The contact form does not require it — see [CONTACT.md](CONTACT.md). |

**Do not buy a VPS.** It would work, but it means she owns OS patching, Node upgrades and process supervision for a site that gets a few hundred visits a month.

### Why not the cheap plan + static export?

It is possible, and it is a real downgrade. `output: 'export'` would cost:

- **`/api/contact`** — static hosting cannot run it. The contact form would need a third-party form service.
- **`next.config.ts` headers()** — **not applied on static export.** All 7 security headers, including the CSP that pins `frame-src` to Acuity, would have to be hand-maintained in `.htaccess`.
- **`next/image` optimisation** — needs `images.unoptimized: true`, losing automatic AVIF/WebP.

Business plan is a few dollars more and keeps all of it. Take the Business plan.

---

## Deploying

Hostinger imports straight from GitHub and rebuilds on every push — the repo is already at
`github.com/kmwhite40/BraidByKristian`.

1. hPanel → **Websites** → **Node.js Web App** → **Deploy Web App**
2. **Import Git Repository** → authorise GitHub → pick `kmwhite40/BraidByKristian`
3. Configure:

   | Setting | Value |
   | --- | --- |
   | Framework | **Next.js** |
   | Node version | **22.x** (or 24.x). **Not 18.x** — Next 16 needs ≥20.9. `.nvmrc` pins 22. |
   | Branch | `main` |
   | Build command | `pnpm build` (or `npm run build` if pnpm is not offered) |
   | Start command | `pnpm start` |
   | Entry file | *leave blank* — Next.js is a recognised framework, so it does not need one |

4. Add environment variables (below)
5. **Deploy**

`next start` binds to whatever `PORT` Hostinger sets, so no port config is needed.

> **pnpm vs npm.** The repo has a `pnpm-lock.yaml`. If Hostinger's build dropdown only offers
> npm, the build still works — npm resolves from `package.json` and writes its own lockfile —
> but you lose the exact pinned versions. Prefer pnpm if it is listed.

---

## Environment variables

Set these in hPanel before the first deploy. **None are required for the site to build** — every
one unlocks an optional integration, and unset the dependent feature hides itself rather than
faking it.

| Variable | Set it? | If unset |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes — before launch** | Canonicals and the sitemap point at a placeholder domain. Set it to the real origin, e.g. `https://braidsbykristian.com`, then **redeploy** — it is baked in at build time. |
| `RESEND_API_KEY`<br>`CONTACT_TO_EMAIL`<br>`CONTACT_FROM_EMAIL` | Before launch | The contact form validates and returns success but only **logs** the message. See [CONTACT.md](CONTACT.md). |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`<br>`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | No analytics script loads at all. |
| `ACUITY_USER_ID`, `ACUITY_API_KEY` | Optional | Nothing. **Booking is unaffected** — the scheduler needs no credentials. |
| `INSTAGRAM_ACCESS_TOKEN` | Optional | No Instagram sync. |

Only the `NEXT_PUBLIC_*` ones reach the browser. Never prefix a secret with `NEXT_PUBLIC_`.

---

## Domain & DNS

**If the domain is bought through Hostinger:** nothing to do — it is wired up automatically.

**If it is registered elsewhere,** point the nameservers at Hostinger:

```
ns1.dns-parking.com
ns2.dns-parking.com
```

Propagation is usually under an hour. SSL is issued once it resolves.

> ⚠ If email already runs on that domain, changing nameservers **moves DNS wholesale** and will
> break the existing `MX` records unless they are recreated in Hostinger's DNS. If she has working
> email on the domain, copy the `MX` and `TXT` records across **before** switching.

---

## After the first deploy

- [ ] `NEXT_PUBLIC_SITE_URL` set to the live domain, **and redeployed after setting it**
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
