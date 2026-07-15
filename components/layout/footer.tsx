import Link from 'next/link'
import { Instagram, Phone } from 'lucide-react'
import { Wordmark } from '@/components/ui/wordmark'
import { BookButton } from '@/components/ui/book-button'
import { Container } from '@/components/ui/section'
import { footerNav } from '@/lib/content/navigation'
import { site } from '@/lib/content/site'
import { formatPhone, telHref } from '@/lib/utils'

export function Footer() {
  const year = new Date().getFullYear()
  const a = site.contact.address

  return (
    <footer className="bg-espresso-900 text-clay-100 print:hidden">
      <Container>
        {/* Closing invitation */}
        <div className="flex flex-col gap-8 border-b border-clay-600/25 py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-clay-300">Ready when you are</p>
            <p className="mt-4 max-w-lg font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] leading-[1.15] text-canvas">
              Pick your style, send the deposit, and I’ll see you in the chair.
            </p>
          </div>
          <BookButton placement="footer" variant="inverse" size="lg">
            Book an appointment
          </BookButton>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block text-canvas">
              <Wordmark size="md" />
            </Link>
            <p className="measure-tight mt-4 text-sm leading-relaxed text-clay-200">
              Protective styling by Kristian — knotless braids, bohemian styles, twists,
              locs and cornrows, in a one-on-one salon suite in {a.city}, {a.region}.
            </p>
            <ul className="mt-5 flex items-center gap-2">
              <li>
                <a
                  href={site.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center border border-clay-600/40 text-clay-100 transition-colors hover:border-clay-300 hover:text-canvas"
                >
                  <Instagram aria-hidden="true" className="size-4 stroke-[1.5]" />
                  <span className="sr-only">
                    Braids by Kristian on Instagram ({site.social.instagram.handle})
                  </span>
                </a>
              </li>
              {/* TikTok renders only once a real profile is set in site.ts. */}
              {site.social.tiktok ? (
                <li>
                  <a
                    href={site.social.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-11 place-items-center border border-clay-600/40 text-clay-100 transition-colors hover:border-clay-300 hover:text-canvas"
                  >
                    <span className="text-xs font-medium">TT</span>
                    <span className="sr-only">
                      Braids by Kristian on TikTok ({site.social.tiktok.handle})
                    </span>
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  href={telHref(site.contact.phone)}
                  className="grid size-11 place-items-center border border-clay-600/40 text-clay-100 transition-colors hover:border-clay-300 hover:text-canvas"
                >
                  <Phone aria-hidden="true" className="size-4 stroke-[1.5]" />
                  <span className="sr-only">Call {formatPhone(site.contact.phone)}</span>
                </a>
              </li>
            </ul>
          </div>

          <nav aria-labelledby="footer-styles">
            <h2 id="footer-styles" className="eyebrow text-clay-300">
              Styles
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {footerNav.styles.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-clay-100 underline-offset-4 transition-colors hover:text-canvas hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-visit">
            <h2 id="footer-visit" className="eyebrow text-clay-300">
              Your appointment
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {footerNav.visit.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-clay-100 underline-offset-4 transition-colors hover:text-canvas hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-clay-300">Find me</h2>
            <address className="mt-5 space-y-4 text-sm not-italic text-clay-100">
              <p className="leading-relaxed">
                {a.street}
                <br />
                {a.unit}
                <br />
                {a.city}, {a.region} {a.postalCode}
              </p>
              <p>
                <a
                  href={telHref(site.contact.phone)}
                  className="underline decoration-clay-600 underline-offset-4 transition-colors hover:text-canvas hover:decoration-clay-300"
                >
                  {formatPhone(site.contact.phone)}
                </a>
              </p>
              {/* Email link appears only when a real address is configured. */}
              {site.contact.email ? (
                <p>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="underline decoration-clay-600 underline-offset-4 transition-colors hover:text-canvas hover:decoration-clay-300"
                  >
                    {site.contact.email}
                  </a>
                </p>
              ) : null}
            </address>

            <h2 className="eyebrow mt-8 text-clay-300">Hours</h2>
            <dl className="mt-5 space-y-2 text-sm text-clay-100">
              {site.hours.map((h) => (
                <div key={h.label} className="flex justify-between gap-4">
                  <dt className="text-clay-200">{h.label}</dt>
                  <dd className="text-right whitespace-nowrap">{h.display}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-clay-300">{site.hoursNote}</p>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-clay-600/25 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-clay-300">
            © {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerNav.legal.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-xs text-clay-300 underline-offset-4 transition-colors hover:text-canvas hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* No "Powered by" line: nothing here is contractually required, and
              Acuity renders its own attribution inside the scheduler itself. */}
        </div>
      </Container>
    </footer>
  )
}
