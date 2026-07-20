import { CalendarClock } from 'lucide-react'
import { getNextOpening } from '@/lib/booking/availability'

/**
 * "Next opening: Thursday, Jul 23, 9:00 AM" — read live from Acuity.
 *
 * An async server component, so the credentials never reach the browser and no
 * client JavaScript is added to render it.
 *
 * Renders `null` whenever the answer is not known: no API credentials
 * configured, Acuity unreachable or slow, or genuinely nothing free in the next
 * two months. That is the same rule the rest of the site follows — where the
 * source is silent, the UI is silent. An indicator that guesses would be making
 * a promise the calendar has not made.
 *
 * Wrap in <Suspense> at the call site: the fetch is network-bound and must not
 * hold up the rest of the page.
 */
export async function NextOpening({ appointmentTypeId }: { appointmentTypeId: number }) {
  const opening = await getNextOpening(appointmentTypeId)
  if (!opening) return null

  return (
    <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
      <CalendarClock aria-hidden="true" className="size-4 shrink-0 text-espresso-600" />
      <span>
        Next opening{' '}
        <time dateTime={opening.iso} className="font-medium text-ink">
          {opening.label}
        </time>
      </span>
    </p>
  )
}
