import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { formatPhone, telHref } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Accessibility',
  description: `${site.name} aims to meet WCAG 2.2 Level AA. How the site is built, what we know is imperfect, and how to tell us about a barrier.`,
  path: '/accessibility',
})

/**
 * Accessibility statement.
 *
 * Deliberately specific and honest, including the known gaps. A statement that
 * claims flawless conformance is not credible and is not useful to the people
 * who actually need it.
 */
export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Accessibility"
        title="Everyone should be able to book"
        lede="This site targets WCAG 2.2 Level AA. Here is what that means in practice, and what we know is not perfect yet."
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Accessibility', href: '/accessibility' },
        ]}
      />

      <Section className="py-12 sm:py-16">
        <Container size="narrow">
          <div className="measure space-y-10">
            <section>
              <h2 className="text-xl text-ink">What is built in</h2>
              <ul className="mt-4 space-y-2.5 leading-relaxed text-ink-muted">
                {[
                  'A skip link to main content as the first stop on every page.',
                  'Every interactive element is reachable and operable by keyboard, with a visible focus ring.',
                  'The mobile menu and the gallery lightbox trap focus while open, close on Escape, and return focus where you left it.',
                  'Text meets or beats 4.5:1 contrast against its background; the clay brand colour is used for surfaces and rules, never for text.',
                  'Buttons and tap targets are at least 44×44px.',
                  'Form fields have real labels, and errors are announced — not signalled by colour alone.',
                  'Filtering styles and the gallery announce their results to screen readers.',
                  'Images carry descriptive alt text that says what is in the photo.',
                  'Prices, durations and policies are real text, never baked into an image.',
                  'If you have reduced motion turned on, the entrance animations do not run at all.',
                  'The page works without JavaScript for reading content, and the booking calendar has a plain link fallback.',
                ].map((item) => (
                  <li key={item.slice(0, 20)} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 bg-clay-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-ink">Known limitations</h2>
              <div className="mt-4 space-y-3 leading-relaxed text-ink-muted">
                <p>
                  <strong className="font-medium text-ink">The booking calendar.</strong>{' '}
                  The scheduler on{' '}
                  <Link href="/book" className="underline underline-offset-4">
                    the booking page
                  </Link>{' '}
                  is Acuity Scheduling’s software, embedded in a frame. We label the frame
                  and give a direct link to their full page, but we do not control what is
                  inside it and cannot fix its accessibility. If the calendar is a barrier
                  for you, call or DM Kristian and she will book you in directly.
                </p>
                <p>
                  <strong className="font-medium text-ink">Photography.</strong> There are
                  only a few photographs of Kristian’s work available right now. Every one
                  has alt text, but the gallery is smaller than we would like.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl text-ink">Found a barrier?</h2>
              <div className="mt-4 space-y-3 leading-relaxed text-ink-muted">
                <p>
                  Tell us and it gets fixed. Call or text{' '}
                  <a
                    href={telHref(site.contact.phone)}
                    className="underline underline-offset-4"
                  >
                    {formatPhone(site.contact.phone)}
                  </a>
                  , DM{' '}
                  <a
                    href={site.social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {site.social.instagram.handle}
                  </a>
                  , or use the{' '}
                  <Link href="/contact" className="underline underline-offset-4">
                    contact form
                  </Link>
                  . Please say what page you were on and what got in your way.
                </p>
                <p>
                  If the website is stopping you from booking, that is our problem to
                  solve, not yours — reach out and Kristian will take the booking over the
                  phone.
                </p>
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </>
  )
}
