import { describe, expect, it } from 'vitest'
import { contactSchema } from '@/lib/validation/contact'

const valid = {
  name: 'Jordan H.',
  email: 'jordan@example.com',
  phone: '9725551234',
  service: 'Medium Knotless',
  message: 'Hi Kristian — do you have anything open the last week of August?',
  company: '',
}

describe('contact validation', () => {
  it('accepts a well-formed message', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts a message with only the required fields', () => {
    const { phone: _p, service: _s, company: _c, ...minimal } = valid
    expect(contactSchema.safeParse(minimal).success).toBe(true)
  })

  it('rejects a missing name', () => {
    const r = contactSchema.safeParse({ ...valid, name: '' })
    expect(r.success).toBe(false)
  })

  it('rejects a malformed email', () => {
    for (const email of ['nope', 'a@', '@b.com', 'a b@c.com']) {
      expect(contactSchema.safeParse({ ...valid, email }).success, email).toBe(false)
    }
  })

  it('rejects a too-short message', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'hi' }).success).toBe(false)
  })

  it('rejects an over-long message rather than truncating it', () => {
    const r = contactSchema.safeParse({ ...valid, message: 'x'.repeat(2001) })
    expect(r.success).toBe(false)
  })

  it('rejects a short phone number but allows an empty one', () => {
    expect(contactSchema.safeParse({ ...valid, phone: '123' }).success).toBe(false)
    expect(contactSchema.safeParse({ ...valid, phone: '' }).success).toBe(true)
  })

  it('accepts a formatted phone number', () => {
    expect(contactSchema.safeParse({ ...valid, phone: '(972) 555-1234' }).success).toBe(
      true,
    )
  })

  it('rejects a filled honeypot', () => {
    expect(contactSchema.safeParse({ ...valid, company: 'AcmeSpam' }).success).toBe(false)
  })

  it('trims surrounding whitespace', () => {
    const r = contactSchema.safeParse({ ...valid, name: '  Kay  ' })
    expect(r.success && r.data.name).toBe('Kay')
  })
})
