import Link from 'next/link'
import { Container } from '@/components/ui/section'
import { BookButton } from '@/components/ui/book-button'
import { Monogram } from '@/components/ui/wordmark'
import { primaryNav } from '@/lib/content/navigation'

export default function NotFound() {
  return (
    <Container size="narrow" className="flex min-h-[70dvh] flex-col justify-center py-20">
      <Monogram className="text-clay-700" />

      <p className="eyebrow mt-8">404</p>
      <h1 className="mt-4 text-[length:var(--text-display-lg)] leading-[1.0] text-ink">
        This one’s not here
      </h1>
      <p className="measure mt-5 text-lg leading-relaxed text-ink-muted">
        The page you were after has moved or never existed. The styles, though, are all
        still where you left them.
      </p>

      <div className="mt-9 flex flex-wrap gap-3">
        <BookButton placement="404" size="lg">
          Book an appointment
        </BookButton>
        <Link
          href="/services"
          className="inline-flex h-13 items-center border border-rule-strong px-8 text-[0.8125rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:border-ink hover:bg-clay-50"
        >
          Browse styles
        </Link>
      </div>

      <nav aria-label="Site" className="mt-14 border-t border-rule pt-6">
        <p className="eyebrow">Or try</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-ink-muted underline decoration-clay-500 underline-offset-4 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  )
}
