# Deployment

Target: **Vercel**. Nothing here depends on a secret being present.

## First deploy

1. Push to GitHub.
2. Import the repo in Vercel. Framework preset **Next.js** is detected; build command `pnpm build`, output default. No overrides needed.
3. Set **`NEXT_PUBLIC_SITE_URL`** to the production origin (e.g. `https://braidsbykristian.com`).
   > Do this first. Everything else works without config, but a wrong `SITE_URL` puts the wrong canonical on all 63 pages and poisons the sitemap.
4. Deploy.

## Environment variables

| Variable | Needed? | Effect if unset |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Set before launch** | Canonicals/sitemap point at a placeholder domain |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` + `CONTACT_FROM_EMAIL` | Set before launch | Contact form logs instead of delivering |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` (+ `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`) | Optional | No analytics script loads |
| `ACUITY_USER_ID` + `ACUITY_API_KEY` | Optional | "Next opening" stays hidden. **Booking is unaffected.** |
| `INSTAGRAM_ACCESS_TOKEN` | Optional | No IG sync. Gallery renders committed photos. |

Mark every non-`NEXT_PUBLIC_` variable **Production + Preview**, never "expose to browser".

## Domain & DNS

1. Vercel → Project → Settings → Domains → add `braidsbykristian.com` and `www.`
2. At the registrar:
   - Apex `A` → `76.76.21.21`, **or** `ALIAS`/`ANAME` → `cname.vercel-dns.com`
   - `www` `CNAME` → `cname.vercel-dns.com`
3. Pick one canonical host and redirect the other (Vercel does this).
4. Wait for the certificate.
5. Update `NEXT_PUBLIC_SITE_URL` to match, and **redeploy** — it is baked in at build time.

If email is on the same domain, do not disturb existing `MX`/`TXT`. Resend's SPF/DKIM records are additive.

## Launch checklist

- [ ] `pnpm verify` passes locally
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain, redeployed after
- [ ] `curl -sI https://…​ | grep -i content-security-policy` — present, and **no `unsafe-eval`**
- [ ] `/book` → tick the box → the Acuity calendar loads and shows real availability
- [ ] Deep link works: `/book?style=medium-knotless` preselects Medium Knotless
- [ ] Contact form: `curl https://…/api/contact` → `{"configured":true}`, then send a real test
- [ ] Rate limiting moved to Vercel WAF / Upstash (see SECURITY.md)
- [ ] `/sitemap.xml` lists 58 URLs on the real domain
- [ ] `/robots.txt` allows crawling
- [ ] Submit the sitemap in Google Search Console
- [ ] Replace the photography with clean, unwatermarked exports from K.Nett (see IMAGES.md)
- [ ] Replace the flyer-cropped photography with real photos (see IMAGES.md)
- [ ] Lighthouse on `/` and `/services/medium-knotless`
- [ ] Check the announcement bar is still in season

## Rollback

Vercel → Deployments → the last good one → **Promote to Production**. The site is static; rollback is instant and safe.
