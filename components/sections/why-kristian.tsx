import { Container, Section } from '@/components/ui/section'
import { Reveal } from '@/components/motion/reveal'
import { site } from '@/lib/content'
import { formatPrice } from '@/lib/utils'

/**
 * Differentiators.
 *
 * Each one is anchored to something Kristian actually published:
 *   parting       → her clients' reviews on her booking site ("parts are always crispy")
 *   hair history  → her prep flyer, verbatim: "so I can choose the safest ... approach"
 *   personalising → Freestyle services + "bring photos or references"
 *   transparency  → the published catalog: every price and duration up front
 *
 * Numbered as an editorial list rather than a 4-up card grid, because a card
 * grid here is exactly what makes these sites read as templates.
 */
const reasons = [
  {
    n: '01',
    title: 'The parts are the point',
    body: 'Parting is what you see in the mirror for the next six weeks, so it does not get rushed. It is also the thing clients bring up most: “parts are always crispy.”',
  },
  {
    n: '02',
    title: 'Your hair history matters',
    body: 'Recent colour, keratin or bleach changes what your hair can take. Kristian asks before starting so she can pick the safest approach — not after, when it is already too late.',
  },
  {
    n: '03',
    title: 'Tell me what you want',
    body: 'Bring photos. Book a Freestyle and describe the style you have in mind. Special requests are welcome — the ask is just that you raise them before the appointment, not during.',
  },
  {
    n: '04',
    title: 'No surprises at the chair',
    body: `Every style publishes its price, its sitting time, its add-ons and what you need to bring. The ${formatPrice(site.deposit.amount)} deposit comes off the total — it is not an extra.`,
  },
]

export function WhyKristian() {
  return (
    <Section tone="sunk">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">Why book with Kristian</p>
            <h2 className="mt-5 text-[length:var(--text-display-md)] leading-[1.05] text-ink">
              Good braids are not fast braids
            </h2>
            <p className="measure mt-5 leading-relaxed text-ink-muted">
              These are long appointments. Here is what that time actually buys you.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ul className="grid gap-px bg-rule sm:grid-cols-2">
              {reasons.map((r, i) => (
                <li key={r.n} className="bg-canvas-sunk">
                  <Reveal delay={i * 0.05} className="h-full">
                    <div className="flex h-full flex-col p-6 sm:p-8">
                      <p className="font-[family-name:var(--font-display)] text-sm text-clay-700">
                        {r.n}
                      </p>
                      <h3 className="mt-4 text-xl leading-tight text-ink">{r.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {r.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
