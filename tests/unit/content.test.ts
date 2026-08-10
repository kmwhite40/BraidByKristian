import { describe, expect, it } from 'vitest'
import {
  addons,
  categories,
  services,
  catalogStats,
  getService,
  hairArrangement,
  getFeaturedServices,
  getRelatedServices,
  getServicePhotos,
  getServicesByCategory,
  categoryFromPrice,
  site,
  policies,
  preparation,
  faqs,
  testimonials,
  galleryItems,
  about,
} from '@/lib/content'

/**
 * These tests exist to stop the site telling a client something untrue.
 *
 * The catalog is generated from Kristian's live Acuity scheduler. If it is ever
 * regenerated, or someone hand-edits a price, these fail loudly.
 */

describe('catalog integrity', () => {
  it('holds the full catalog extracted from Acuity', () => {
    expect(services).toHaveLength(46)
    expect(categories).toHaveLength(11)
    expect(addons).toHaveLength(7)
  })

  it('has a unique slug per service', () => {
    const slugs = services.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has a unique Acuity appointmentType id per service', () => {
    const ids = services.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toBeGreaterThan(0)
  })

  it('points every service at a real category', () => {
    const known = new Set(categories.map((c) => c.slug))
    for (const s of services) expect(known.has(s.category)).toBe(true)
  })

  it('points every add-on reference at a real add-on', () => {
    const known = new Set(addons.map((a) => a.id))
    for (const s of services) {
      for (const id of s.addonIds) expect(known.has(id)).toBe(true)
    }
  })

  it('gives every category at least one service', () => {
    for (const c of categories) {
      expect(getServicesByCategory(c.slug).length).toBeGreaterThan(0)
    }
  })

  it('uses url-safe slugs', () => {
    for (const s of services) expect(s.slug).toMatch(/^[a-z0-9-]+$/)
  })
})

describe('pricing truthfulness', () => {
  it('never prices a fixed service at zero', () => {
    for (const s of services.filter((x) => x.priceMode === 'fixed')) {
      expect(s.price).toBeGreaterThan(0)
    }
  })

  it('marks the only zero-priced service as quoted, not free', () => {
    const zero = services.filter((s) => s.price === 0)
    expect(zero).toHaveLength(1)
    expect(zero[0]!.slug).toBe('freestyle')
    expect(zero[0]!.priceMode).toBe('quoted')
  })

  it('matches known prices from the live scheduler exactly', () => {
    // Spot-checks transcribed from the Acuity BUSINESS payload.
    const expected: Record<string, number> = {
      'medium-knotless': 180,
      'small-knotless': 190,
      'large-knotless': 170,
      'extra-small-bohemian-knotless': 275,
      'extra-small-bora-bora': 300,
      'natural-hair-2-to-4-straight-back-cornrow': 125,
      'braid-removal': 125,
      'loc-re-twist': 125,
      'small-senegalese-twist': 190,
      'medium-senegalese-twist': 180,
      'small-mini-twist': 180,
      'medium-mini-twist': 170,
      'small-island-twist': 190,
      'medium-island-twist': 180,
    }
    for (const [slug, price] of Object.entries(expected)) {
      expect(getService(slug)?.price, slug).toBe(price)
    }
  })

  it('reports the true lowest price', () => {
    expect(catalogStats.lowestPrice).toBe(100)
  })

  it('never quotes a category price below its cheapest service', () => {
    for (const c of categories) {
      const from = categoryFromPrice(c.slug)
      if (from === null) continue
      const cheapest = Math.min(
        ...getServicesByCategory(c.slug)
          .filter((s) => s.priceMode === 'fixed')
          .map((s) => s.price),
      )
      expect(from).toBe(cheapest)
    }
  })

  it('keeps every price above the deposit, so the balance is never negative', () => {
    for (const s of services.filter((x) => x.priceMode === 'fixed')) {
      expect(s.price, s.slug).toBeGreaterThan(site.deposit.amount)
    }
  })
})

describe('durations', () => {
  it('gives every service a positive, whole-minute duration', () => {
    for (const s of services) {
      expect(s.durationMinutes).toBeGreaterThan(0)
      expect(Number.isInteger(s.durationMinutes)).toBe(true)
    }
  })

  it('matches known durations from the live scheduler', () => {
    expect(getService('medium-knotless')?.durationMinutes).toBe(300)
    expect(getService('extra-small-bohemian-knotless')?.durationMinutes).toBe(540)
    expect(getService('extra-small-bora-bora')?.durationMinutes).toBe(570)
    expect(getService('braid-removal')?.durationMinutes).toBe(210)
  })
})

describe('hair claims are evidence-backed', () => {
  it('never asserts who brings the hair without evidence', () => {
    for (const s of services) {
      expect(s.hairEvidence.length, s.slug).toBeGreaterThan(0)
    }
  })

  it('only claims "client brings hair" where the scheduler proves it', () => {
    // Proof is either the Braiding Hair Color form, or an explicit statement in
    // the service description.
    for (const s of services.filter((x) => x.hairProvidedBy === 'client')) {
      const explicit = s.notes.join(' ').toLowerCase()
      const proven =
        s.requiresHairColorForm ||
        explicit.includes('not included') ||
        explicit.includes('hair is not included')
      expect(proven, `${s.slug} claims client-provided hair without proof`).toBe(true)
    }
  })

  it('treats Natural Hair as no-added-hair', () => {
    for (const s of getServicesByCategory('natural-hair')) {
      expect(s.hairProvidedBy).toBe('not-applicable')
    }
  })

  it('leaves unproven services unspecified rather than guessing', () => {
    const unspecified = services.filter((s) => s.hairProvidedBy === 'unspecified')
    for (const s of unspecified) {
      expect(s.requiresHairColorForm).toBe(false)
      expect(s.hairEvidence).toMatch(/not stated/i)
    }
  })
})

describe('featured + related', () => {
  it('resolves every featured slug to a real service', () => {
    expect(() => getFeaturedServices()).not.toThrow()
    expect(getFeaturedServices()).toHaveLength(4)
  })

  it('never recommends a service as related to itself', () => {
    for (const s of services) {
      for (const r of getRelatedServices(s)) expect(r.slug).not.toBe(s.slug)
    }
  })

  it('returns related services for every service', () => {
    for (const s of services) {
      expect(getRelatedServices(s).length, s.slug).toBeGreaterThan(0)
    }
  })
})

describe('business facts match the booking site', () => {
  it('states the deposit Kristian actually charges', () => {
    expect(site.deposit.amount).toBe(25)
    expect(site.deposit.refundable).toBe(false)
    expect(site.deposit.methods).toEqual(['Cash App', 'Zelle'])
  })

  it('states the real fees and windows', () => {
    expect(site.fees.late).toBe(40)
    expect(site.fees.washAndBlowDry).toBe(45)
    expect(site.gracePeriodMinutes).toBe(15)
    expect(site.cancellationNoticeHours).toBe(24)
  })

  it('uses the verified phone number and location', () => {
    expect(site.contact.phone).toBe('4696531923')
    expect(site.contact.address.city).toBe('Garland')
    expect(site.contact.address.region).toBe('TX')
    expect(site.contact.address.postalCode).toBe('75044')
  })

  it('never says Fate — the location is Garland, confirmed by Kristian', () => {
    // Her older published bio names Fate, TX. It is out of date. This sweeps
    // every string the site can render so a future edit cannot quietly
    // reintroduce it.
    const surfaces = [
      JSON.stringify(site),
      JSON.stringify(about),
      JSON.stringify(policies),
      JSON.stringify(preparation),
      JSON.stringify(faqs),
      JSON.stringify(testimonials),
      JSON.stringify(galleryItems),
      JSON.stringify(services),
    ].join(' ')

    expect(surfaces).not.toMatch(/\bFate\b/i)
    expect(surfaces).toMatch(/Garland/)
  })

  it('leaves unverified contact channels null rather than inventing them', () => {
    // No email is published. If it ever becomes non-null, a real value must have
    // been supplied.
    expect(site.contact.email).toBeNull()
  })

  it('has the TikTok the business supplied', () => {
    // Provided directly by Kristian on 2026-07-20.
    expect(site.social.tiktok?.handle).toBe('@braidsbykristian')
    expect(site.social.tiktok?.url).toContain('tiktok.com/@braidsbykristian')
  })

  it('covers all seven days of opening hours', () => {
    const days = site.hours.flatMap((h) => h.days)
    expect(new Set(days).size).toBe(7)
  })
})

describe('policies + preparation', () => {
  it('keeps Kristian’s verbatim wording alongside every policy', () => {
    for (const p of policies) {
      expect(p.verbatim.length, p.id).toBeGreaterThan(20)
      expect(p.body.length).toBeGreaterThan(0)
    }
  })

  it('marks exactly the two hard requirements as required', () => {
    const required = preparation.filter((p) => p.required).map((p) => p.id)
    expect(required).toEqual(['clean-dry-hair', 'avoid-heavy-products'])
  })
})

describe('testimonials are real', () => {
  it('keeps the four genuine reviews', () => {
    expect(testimonials).toHaveLength(4)
  })

  it('excludes the unedited Canva template placeholder', () => {
    // The booking-site flyer includes a fifth tile reading "This is where you
    // can type in your awesome client reviews" from "The Carson's". It is a
    // template default, not a review, and must never ship.
    for (const t of testimonials) {
      expect(t.quote).not.toMatch(/this is where you can type/i)
      expect(t.author).not.toMatch(/carson/i)
    }
  })

  it('never invents which service a reviewer received', () => {
    for (const t of testimonials) expect(t.service).toBeNull()
  })
})

describe('gallery', () => {
  it('gives every image real dimensions and descriptive alt text', () => {
    for (const g of galleryItems) {
      expect(g.width).toBeGreaterThan(0)
      expect(g.height).toBeGreaterThan(0)
      expect(g.alt.length).toBeGreaterThan(20)
      expect(g.src.startsWith('/images/')).toBe(true)
    }
  })

  it('ships no unreplaced placeholders', () => {
    for (const g of galleryItems) expect(g.isPlaceholder).toBe(false)
  })
})

describe('faqs', () => {
  it('sources every answer', () => {
    for (const f of faqs) {
      expect(f.answer.length, f.question).toBeGreaterThan(30)
      expect(f.source).toBeTruthy()
    }
  })

  it('asks each question only once', () => {
    const qs = faqs.map((f) => f.question)
    expect(new Set(qs).size).toBe(qs.length)
  })
})

describe('service photographs', () => {
  it('marks a photo tagged with the service slug as an exact match', () => {
    // knotless-01 carries serviceSlug 'medium-knotless'.
    const service = getService('medium-knotless')!
    const photos = getServicePhotos(service)
    const exact = photos.filter((p) => p.exact)
    expect(exact.length).toBeGreaterThan(0)
    expect(exact.every((p) => p.serviceSlug === 'medium-knotless')).toBe(true)
  })

  it('puts exact matches before same-category ones', () => {
    for (const service of services) {
      const flags = getServicePhotos(service, 10).map((p) => p.exact)
      const firstInexact = flags.indexOf(false)
      if (firstInexact === -1) continue
      expect(
        flags.slice(firstInexact).every((f) => f === false),
        `${service.slug}: an exact match appears after a family one`,
      ).toBe(true)
    }
  })

  /**
   * The honesty rule, enforced. A photo may only be captioned as *this* style
   * when it is tagged with this exact slug; anything selected merely because it
   * shares a category has to be flagged so the UI labels it as the family. If
   * this ever inverts, a size-M photo starts silently heading a size-S page.
   */
  it('never marks a photo exact unless its slug matches the service', () => {
    for (const service of services) {
      for (const photo of getServicePhotos(service, 10)) {
        if (photo.exact) {
          expect(photo.serviceSlug, `${service.slug} / ${photo.id}`).toBe(service.slug)
        } else {
          expect(photo.serviceSlug, `${service.slug} / ${photo.id}`).not.toBe(service.slug)
        }
      }
    }
  })

  it('returns nothing rather than an unrelated photo', () => {
    for (const service of services) {
      for (const photo of getServicePhotos(service, 10)) {
        const related = photo.serviceSlug === service.slug || photo.category === service.category
        expect(related, `${service.slug} got unrelated photo ${photo.id}`).toBe(true)
      }
    }
  })

  it('respects the limit', () => {
    for (const service of services) {
      expect(getServicePhotos(service, 2).length).toBeLessThanOrEqual(2)
    }
  })
})

/**
 * Kristian now supplies the braiding hair (`site.stylistProvidesHair`), but a
 * few styles on the live scheduler still say the client brings bundles. A
 * blanket "hair provided" on those would send someone to the chair empty
 * handed, so the global switch must never mask an explicit exclusion.
 */
describe('braiding hair exceptions', () => {
  const excluded = ['small-miracle-knot', 'medium-miracle-knot', 'fulani-quickweave']

  it('flags every style whose Acuity description excludes hair or bundles', () => {
    for (const slug of excluded) {
      expect(getService(slug)?.hairExplicitlyExcluded, slug).toBe(true)
    }
  })

  it('flags nothing else — the flag tracks the scheduler, not a guess', () => {
    const flagged = services.filter((s) => s.hairExplicitlyExcluded).map((s) => s.slug)
    expect(flagged.sort()).toEqual([...excluded].sort())
  })

  it('keeps the flag consistent with the notes it was derived from', () => {
    for (const s of services) {
      const saysExcluded = s.notes.some((n) => /\b(hair|bundles) (is|are) not included\b/i.test(n))
      expect(s.hairExplicitlyExcluded, s.slug).toBe(saysExcluded)
    }
  })

  it('tells the client to bring hair for an excluded style, despite the global switch', () => {
    expect(site.stylistProvidesHair).toBe(true)
    expect(hairArrangement(getService('medium-miracle-knot')!)).toBe('client-brings')
  })

  it('still reports hair as provided for an ordinary added-hair style', () => {
    expect(hairArrangement(getService('small-knotless')!)).toBe('provided')
  })

  it('reports no added hair for a natural-hair style', () => {
    expect(hairArrangement(getService('natural-hair-box-braids')!)).toBe('none')
  })

  it('stays silent when the scheduler never said', () => {
    const unknown = services.find((s) => s.hairProvidedBy === 'unspecified')!
    expect(hairArrangement(unknown)).toBe('unknown')
  })

  it('excludes the exception styles from the "hair provided" count', () => {
    expect(catalogStats.stylistProvidesHairCount).toBe(
      services.filter((s) => hairArrangement(s) === 'provided').length,
    )
    expect(catalogStats.stylistProvidesHairCount).toBeLessThan(
      services.filter((s) => s.hairProvidedBy === 'client').length,
    )
  })
})
