import { describe, expect, it } from 'vitest'
import {
  bookingUrl,
  serviceBookingUrl,
  embedUrl,
  hasAcuityApiCredentials,
} from '@/lib/booking/acuity'
import { services, getService } from '@/lib/content'

describe('acuity booking links', () => {
  it('points at Kristian’s real scheduler', () => {
    expect(bookingUrl()).toBe('https://braidsbykristian.as.me/schedule/b36fc416')
  })

  it('deep-links a service by its Acuity appointmentType id', () => {
    const s = getService('medium-knotless')!
    expect(serviceBookingUrl(s.id)).toBe(
      'https://braidsbykristian.as.me/schedule/b36fc416?appointmentType=75443741',
    )
  })

  it('builds a valid, https deep link for every service in the catalog', () => {
    for (const s of services) {
      const url = new URL(serviceBookingUrl(s.id))
      expect(url.protocol).toBe('https:')
      expect(url.hostname).toBe('braidsbykristian.as.me')
      expect(url.searchParams.get('appointmentType')).toBe(String(s.id))
    }
  })

  it('rejects a non-id rather than building a broken link', () => {
    expect(() => serviceBookingUrl(0)).toThrow()
    expect(() => serviceBookingUrl(-1)).toThrow()
    expect(() => serviceBookingUrl(1.5)).toThrow()
    expect(() => serviceBookingUrl(NaN)).toThrow()
  })

  it('builds an embed url on an Acuity host allowed by the CSP', () => {
    const url = new URL(embedUrl())
    expect(url.hostname).toBe('app.acuityscheduling.com')
    expect(url.searchParams.get('owner')).toBe('35089723')
  })

  it('preselects the service inside the embed', () => {
    const url = new URL(embedUrl(75443741))
    expect(url.searchParams.get('appointmentType')).toBe('75443741')
  })

  it('reports no API credentials by default, so no fake availability can render', () => {
    expect(hasAcuityApiCredentials()).toBe(false)
  })
})
