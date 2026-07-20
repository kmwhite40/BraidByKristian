import { rawAddons, rawCategories, rawServices } from './services.data'
import { galleryItems } from './gallery'
import {
  rawAddonSchema,
  rawCategorySchema,
  rawServiceSchema,
  type CategorySlug,
  type GalleryItem,
  type RawAddon,
  type RawService,
} from './schema'

/* ---------------------------------------------------------------------------
   Validate at module load. A bad regeneration of the catalog fails the build
   rather than shipping a wrong price.
--------------------------------------------------------------------------- */
export const categories = rawCategories.map((c) => rawCategorySchema.parse(c))
export const addons = rawAddons.map((a) => rawAddonSchema.parse(a))
export const services = rawServices.map((s) => rawServiceSchema.parse(s))

/* Referential integrity — every service points at a real category and real
   add-ons, and no two services share a slug. */
{
  const catSlugs = new Set(categories.map((c) => c.slug))
  const addonIds = new Set(addons.map((a) => a.id))
  const seen = new Set<string>()
  for (const s of services) {
    if (!catSlugs.has(s.category)) {
      throw new Error(`Service "${s.slug}" references unknown category "${s.category}"`)
    }
    for (const id of s.addonIds) {
      if (!addonIds.has(id)) {
        throw new Error(`Service "${s.slug}" references unknown add-on ${id}`)
      }
    }
    if (seen.has(s.slug)) throw new Error(`Duplicate service slug "${s.slug}"`)
    seen.add(s.slug)
  }
}

/* ---------------------------------------------------------------------------
   Derived views
--------------------------------------------------------------------------- */

export type Service = RawService
export type Addon = RawAddon

const byCategory = new Map<CategorySlug, Service[]>()
for (const c of categories) byCategory.set(c.slug, [])
for (const s of services) byCategory.get(s.category)!.push(s)

export function getServicesByCategory(slug: CategorySlug): Service[] {
  return byCategory.get(slug) ?? []
}

export function getCategory(slug: CategorySlug) {
  return categories.find((c) => c.slug === slug)
}

export function getCategoryName(slug: CategorySlug): string {
  return getCategory(slug)?.name ?? slug
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export function getAddons(ids: readonly number[]): Addon[] {
  return ids
    .map((id) => addons.find((a) => a.id === id))
    .filter((a): a is Addon => Boolean(a))
}

/** Cheapest fixed price in a category — powers "from $X" labels. */
export function categoryFromPrice(slug: CategorySlug): number | null {
  const priced = getServicesByCategory(slug).filter((s) => s.priceMode === 'fixed')
  if (priced.length === 0) return null
  return Math.min(...priced.map((s) => s.price))
}

/** Related services: same category first, then nearest price elsewhere. */
export function getRelatedServices(service: Service, limit = 3): Service[] {
  const sameCat = getServicesByCategory(service.category).filter(
    (s) => s.slug !== service.slug,
  )
  if (sameCat.length >= limit) {
    return sameCat
      .slice()
      .sort(
        (a, b) =>
          Math.abs(a.price - service.price) - Math.abs(b.price - service.price),
      )
      .slice(0, limit)
  }
  const others = services
    .filter((s) => s.slug !== service.slug && s.category !== service.category)
    .sort(
      (a, b) => Math.abs(a.price - service.price) - Math.abs(b.price - service.price),
    )
  return [...sameCat, ...others].slice(0, limit)
}

/**
 * A gallery photograph selected for a service page, carrying how sure we are
 * that it depicts *that* service.
 *
 * The distinction is the whole point. A photo tagged with this exact slug is
 * this style. A photo that only shares the category shows the family — the
 * look, not necessarily the size or length someone is about to book. Captioning
 * the second as though it were the first is precisely the kind of small,
 * plausible overclaim this project does not make, so the flag travels with the
 * photo and the UI is obliged to say which it is.
 */
export type ServicePhoto = GalleryItem & { exact: boolean }

/**
 * Photographs to show on a service page: exact matches first, then others from
 * the same category.
 *
 * Returns `[]` for most services today — only 6 photos exist and 47 services do
 * — and the section renders nothing rather than a placeholder. As photos are
 * tagged in `gallery.ts` they appear here automatically; there is no per-service
 * wiring to maintain.
 */
export function getServicePhotos(service: Service, limit = 3): ServicePhoto[] {
  const exact = galleryItems
    .filter((g) => g.serviceSlug === service.slug)
    .map((g) => ({ ...g, exact: true }))

  const family = galleryItems
    .filter((g) => g.category === service.category && g.serviceSlug !== service.slug)
    .map((g) => ({ ...g, exact: false }))

  return [...exact, ...family].slice(0, limit)
}

/**
 * Homepage "Featured styles". Edit this list to change what appears — the
 * homepage renders whatever these slugs resolve to, in this order. Unknown
 * slugs throw at build time rather than rendering an empty card.
 */
export const featuredServiceSlugs = [
  'medium-knotless',
  'medium-bohemian-knotless',
  'small-island-twist',
  'small-medium-soft-locs',
] as const

export function getFeaturedServices(): Service[] {
  return featuredServiceSlugs.map((slug) => {
    const s = getService(slug)
    if (!s) throw new Error(`featuredServiceSlugs: no service with slug "${slug}"`)
    return s
  })
}

/* ---------------------------------------------------------------------------
   Catalog-wide facts. Computed, never hand-typed, so they cannot drift.
--------------------------------------------------------------------------- */
export const catalogStats = {
  serviceCount: services.length,
  categoryCount: categories.length,
  addonCount: addons.length,
  lowestPrice: Math.min(
    ...services.filter((s) => s.priceMode === 'fixed').map((s) => s.price),
  ),
  /** Services where the client supplies the braiding hair (proven, not guessed). */
  clientProvidesHairCount: services.filter((s) => s.hairProvidedBy === 'client').length,
} as const

export const SIZE_LABELS: Record<string, string> = {
  'extra-small': 'Extra small',
  small: 'Small',
  'small-medium': 'Small–Medium',
  medium: 'Medium',
  large: 'Large',
  choice: 'Your choice of size',
}

export { site, booking } from './site'
export { policies, preparation } from './policies'
export { faqs, faqCategories } from './faq'
export { testimonials } from './testimonials'
export { galleryItems, galleryCategories } from './gallery'
export { about } from './about'
export type { CategorySlug, Size, HairProvidedBy } from './schema'
