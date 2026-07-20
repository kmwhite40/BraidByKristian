import { describe, expect, it } from 'vitest'
import {
  formatDuration,
  formatPrice,
  formatPhone,
  telHref,
  durationToIso,
  slugify,
  cn,
} from '@/lib/utils'

describe('formatDuration', () => {
  it('formats whole hours', () => {
    expect(formatDuration(360)).toBe('6 hr')
    expect(formatDuration(540)).toBe('9 hr')
  })
  it('formats hours and minutes', () => {
    expect(formatDuration(570)).toBe('9 hr 30 min')
    expect(formatDuration(210)).toBe('3 hr 30 min')
  })
  it('formats sub-hour durations', () => {
    expect(formatDuration(45)).toBe('45 min')
  })
})

describe('durationToIso', () => {
  it('emits schema.org durations', () => {
    expect(durationToIso(360)).toBe('PT6H')
    expect(durationToIso(570)).toBe('PT9H30M')
    expect(durationToIso(45)).toBe('PT45M')
  })
})

describe('formatPrice', () => {
  it('formats whole dollars', () => {
    expect(formatPrice(155)).toBe('$155')
    expect(formatPrice(75)).toBe('$75')
  })
  it('adds a thousands separator', () => {
    expect(formatPrice(1200)).toBe('$1,200')
  })
})

describe('formatPhone / telHref', () => {
  it('formats a 10-digit number', () => {
    expect(formatPhone('4696531923')).toBe('(469) 653-1923')
  })
  it('strips a leading country code', () => {
    expect(formatPhone('14696531923')).toBe('(469) 653-1923')
  })
  it('returns the input unchanged when it is not 10 digits', () => {
    expect(formatPhone('123')).toBe('123')
  })
  it('builds a dialable href', () => {
    expect(telHref('4696531923')).toBe('tel:+14696531923')
  })
})

describe('slugify', () => {
  it('handles the catalog’s real edge cases', () => {
    expect(slugify('Touch Up’s & Removal')).toBe('touch-ups-and-removal')
    expect(slugify('4+ Straight Back Braids')).toBe('4-plus-straight-back-braids')
    expect(slugify('Small/Medium/Large Knotless Braids ')).toBe(
      'small-medium-large-knotless-braids',
    )
    expect(slugify('Small–Medium Soft Locs')).toBe('small-medium-soft-locs')
  })
})

describe('cn', () => {
  it('lets a later tailwind class win', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
  it('drops falsey values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c')
  })
})
