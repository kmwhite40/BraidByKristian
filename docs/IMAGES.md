# Images

## The honest state of this

**Four photographs exist.** They are cropped from the brand photography Kristian publishes on her own Acuity booking page:

| File | What it is |
| --- | --- |
| `studio-kristian-and-clients.jpg` | Kristian seated with two clients — the hero |
| `client-braided-style-01.jpg` | A client, braided style with curled ends |
| `client-braided-style-02.jpg` | A client, pulled back with curls out |
| `kristian-portrait.jpg` | Her portrait — About page |

That is the whole library, and it is the site's biggest gap. **The single highest-value thing Kristian can supply is photographs of her work.**

## What we will not do

- **No stock photography.** A braiding gallery showing someone else's hands is worse than a short one, and this audience spots it instantly.
- **No competitor images.** Ever.
- **No generic "braid" imagery** that misrepresents her actual work.

This is why the gallery is small and why the service cards are typographic rather than a grid of empty image wells. A short honest gallery beats a padded dishonest one.

## Why Instagram can't just be scraped

`@braidsbykristian` is the real portfolio, but it cannot be scraped:

- `instagram.com/braidsbykristian/` returns a **login wall** — no image data in the HTML.
- The `/embed/` endpoint does leak `scontent-*.cdninstagram.com` URLs, but those are **signed to the requesting session**. Fetching one out of band returns:
  ```
  Bad URL hash
  ```

This is Meta deliberately preventing exactly this, and any workaround would break the moment they rotated a key. So: use the official API, or export the photos.

## Adding photos — the three routes

### 1. Manually (simplest, recommended)

1. Drop the file in `public/images/gallery/`
2. Add an entry to `lib/content/gallery.ts`:
   ```ts
   {
     id: 'knotless-01',
     src: '/images/gallery/knotless-01.jpg',
     alt: 'Client wearing waist-length medium knotless braids with curled ends.',
     width: 1200,          // real intrinsic size — the build validates it
     height: 1500,
     caption: 'Medium knotless, waist length',
     category: 'knotless', // turns on this filter chip
     serviceSlug: 'medium-knotless',  // links the photo to a bookable style
     isPlaceholder: false,
   }
   ```
3. `pnpm test` — dimensions and alt text are validated.

**Alt text must describe the photo**, not repeat the caption. "Client wearing waist-length medium knotless braids with curled ends" — not "braids".

Setting `category` also grows the gallery filter and the card-stack deck automatically. There is no second list to maintain.

### 2. Instagram, officially

Set `INSTAGRAM_ACCESS_TOKEN` (Graph API, long-lived tokens expire after 60 days) and use `lib/instagram.ts`.

**Download at build time. Do not hotlink.** `media_url` values are signed and expire — hotlinking would give visitors broken images within days and would force a CDN host into the image allowlist. `fetchRecentMedia()` returns metadata; write a `scripts/sync-instagram.ts` that fetches each `media_url`, writes the bytes to `public/images/gallery/`, and commits them.

### 3. A shoot

The real answer. Portrait orientation, natural light, plain background, and — most importantly — **shot from behind and above** so the parting is visible. That is what people are actually buying.

## Sizing

- Portrait, roughly **3:4** or **4:5**
- **1200–1600px** on the long edge is plenty; `next/image` generates the rest
- Ship JPEG or PNG — AVIF/WebP conversion is automatic
- Keep files under ~500KB before optimisation

## Placeholders

`isPlaceholder: true` marks an image for replacement. `tests/unit/content.test.ts` asserts **no placeholders ship** — the suite fails if one is left in. There are currently none.
