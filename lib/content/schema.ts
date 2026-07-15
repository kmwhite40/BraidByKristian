import { z } from 'zod'

/**
 * Every piece of business content on this site is validated against these
 * schemas at module load. If the catalog is ever regenerated from Acuity and a
 * field drifts, the build fails loudly instead of shipping a wrong price.
 */

export const categorySlugSchema = z.enum([
  'knotless',
  'bohemian',
  'twists',
  'bora-bora',
  'fulani',
  'cornrows',
  'locs',
  'miracle-knot',
  'natural-hair',
  'lil-krownz',
  'touch-ups',
])
export type CategorySlug = z.infer<typeof categorySlugSchema>

export const sizeSchema = z.enum([
  'extra-small',
  'small',
  'small-medium',
  'medium',
  'large',
  'choice',
])
export type Size = z.infer<typeof sizeSchema>

/**
 * Who supplies the braiding hair.
 *  - `client`         — proven by the scheduler (see `hairEvidence`)
 *  - `not-applicable` — style uses no added hair
 *  - `unspecified`    — the scheduler does not say. The UI must stay silent
 *                       rather than guess.
 */
export const hairProvidedBySchema = z.enum(['client', 'not-applicable', 'unspecified'])
export type HairProvidedBy = z.infer<typeof hairProvidedBySchema>

export const rawCategorySchema = z.object({
  slug: categorySlugSchema,
  name: z.string().min(1),
  /** The exact category label in Acuity — kept so the two can be reconciled. */
  acuityName: z.string().min(1),
  order: z.number().int().positive(),
})
export type RawCategory = z.infer<typeof rawCategorySchema>

export const rawAddonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  durationMinutes: z.number().int().nonnegative(),
})
export type RawAddon = z.infer<typeof rawAddonSchema>

export const rawServiceSchema = z.object({
  /** Acuity appointmentType ID — the deep-link key. */
  id: z.number().int().positive(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  category: categorySlugSchema,
  price: z.number().int().nonnegative(),
  priceMode: z.enum(['fixed', 'quoted']),
  durationMinutes: z.number().int().positive(),
  size: sizeSchema.nullable(),
  /** Verbatim note lines from the Acuity description. */
  notes: z.array(z.string()),
  hairProvidedBy: hairProvidedBySchema,
  hairEvidence: z.string().min(1),
  addonIds: z.array(z.number().int().positive()),
  requiresHairColorForm: z.boolean(),
  calendar: z.string(),
})
export type RawService = z.infer<typeof rawServiceSchema>

export const testimonialSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  /** Only set when the source names the service. Never inferred. */
  service: z.string().nullable(),
  source: z.string().min(1),
})
export type Testimonial = z.infer<typeof testimonialSchema>

export const faqSchema = z.object({
  question: z.string().min(1),
  /** Plain-text answer. Rendered as-is; also feeds FAQPage structured data. */
  answer: z.string().min(1),
  /** Where this answer came from, so nothing unverifiable ships. */
  source: z.enum(['acuity-policies', 'acuity-catalog', 'acuity-prep', 'derived']),
  category: z.enum(['booking', 'preparation', 'hair', 'appointment', 'policies']),
})
export type Faq = z.infer<typeof faqSchema>

export const galleryItemSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: z.string().min(1),
  category: categorySlugSchema.nullable(),
  /** Links the image to a bookable service. */
  serviceSlug: z.string().nullable(),
  /** True until a real photo of Kristian's work replaces it. */
  isPlaceholder: z.boolean(),
})
export type GalleryItem = z.infer<typeof galleryItemSchema>

export const businessHoursSchema = z.object({
  label: z.string().min(1),
  /** Schema.org dayOfWeek values covered by this row. */
  days: z.array(
    z.enum([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]),
  ),
  opens: z.string().regex(/^\d{2}:\d{2}$/),
  closes: z.string().regex(/^\d{2}:\d{2}$/),
  display: z.string().min(1),
})
export type BusinessHours = z.infer<typeof businessHoursSchema>
