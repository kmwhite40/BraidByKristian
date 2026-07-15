import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { BookButton } from '@/components/ui/book-button'
import { BreadcrumbJsonLd } from '@/components/structured-data'
import { policies, preparation, site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Booking Policies & Preparation',
  description: `Deposit, cancellation, late arrival and preparation policies for Braids by Kristian. ${formatPrice(site.deposit.amount)} non-refundable deposit, ${site.cancellationNoticeHours}-hour notice to cancel or reschedule, ${site.gracePeriodMinutes}-minute grace period.`,
  path: '/policies',
})

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'Policies', href: '/policies' },
]

export default function PoliciesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The fine print, in plain words"
        title="Policies & preparation"
        lede="Kristian's booking policies, exactly as she publishes them — plus what she needs from you before you sit down."
        breadcrumbs={breadcrumbs}
      />

      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              {/* Policies */}
              <h2 className="text-[length:var(--text-display-sm)] text-ink">
                Booking policies
              </h2>
              <div className="mt-8 space-y-10">
                {policies.map((p) => (
                  <section key={p.id} id={p.id} className="scroll-mt-28 border-t border-rule pt-6">
                    <h3 className="text-xl text-ink">{p.title}</h3>
                    <div className="measure mt-3 space-y-3 leading-relaxed text-ink-muted">
                      {p.body.map((line) => (
                        <p key={line.slice(0, 24)}>{line}</p>
                      ))}
                    </div>
                    {/* Kristian's exact wording, so nothing is lost in the
                        rewrite and clients can see the original. */}
                    <details className="mt-4 group">
                      <summary className="cursor-pointer text-xs tracking-[0.1em] text-ink-subtle uppercase underline decoration-clay-500 underline-offset-4 hover:text-ink">
                        Kristian’s original wording
                      </summary>
                      <p className="measure mt-3 border-l-2 border-clay-300 pl-4 text-sm leading-relaxed text-ink-subtle italic">
                        “{p.verbatim}”
                      </p>
                    </details>
                  </section>
                ))}
              </div>

              {/* Preparation */}
              <h2
                id="preparation"
                className="mt-16 scroll-mt-28 text-[length:var(--text-display-sm)] text-ink"
              >
                Before your appointment
              </h2>
              <p className="measure mt-3 leading-relaxed text-ink-muted">
                Two of these are requirements. Arriving with oil in your hair means
                rescheduling, or a {formatPrice(site.fees.washAndBlowDry)} wash and
                blow-dry added to your balance.
              </p>
              <ul className="mt-8">
                {preparation.map((p) => (
                  <li
                    key={p.id}
                    id={p.id}
                    className="flex scroll-mt-28 gap-5 border-t border-rule py-6 last:border-b"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-clay-600"
                    >
                      <Check className="size-3 stroke-[2] text-espresso-600" />
                    </span>
                    <div>
                      <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg leading-tight text-ink">
                        {p.title}
                        {p.required ? (
                          <span className="border border-espresso-600 px-1.5 py-0.5 text-[0.5625rem] font-medium tracking-[0.14em] text-espresso-600 uppercase">
                            Required
                          </span>
                        ) : null}
                      </h3>
                      <p className="measure mt-2 leading-relaxed text-ink-muted">
                        {p.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary rail */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="border border-rule bg-canvas-sunk p-6">
                  <p className="eyebrow">At a glance</p>
                  <dl className="mt-5 space-y-4 text-sm">
                    <div>
                      <dt className="text-ink-subtle">Deposit</dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {formatPrice(site.deposit.amount)}, non-refundable
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-subtle">Deposit by</dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {site.deposit.methods.join(' or ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-subtle">Balance</dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {site.balancePayment} only
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-subtle">Grace period</dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {site.gracePeriodMinutes} minutes
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-subtle">Late fee</dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {formatPrice(site.fees.late)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-subtle">Cancel / reschedule</dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {site.cancellationNoticeHours} hours’ notice
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-subtle">Wash &amp; blow-dry fee</dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {formatPrice(site.fees.washAndBlowDry)} if oil is present
                      </dd>
                    </div>
                  </dl>
                  <BookButton placement="policies-rail" className="mt-6 w-full">
                    Book an appointment
                  </BookButton>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
