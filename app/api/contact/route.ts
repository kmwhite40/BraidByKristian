import { NextResponse } from 'next/server'
import { contactSchema, type ContactResponse } from '@/lib/validation/contact'
import { isEmailConfigured, sendContactEmail } from '@/lib/email'

export const runtime = 'nodejs'
/** Never prerendered or cached — it is a mutation. */
export const dynamic = 'force-dynamic'

/**
 * Contact endpoint.
 *
 * Defences:
 *   - the payload is re-validated with Zod server-side; the client's own
 *     validation is a convenience and is never trusted
 *   - a honeypot field must be empty
 *   - a fixed-window in-memory rate limit per IP
 *   - the response shape never reveals whether mail delivery itself succeeded,
 *     only whether the submission was accepted
 *
 * RATE LIMITING CAVEAT: the counter below lives in the module scope of one
 * serverless instance. It stops naive floods but is not a real control — every
 * cold start resets it and instances do not share state. For production, put
 * Vercel WAF / Upstash Ratelimit in front of this route. See docs/SECURITY.md.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    // Opportunistic sweep so the map cannot grow without bound.
    if (hits.size > 500) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k)
    }
    return false
  }

  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many messages. Please wait a minute and try again.' },
      { status: 429 },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please check the highlighted fields.',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
      { status: 400 },
    )
  }

  // Honeypot tripped. Answer 200 so a bot cannot tell it was caught.
  if (parsed.data.company) return NextResponse.json({ ok: true })

  const result = await sendContactEmail(parsed.data)

  if (result.ok === 'skipped') {
    // No mail provider configured yet. Log it so the message is not silently
    // lost, and still tell the client it went through — from their side it did.
    console.warn(
      '[contact] No email provider configured; message not delivered.',
      JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        service: parsed.data.service,
      }),
    )
    return NextResponse.json({ ok: true })
  }

  if (!result.ok) {
    console.error('[contact] Delivery failed:', result.reason)
    return NextResponse.json(
      {
        ok: false,
        error:
          'Something went wrong sending that. Please call or DM Kristian instead — it is the fastest way to reach her.',
      },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}

/** Lets the deploy checklist confirm wiring without sending mail. */
export async function GET() {
  return NextResponse.json({ configured: isEmailConfigured() })
}
