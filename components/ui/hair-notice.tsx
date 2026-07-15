import { cn } from '@/lib/utils'
import type { Service } from '@/lib/content'

/**
 * "Do I need to bring hair?" — the question that drives the most pre-booking
 * DMs, answered on the card instead of in a DM.
 *
 * Critically, this renders NOTHING when the scheduler does not say. Silence is
 * correct; a confident guess about whether hair is included would be a
 * fabricated business fact, and the client would find out at the chair.
 */
export function HairNotice({
  service,
  compact = false,
  className,
}: {
  service: Service
  compact?: boolean
  className?: string
}) {
  if (service.hairProvidedBy === 'unspecified') return null

  const label =
    service.hairProvidedBy === 'client'
      ? 'You bring the braiding hair'
      : 'No added hair — styled on your own hair'

  if (compact) {
    return (
      <p
        className={cn(
          'inline-flex items-center border border-rule px-2.5 py-1 text-[0.6875rem] tracking-wide text-ink-muted',
          className,
        )}
      >
        {label}
      </p>
    )
  }

  return (
    <div className={cn('border-l-2 border-clay-500 pl-4', className)}>
      <p className="text-sm font-medium text-ink">{label}</p>
      <p className="measure mt-1 text-sm leading-relaxed text-ink-subtle">
        {service.hairEvidence}
      </p>
    </div>
  )
}
