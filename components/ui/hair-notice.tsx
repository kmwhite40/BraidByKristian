import { cn } from '@/lib/utils'
import { hairArrangement } from '@/lib/content'
import type { Service } from '@/lib/content'

/**
 * "Do I need to bring hair?" — the question that drives the most pre-booking
 * DMs, answered on the card instead of in a DM.
 *
 * Critically, this renders NOTHING when the scheduler does not say. Silence is
 * correct; a confident guess about whether hair is included would be a
 * fabricated business fact, and the client would find out at the chair.
 *
 * `hairArrangement` resolves the global policy and the per-style exceptions
 * together: Kristian now provides the braiding hair, so styles the catalog
 * still marks 'client' are reported as provided — except the few the live
 * scheduler explicitly excludes, where the client really does bring bundles.
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
  const arrangement = hairArrangement(service)

  if (arrangement === 'unknown') return null

  // Natural-hair styles use no added hair at all — true regardless of who
  // would otherwise supply it, so it still shows.
  if (arrangement === 'none') {
    return renderNotice('No added hair — styled on your own hair', null, compact, className)
  }

  if (arrangement === 'provided') {
    return renderNotice('Braiding hair provided', null, compact, className)
  }

  return renderNotice('You bring the braiding hair', service.hairEvidence, compact, className)
}

/**
 * The badge (compact) or the bordered block (full). `evidence` is the
 * supporting line under the label in the full form; pass null to omit it — used
 * when the label needs no elaboration, or when the catalog's evidence describes
 * a policy that no longer applies.
 */
function renderNotice(
  label: string,
  evidence: string | null,
  compact: boolean,
  className?: string,
) {
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
      {evidence ? (
        <p className="measure mt-1 text-sm leading-relaxed text-ink-subtle">{evidence}</p>
      ) : null}
    </div>
  )
}
