import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getNextOpening } from '@/lib/booking/availability'

/**
 * The governing property: this feature may never state a time Acuity has not
 * given us. Every failure mode below must produce `null`, because the component
 * renders nothing on `null` — and rendering nothing is always safe, whereas a
 * wrong "next opening" is a promise the calendar never made.
 */
const ENV = { ...process.env }

beforeEach(() => {
  process.env.ACUITY_USER_ID = 'test-user'
  process.env.ACUITY_API_KEY = 'test-key'
})

afterEach(() => {
  process.env = { ...ENV }
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function mockFetch(handler: (url: string) => unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      const body = handler(String(url))
      if (body === undefined) return { ok: false, status: 500, json: async () => ({}) }
      return { ok: true, status: 200, json: async () => body }
    }),
  )
}

describe('getNextOpening', () => {
  it('returns null with no credentials, without calling Acuity at all', async () => {
    delete process.env.ACUITY_USER_ID
    delete process.env.ACUITY_API_KEY
    const spy = vi.fn()
    vi.stubGlobal('fetch', spy)
    expect(await getNextOpening(75443741)).toBeNull()
    expect(spy, 'must not reach the network without credentials').not.toHaveBeenCalled()
  })

  it('returns the first available time, formatted', async () => {
    mockFetch((url) => {
      if (url.includes('/availability/dates')) return [{ date: '2099-07-23' }]
      if (url.includes('/availability/times'))
        return [{ time: '2099-07-23T09:00:00-0500' }]
      return undefined
    })
    const opening = await getNextOpening(75443741)
    expect(opening).not.toBeNull()
    expect(opening!.iso).toBe('2099-07-23T09:00:00-0500')
    expect(opening!.label).toMatch(/Jul/)
  })

  it('returns null when Acuity errors', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503, json: async () => ({}) })))
    expect(await getNextOpening(75443741)).toBeNull()
  })

  it('returns null when the request throws (timeout, DNS, abort)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('timeout') }))
    expect(await getNextOpening(75443741)).toBeNull()
  })

  it('returns null when nothing is free', async () => {
    mockFetch((url) => (url.includes('/availability') ? [] : undefined))
    expect(await getNextOpening(75443741)).toBeNull()
  })

  it('returns null on a malformed payload rather than rendering junk', async () => {
    mockFetch((url) => {
      if (url.includes('/availability/dates')) return [{ notADate: true }]
      return []
    })
    expect(await getNextOpening(75443741)).toBeNull()
  })

  it('returns null when the timestamp is unparseable', async () => {
    mockFetch((url) => {
      if (url.includes('/availability/dates')) return [{ date: '2099-07-23' }]
      if (url.includes('/availability/times')) return [{ time: 'not-a-timestamp' }]
      return undefined
    })
    expect(await getNextOpening(75443741)).toBeNull()
  })

  it('rejects an invalid appointmentType without calling Acuity', async () => {
    const spy = vi.fn()
    vi.stubGlobal('fetch', spy)
    expect(await getNextOpening(0)).toBeNull()
    expect(await getNextOpening(-1)).toBeNull()
    expect(spy).not.toHaveBeenCalled()
  })

  it('sends Basic auth and never leaks the key into the URL', async () => {
    const calls: [string, RequestInit][] = []
    vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
      calls.push([String(url), init])
      return { ok: true, status: 200, json: async () => [] }
    }))
    await getNextOpening(75443741)
    expect(calls.length).toBeGreaterThan(0)
    for (const [url, init] of calls) {
      expect(url).not.toContain('test-key')
      const auth = (init.headers as Record<string, string | undefined>).Authorization
      expect(auth, 'Authorization header must be sent').toBeDefined()
      expect(auth).toMatch(/^Basic /)
      expect(Buffer.from(auth!.replace('Basic ', ''), 'base64').toString()).toBe(
        'test-user:test-key',
      )
    }
  })
})
