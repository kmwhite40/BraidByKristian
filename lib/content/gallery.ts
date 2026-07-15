import { galleryItemSchema, type GalleryItem } from './schema'

/**
 * THE GALLERY IS DELIBERATELY SMALL.
 *
 * These are the only photographs of Kristian's work that exist in a source we
 * can verify: they are cropped from the brand photography she publishes on her
 * own Acuity booking site. No stock imagery and no competitor photography is
 * used, and none will be — a braiding gallery that shows someone else's work is
 * worse than a short one.
 *
 * `category` and `serviceSlug` are null on every entry because the source does
 * not say which service each client received. The filter UI only offers
 * categories that actually appear here, so it stays honest as photos are added.
 *
 * ADDING PHOTOS
 *   1. Drop the file in /public/images/gallery/
 *   2. Append an entry below with real width/height (the build validates them)
 *   3. Set `category` + `serviceSlug` to wire the image to a bookable service
 *      and turn on its filter chip
 *   4. Set isPlaceholder: false
 * See /public/placeholders/README.md for the full workflow and sizing guidance.
 */
const data: GalleryItem[] = [
  {
    id: 'studio-01',
    src: '/images/studio-kristian-and-clients.jpg',
    alt: 'Kristian seated with two clients, all wearing denim. Both clients wear long braided styles with curled ends — one dark, one honey-toned.',
    width: 780,
    height: 892,
    caption: 'In the suite',
    category: null,
    serviceSlug: null,
    isPlaceholder: false,
  },
  {
    id: 'client-01',
    src: '/images/client-braided-style-01.jpg',
    alt: 'A client wearing a short braided style with curled ends, styled off the face.',
    width: 416,
    height: 886,
    caption: 'Braided style with curled ends',
    category: null,
    serviceSlug: null,
    isPlaceholder: false,
  },
  {
    id: 'client-02',
    src: '/images/client-braided-style-02.jpg',
    alt: 'A client wearing her hair pulled back into a braided style with curls left out at the front.',
    width: 416,
    height: 886,
    caption: 'Pulled back, curls out',
    category: null,
    serviceSlug: null,
    isPlaceholder: false,
  },
  {
    id: 'kristian-01',
    src: '/images/kristian-portrait.jpg',
    alt: 'Portrait of Kristian, the braider behind Braids by Kristian, smiling in a pink jacket.',
    width: 298,
    height: 504,
    caption: 'Kristian',
    category: null,
    serviceSlug: null,
    isPlaceholder: false,
  },
]

export const galleryItems: GalleryItem[] = data.map((g) => galleryItemSchema.parse(g))

/** Only offers filters for categories that actually have photographs. */
export const galleryCategories = Array.from(
  new Set(galleryItems.map((g) => g.category).filter((c): c is NonNullable<typeof c> => c !== null)),
)

export const hasPlaceholders = galleryItems.some((g) => g.isPlaceholder)
