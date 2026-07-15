import { galleryItemSchema, type GalleryItem } from './schema'

/**
 * Kristian's brand photography, supplied as the original full-resolution files.
 *
 * These replaced an earlier set cropped out of the flyers on her booking page —
 * that source paints black mask bars across the photographs, so the crops could
 * only ever show the middle of each frame. These are the real thing.
 *
 * PHOTO CREDIT / TO DO BEFORE LAUNCH: every file carries a
 * "K.Nett 2025 Images" watermark. Clean, unwatermarked web exports should
 * replace these — a watermark on the hero reads as a proof copy and undercuts
 * the brand. The watermark is the photographer's copyright mark and must not be
 * edited out; ask K.Nett for licensed web files (and consider a photo credit in
 * the footer if they would like one).
 *
 * `category` and `serviceSlug` are set only where the style in the photograph is
 * unambiguous. The filter chips are derived from whatever is set here, so they
 * stay honest as photos are added.
 *
 * ADDING PHOTOS
 *   1. Drop the file in /public/images/gallery/
 *   2. Append an entry below with its real width/height (the build validates them)
 *   3. Set `category` + `serviceSlug` to wire it to a bookable service
 * See /public/placeholders/README.md and docs/IMAGES.md.
 */
const data: GalleryItem[] = [
  {
    id: 'studio-01',
    src: '/images/studio-kristian-and-clients.jpg',
    alt: 'Kristian seated on a cream couch with four clients around her, everyone in denim. The styles range from long knotless braids to bohemian braids with curls left out and a braided updo.',
    width: 800,
    height: 538,
    caption: 'In the suite',
    category: null,
    serviceSlug: null,
    isPlaceholder: false,
  },
  {
    id: 'bohemian-01',
    src: '/images/gallery/bohemian-curls-out.jpg',
    alt: 'A client with long bohemian braids in a honey-brown tone, curls left loose through the length, with neat parting visible at the crown.',
    width: 533,
    height: 799,
    caption: 'Bohemian, curls left out',
    category: 'bohemian',
    serviceSlug: 'medium-bohemian-knotless',
    isPlaceholder: false,
  },
  {
    id: 'knotless-01',
    src: '/images/gallery/knotless-long.jpg',
    alt: 'A client wearing long black knotless braids past the shoulder, with clean parting across the crown.',
    width: 637,
    height: 800,
    caption: 'Knotless, long',
    category: 'knotless',
    serviceSlug: 'medium-knotless',
    isPlaceholder: false,
  },
  {
    id: 'natural-01',
    src: '/images/gallery/natural-updo.jpg',
    alt: 'A client wearing her natural hair in a braided updo, flat braids across the front gathered into a curly crown, with curls left loose at the temples.',
    width: 1320,
    height: 1652,
    caption: 'Natural braided updo',
    category: 'natural-hair',
    serviceSlug: null,
    isPlaceholder: false,
  },
  {
    id: 'twists-01',
    src: '/images/gallery/twists-short.jpg',
    alt: 'A client wearing a short twisted style off the face, with a blow dryer resting over her shoulder.',
    width: 533,
    height: 799,
    caption: 'Short twists',
    category: 'twists',
    serviceSlug: null,
    isPlaceholder: false,
  },
  {
    id: 'kristian-01',
    src: '/images/kristian-portrait.jpg',
    alt: 'Portrait of Kristian, the braider behind Braids by Kristian, smiling in a pink jacket with feathered cuffs.',
    width: 569,
    height: 799,
    caption: 'Kristian',
    category: null,
    serviceSlug: null,
    isPlaceholder: false,
  },
]

export const galleryItems: GalleryItem[] = data.map((g) => galleryItemSchema.parse(g))

/** Only offers filters for categories that actually have photographs. */
export const galleryCategories = Array.from(
  new Set(
    galleryItems.map((g) => g.category).filter((c): c is NonNullable<typeof c> => c !== null),
  ),
)

export const hasPlaceholders = galleryItems.some((g) => g.isPlaceholder)
