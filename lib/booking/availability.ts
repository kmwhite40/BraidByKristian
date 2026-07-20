import { hasAcuityApiCredentials } from './acuity'
import { site } from '@/lib/content/site'

/**
 * "Next opening" lookup against the Acuity REST API.
 *
 * SERVER ONLY. `ACUITY_USER_ID` / `ACUITY_API_KEY` are deliberately not
 * `NEXT_PUBLIC_`, so importing this from a client component yields no
 * credentials and the lookup simply reports unavailable. Keep it that way.
 *
 * WHY THIS EXISTS
 * The commonest reason someone abandons a booking page is not price, it is
 * doubt that the person is available at all. Acuity knows the answer; the site
 * was just never asking. This asks.
 *
 * WHAT IT WILL NOT DO
 * It never guesses. No credentials, a failed request, a slow request, a
 * malformed response, or a month with nothing free all return `null`, and the
 * UI renders nothing at all. A stale or invented "next opening" is worse than
 * no indicator: it is a promise the calendar has not made, and the client finds
 * out only after they have chosen a style.
 *
 * This does not mirror the calendar. One value is read for display; Acuity
 * remains the only source of truth, and booking still happens there.
 */

const API = 'https://acuityscheduling.com/api/v1'

/** Acuity can be slow; a service page must not wait on it. */
const TIMEOUT_MS = 4000

/**
 * Cache window. Availability moves when clients book, not second by second,
 * and a service page is prerendered — 15 minutes keeps the figure honest
 * without putting Acuity in the path of every request.
 */
const REVALIDATE_SECONDS = 900

export type NextOpening = {
  /** ISO-8601 with offset, exactly as Acuity returned it. */
  iso: string
  /** Pre-formatted in the salon's timezone, ready to render. */
  label: string
}

function authHeader(): string {
  const raw = `${process.env.ACUITY_USER_ID}:${process.env.ACUITY_API_KEY}`
  return `Basic ${Buffer.from(raw).toString('base64')}`
}

async function acuityGet(path: string): Promise<unknown | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { Authorization: authHeader(), Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    // Network error, timeout, or unparseable body. Indistinguishable from the
    // caller's point of view, and all mean the same thing: say nothing.
    return null
  }
}

/** `YYYY-MM` for the given date, in the salon's timezone rather than the server's. */
function monthKey(d: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: site.contact.timezone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(d)
  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  return `${year}-${month}`
}

function formatOpening(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    timeZone: site.contact.timezone,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}

/**
 * The soonest bookable slot for one service, or `null`.
 *
 * Looks at this month and the next. Two months is enough for a braider booked
 * weeks out, and bounds the work to at most four upstream requests.
 */
export async function getNextOpening(
  appointmentTypeId: number,
): Promise<NextOpening | null> {
  if (!hasAcuityApiCredentials()) return null
  if (!Number.isInteger(appointmentTypeId) || appointmentTypeId <= 0) return null

  const now = new Date()
  const nextMonth = new Date(now.getTime())
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  for (const month of [monthKey(now), monthKey(nextMonth)]) {
    const dates = await acuityGet(
      `/availability/dates?month=${month}&appointmentTypeID=${appointmentTypeId}`,
    )
    if (!Array.isArray(dates) || dates.length === 0) continue

    for (const entry of dates) {
      const date =
        entry && typeof entry === 'object' && 'date' in entry
          ? String((entry as { date: unknown }).date)
          : null
      if (!date) continue

      const times = await acuityGet(
        `/availability/times?date=${date}&appointmentTypeID=${appointmentTypeId}`,
      )
      if (!Array.isArray(times) || times.length === 0) continue

      const first = times[0]
      const iso =
        first && typeof first === 'object' && 'time' in first
          ? String((first as { time: unknown }).time)
          : null
      if (!iso) continue

      const label = formatOpening(iso)
      // An unparseable timestamp is not something to render around.
      if (!label) return null
      return { iso, label }
    }
  }

  return null
}
