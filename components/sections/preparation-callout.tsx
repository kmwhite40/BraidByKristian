import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Container, Section } from '@/components/ui/section'
import { preparation, policies, site } from '@/lib/content'
import { formatPrice } from '@/lib/utils'

/**
 * "Before your appointment".
 *
 * This is the highest-value section on the site for Kristian: the $45 wash fee
 * and the reschedules both come from people arriving with oiled or undried
 * hair. Saying it loudly and early — before booking, not in a confirmation
 * email nobody reads — is the whole point.
 *
 * Content comes from lib/content/policies.ts, transcribed from her prep flyer.
 */
export function PreparationCallout() {
  const deposit = policies.find((p) => p.id === 'deposit')

  return (
    <Section id="preparation" tone="sunk" className="scroll-mt-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow">Before your appointment</p>
            <h2 className="mt-5 text-[length:var(--text-display-md)] leading-[1.05] text-ink">
              Come prepared and we start on time
            </h2>
            <p className="measure mt-5 leading-relaxed text-ink-muted">
              Two of these are requirements, not suggestions — arriving with oil in your
              hair means rescheduling, or a {formatPrice(site.fees.washAndBlowDry)} wash
              and blow-dry added to your balance.
            </p>

            {deposit ? (
              <div className="mt-8 border-l-2 border-espresso-600 pl-5">
                <p className="text-sm font-medium text-ink">{deposit.title}</p>
                <p className="measure-tight mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {deposit.summary}
                </p>
              </div>
            ) : null}

            <Link
              href="/policies"
              className="group mt-8 inline-flex items-center gap-2 border-b border-rule-strong pb-1 text-[0.8125rem] font-medium tracking-[0.12em] text-ink uppercase transition-colors hover:border-ink"
            >
              Read the full policies
              <ArrowRight
                aria-hidden="true"
                className="size-4 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <ul className="flex flex-col">
              {preparation.map((step) => (
                <li
                  key={step.id}
                  className="flex gap-5 border-t border-rule py-6 last:border-b"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-clay-600"
                  >
                    <Check className="size-3 stroke-[2] text-espresso-600" />
                  </span>
                  <div>
                    <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg leading-tight text-ink">
                      {step.title}
                      {step.required ? (
                        <span className="border border-espresso-600 px-1.5 py-0.5 text-[0.5625rem] font-medium tracking-[0.14em] text-espresso-600 uppercase">
                          Required
                        </span>
                      ) : null}
                    </h3>
                    <p className="measure mt-2 text-sm leading-relaxed text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
