import Link from 'next/link'
import { Container, Section } from '@/components/ui/section'
import { BookButton } from '@/components/ui/book-button'
import { catalogStats } from '@/lib/content'

export function FinalCta() {
  return (
    <Section tone="clay" className="text-center">
      <Container size="narrow">
        <p className="eyebrow text-espresso-800">Your chair is open</p>
        <h2 className="mt-6 text-[length:var(--text-display-lg)] leading-[0.98] text-ink">
          Find your style.
          <br />
          Save your seat.
        </h2>
        <p className="measure mx-auto mt-6 text-base leading-relaxed text-espresso-900">
          {catalogStats.serviceCount} styles, every price and sitting time published, and
          a calendar that shows exactly when Kristian is free.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <BookButton placement="final-cta" size="lg">
            Book an appointment
          </BookButton>
          <Link
            href="/style-finder"
            className="inline-flex h-13 items-center border border-espresso-800/40 px-8 text-[0.8125rem] font-medium tracking-[0.14em] text-espresso-900 uppercase transition-colors hover:border-espresso-800 hover:bg-clay-400"
          >
            Help me choose
          </Link>
        </div>
      </Container>
    </Section>
  )
}
