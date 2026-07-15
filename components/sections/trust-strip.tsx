import { Container } from '@/components/ui/section'
import { catalogStats, site } from '@/lib/content'
import { formatPrice } from '@/lib/utils'

/**
 * Trust strip.
 *
 * Every line is a fact published on Kristian's own booking site, or a count
 * computed from the live catalog. Deliberately absent: years of experience,
 * clients served, awards, ratings, "licensed & insured" — none of it is
 * verifiable, so none of it is here.
 */
const items = [
  {
    label: 'Protective styling',
    detail: `${catalogStats.serviceCount} styles across ${catalogStats.categoryCount} categories`,
  },
  {
    label: 'One client at a time',
    detail: 'A private salon suite, not a shared floor',
  },
  {
    label: 'Ages 12 & under welcome',
    detail: 'The Lil Krownz menu',
  },
  {
    label: 'Book online',
    detail: `${formatPrice(site.deposit.amount)} deposit, applied to your service`,
  },
]

export function TrustStrip() {
  return (
    <section className="border-y border-rule bg-canvas-sunk">
      <Container>
        <h2 className="sr-only">What to expect</h2>
        <ul className="grid divide-y divide-rule sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {items.map((item, i) => (
            <li
              key={item.label}
              className={[
                'py-6 sm:py-8',
                i > 0 && 'lg:border-l lg:border-rule lg:pl-8',
                i === 1 && 'sm:border-l sm:border-rule sm:pl-8',
                i === 3 && 'sm:border-l sm:border-rule sm:pl-8',
                i >= 2 && 'sm:border-t sm:border-rule lg:border-t-0',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <p className="font-[family-name:var(--font-display)] text-lg leading-tight text-ink">
                {item.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-subtle">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
