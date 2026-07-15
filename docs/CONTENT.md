# Content

## Where things live

| File | Holds |
| --- | --- |
| `lib/content/site.ts` | **Start here.** Contact, address, hours, socials, deposit, fees, announcement bar. |
| `lib/content/services.data.ts` | **Generated.** The 47-service catalog. Do not hand-edit. |
| `lib/content/policies.ts` | Booking policies + preparation, with Kristian's verbatim wording preserved. |
| `lib/content/faq.ts` | FAQs. Each carries a `source` tag. |
| `lib/content/testimonials.ts` | Real reviews only. |
| `lib/content/gallery.ts` | Photos. |
| `lib/content/about.ts` | About copy + her verbatim bio. |
| `lib/content/navigation.ts` | Header/footer links. |
| `lib/content/schema.ts` | The Zod schemas everything is validated against. |

Everything is parsed at module load. A malformed edit fails `pnpm build` rather than shipping.

## Provenance tags

`lib/content/site.ts` tags every value:

- `[VERIFIED]` — taken from Kristian's live Acuity booking page.
- `[NEEDS-INPUT]` — a placeholder. Grep for `NEEDS-INPUT` to find them all. Each is wired to render nothing (or an honest fallback) until filled in, so an unfilled placeholder can never surface as a fake claim.

## The rule

**If Kristian has not published it, it does not go on the site.**

No years of experience, client counts, awards, or ratings. When the source is silent, the UI stays silent — `hairProvidedBy: 'unspecified'` renders no hair notice at all rather than guessing. `tests/unit/content.test.ts` enforces this; those tests are the guardrail, not decoration.

## Regenerating the catalog from Acuity

Acuity is the source of truth for prices, durations, add-ons and categories. Change them there, then regenerate here.

The scheduler embeds its whole catalog in a `var BUSINESS = {...}` JSON blob in the page HTML. That is what we parse.

```bash
# 1. Pull the scheduler HTML
curl -sL -A "Mozilla/5.0" \
  "https://braidsbykristian.as.me/schedule/b36fc416" -o /tmp/acuity.html

# 2. Extract the BUSINESS blob to JSON
python3 - <<'PY'
import re, json
s = open('/tmp/acuity.html', encoding='utf-8', errors='replace').read()
i = s.index('var BUSINESS =') + len('var BUSINESS =')
start = s.index('{', i); depth = 0; instr = False; esc = False
for j in range(start, len(s)):
    c = s[j]
    if instr:
        if esc: esc = False
        elif c == '\\': esc = True
        elif c == '"': instr = False
    else:
        if c == '"': instr = True
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: end = j + 1; break
json.dump(json.loads(s[start:end]), open('/tmp/business.json', 'w'), indent=2)
print('ok')
PY

# 3. Regenerate, then let the tests tell you what moved
pnpm test
```

The generator lives in the repo history and in `docs/` — it maps Acuity categories to slugs, derives sizes from names, and (importantly) derives `hairProvidedBy` **only** from evidence: the presence of Acuity's "Braiding Hair Color" form (ID `2943302`), or an explicit statement in the service description. Anything else becomes `'unspecified'`.

After regenerating, **update the spot-check prices in `tests/unit/content.test.ts`** — they are hard-coded on purpose so a silent catalog drift fails loudly.

## Changing the announcement bar

```ts
// lib/content/site.ts
announcement: {
  enabled: true,                    // false removes it site-wide
  message: '…',
  linkLabel: 'See the special',
  href: '/services/…',
  version: '2026-07-lil-krownz',    // bump to re-show it to people who dismissed it
}
```

Dismissal is stored against `version`, not a boolean — that is why bumping it brings the bar back.
