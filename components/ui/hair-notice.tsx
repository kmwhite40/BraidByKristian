import { cn } from '@/lib/utils'
import { site } from '@/lib/content'
import type { Service } from '@/lib/content'

/**
 * "Do I need to bring hair?" — the question that drives the most pre-booking
 * DMs, answered on the card instead of in a DM.
 *
 * Critically, this renders NOTHING when the scheduler does not say. Silence is
 * correct; a confident guess about whether hair is included would be a
 * fabricated business fact, and the client would find out at the chair.
 *
 * `site.stylistProvidesHair` overrides the per-service data: Kristian now
 * provides the braiding hair, so styles the catalog still marks 'client' are
 * reported as provided, and their old "bring 3–4 bundles" evidence — which
 * described the previous arrangement — is not shown.
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

  // Natural-hair styles ('not-applicable') use no added hair at all — true
  // regardless of who would otherwise supply it, so it still shows.
  if (service.hairProvidedBy === 'not-applicable') {
    return renderNotice('No added hair — styled on your own hair', null, compact, className)
  }

  // hairProvidedBy === 'client' — but the stylist now provides it.
  if (site.stylistProvidesHair) {
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
