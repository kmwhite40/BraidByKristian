import { describe, expect, it } from 'vitest'
import { recommend, questions, type Answers } from '@/lib/style-finder'
import { services } from '@/lib/content'

const base: Answers = {
  age: 'adult',
  look: 'unsure',
  size: 'unsure',
  sitting: 'any',
  hair: 'unsure',
}

describe('style finder', () => {
  it('asks five questions', () => {
    expect(questions).toHaveLength(5)
    for (const q of questions) expect(q.options.length).toBeGreaterThan(1)
  })

  it('only ever recommends services that exist in the real catalog', () => {
    const known = new Set(services.map((s) => s.slug))
    const combos: Answers[] = [
      base,
      { ...base, look: 'knotless', size: 'small' },
      { ...base, look: 'boho', sitting: 'medium' },
      { ...base, look: 'natural', hair: 'own-hair' },
      { ...base, age: 'child' },
      { ...base, look: 'locs', size: 'large' },
      { ...base, look: 'twists', size: 'medium', sitting: 'short' },
      { ...base, look: 'cornrows', sitting: 'short', hair: 'bring' },
    ]
    for (const c of combos) {
      for (const r of recommend(c)) expect(known.has(r.service.slug)).toBe(true)
    }
  })

  it('shows a child only Lil Krownz styles', () => {
    const results = recommend({ ...base, age: 'child' })
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) expect(r.service.category).toBe('lil-krownz')
  })

  it('never shows an adult the children’s menu', () => {
    for (const look of ['knotless', 'boho', 'twists', 'unsure'] as const) {
      for (const r of recommend({ ...base, look })) {
        expect(r.service.category).not.toBe('lil-krownz')
      }
    }
  })

  it('never leads with a touch-up when someone is choosing a new style', () => {
    for (const r of recommend(base)) {
      expect(r.service.category).not.toBe('touch-ups')
    }
  })

  it('respects a request for no added hair', () => {
    const results = recommend({ ...base, hair: 'own-hair', look: 'natural' })
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) expect(r.service.hairProvidedBy).not.toBe('client')
  })

  it('matches the look that was asked for', () => {
    const results = recommend({ ...base, look: 'locs' })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]!.service.category).toBe('locs')
  })

  it('prefers styles that fit a short sitting', () => {
    const results = recommend({ ...base, sitting: 'short' })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]!.service.durationMinutes).toBeLessThanOrEqual(240)
  })

  it('returns at most six suggestions', () => {
    expect(recommend(base).length).toBeLessThanOrEqual(6)
  })

  it('explains why each style was suggested', () => {
    for (const r of recommend({ ...base, look: 'knotless', size: 'medium' })) {
      expect(r.why.length).toBeGreaterThan(0)
    }
  })
})
