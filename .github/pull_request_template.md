## What changed

<!-- One or two sentences. -->

## Why

<!-- Link the issue, or say what prompted it. -->

## Business facts

- [ ] No new claim about the business that Kristian has not published
      (no years of experience, client counts, awards, ratings)
- [ ] If prices/durations/policies changed, they match the Acuity scheduler
- [ ] If the catalog was regenerated, the spot-check prices in
      `tests/unit/content.test.ts` were updated
- [ ] Any new placeholder is tagged `[NEEDS-INPUT]` in `lib/content/site.ts`

## Checks

- [ ] `pnpm verify` passes
- [ ] Checked at 360px and 1440px
- [ ] Keyboard-operable; focus is visible
- [ ] New images have real dimensions and descriptive alt text
- [ ] No new third-party origin (if there is one, the CSP in `next.config.ts`
      was updated and the reason noted below)

## Screenshots

<!-- Before / after for anything visual. -->
