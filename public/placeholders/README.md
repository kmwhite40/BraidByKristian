# Placeholders

**This directory is empty, and that is deliberate.**

No placeholder imagery ships with this site. `tests/unit/content.test.ts` asserts
that every gallery entry has `isPlaceholder: false` — the build fails if one is
left in.

## Why there are no grey boxes

A braiding site is sold on visual proof. A grey box, a stock photo, or a generic
"braid" image would misrepresent Kristian's actual work to the exact audience
most able to spot it. So instead:

- the gallery shows only the four real photographs that exist
- service cards are typographic — they lead with the price, not an empty image well
- the gallery links out to Instagram, where the real portfolio lives

A short honest gallery beats a padded dishonest one.

## If you do need a placeholder

1. Put it here, not in `public/images/`
2. Reference it from `lib/content/gallery.ts` with `isPlaceholder: true`
3. **The test suite will fail.** That is the point — it is a tripwire, not an
   obstacle. Either replace the image before merging, or consciously relax the
   assertion in `tests/unit/content.test.ts` with a note saying why.

## Adding real photos

See [`docs/IMAGES.md`](../../docs/IMAGES.md).
