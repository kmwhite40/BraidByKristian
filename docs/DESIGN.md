# Design

## Where the look came from

Nothing here was invented from a mood board. The palette is **sampled from Kristian's own brand collateral** — the flyers on her booking page — with a script that quantised the dominant colours:

| Token | Hex | Where it came from |
| --- | --- | --- |
| `--color-clay-500` | `#C49979` | The signature mocha. **62%** of the flyer artwork. |
| `--color-espresso-600` | `#73442D` | The "Business Hours" arch |
| `--color-espresso-800` | `#3D2C23` | |
| `--color-ink` | `#120E0D` | Her display type |
| `--color-clay-300` | `#D5B19D` | |
| `--color-canvas` | `#FAF6F1` | The warm ivory her flyers are matted against |

Hex is kept rather than converted to oklch: these were sampled from sRGB JPEGs, so there is no gamut to gain, and hex stays traceable to the source.

### Contrast (WCAG 2.2 AA)

| Pair | Ratio | |
| --- | --- | --- |
| `ink` on `canvas` | 15.9:1 | ✅ |
| `espresso-600` on `canvas` | 7.4:1 | ✅ accent text + links |
| `ink` on `clay-500` | 8.4:1 | ✅ dark text on clay fields |
| `clay-500` on `canvas` | 2.1:1 | ❌ **surfaces and rules only, never text** |

That last row is the rule that keeps the brand colour from becoming an accessibility problem.

## Type

- **Bodoni Moda** (display) — her flyers set every display line in a condensed high-contrast serif. This is the closest open-licensed match. Its *italic* carries the "by kristian" half of the wordmark.
- **Jost** (sans) — geometric, Futura lineage, matching the flyers' body and the letterspaced "Based in Garland, TX".

Both are self-hosted by `next/font` at build time: no request to Google, no render-blocking stylesheet, `font-display: swap`, and a size-adjusted fallback so swapping does not shift layout.

Deliberately **not** Inter + Playfair — the pairing that makes a site read as templated.

## The arch

Every content block on Kristian's flyers sits inside a rounded-top arch. It is the brand's structural motif, so it is the site's: the hero image, the portrait, the card-stack deck, the monogram.

## The wordmark

There is no vector original — her logo is baked into a leopard-print raster, unusable at UI sizes. `components/ui/wordmark.tsx` rebuilds it typographically: "braids" in Bodoni, a hairline, "by kristian" in its italic. Keeps the lowercase warmth of her mark, scales to 16px, works in one colour, needs no image request.

## Rules held to

- **No image on service cards.** There is no photo of most of the 47 styles, and a stock braid photo would misrepresent her work. The cards lead with the **price as display type** — what people actually scan for — and treat the rest as an editorial spec list. A deliberate typographic catalog beats a grid of empty image wells.
- **No gradient scrims.** Captions sit on solid plates. The scrim is the tell, and solid keeps text contrast real.
- **Hairlines, not cards.** No `rounded-2xl` + `shadow-xl`.
- **One accent family.** Clay/espresso. No second hue.
- **Prices are text, never baked into an image.**

## Motion

The entire vocabulary for page content is **one** short rise+fade, once, on scroll into view (`components/motion/reveal.tsx`). Plus button/hover microinteractions and the lightbox. No parallax, no floating, no cursor gimmicks, no auto-advancing carousel.

**Reduced motion** (`prefers-reduced-motion: reduce`) does not animate *faster* — it does not animate. `Reveal` renders a plain div; the card stack lays out flat and swaps instantly.

> ⚠️ **`Reveal` + the `<noscript>` block in `app/layout.tsx` are a pair.** Motion serialises `initial` into the SSR markup as `style="opacity:0"`. Without the `[data-reveal]` override, every scroll-revealed section would be permanently invisible with JS off. Do not remove one without the other.

## Modern platform features in use

- `useSyncExternalStore` for scroll + localStorage (no setState-in-effect, SSR-safe, no tearing)
- `@starting-style` + `transition-behavior: allow-discrete` — the mobile menu animates in with **no JS**
- `content-visibility: auto` on the 47-card catalog — all cards render (so filtering is instant and the whole menu is indexable) while off-screen ones skip layout and paint
- `interpolate-size: allow-keywords` — height animates to `auto` natively
- `text-wrap: balance` / `pretty`
- Fluid `clamp()` type scale — no breakpoint jumps

**View Transitions were considered and rejected:** React's `ViewTransition` needs a canary build, and a canary React is not going under a production booking site. Revisit when it lands in stable.
