import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { formatPhone, telHref } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy',
  description: `How ${site.name} handles your information. No cookies for tracking, no payment data, no appointment details stored on this site.`,
  path: '/privacy',
})

/**
 * Privacy notice.
 *
 * Written to describe what this codebase ACTUALLY does — not a generic policy.
 * If you change the analytics provider, add a CRM, or start storing bookings,
 * this page has to change with it.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What this site knows about you"
        lede="Short version: very little, and nothing about your payments or your appointments."
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Privacy', href: '/privacy' },
        ]}
      />

      <Section className="py-12 sm:py-16">
        <Container size="narrow">
          <div className="measure space-y-10">
            <section>
              <h2 className="text-xl text-ink">Booking and payments</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">
                <p>
                  Appointments are booked through Acuity Scheduling (a Squarespace
                  company). When you use the calendar on{' '}
                  <Link href="/book" className="underline underline-offset-4">
                    the booking page
                  </Link>
                  , you are interacting with Acuity inside a frame — the details you enter
                  go to them, under their privacy policy, not to this website.
                </p>
                <p>
                  This site never sees, handles or stores card details. Deposits are sent
                  directly to Kristian by {site.deposit.methods.join(' or ')}, and the
                  balance is paid in cash at your appointment. There is no checkout here.
                </p>
                <p>
                  No appointment dates, times or confirmations are stored on this site.
                  Acuity is the only record.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl text-ink">The contact form</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">
                <p>
                  What you type into the contact form — your name, email, optional phone
                  number, the style you asked about and your message — is emailed to
                  Kristian so she can reply. It is not added to a database, a mailing list
                  or a CRM.
                </p>
                <p>
                  Your IP address is used, in memory only, to rate-limit the form against
                  spam. It is not logged or retained.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl text-ink">Analytics</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">
                <p>
                  If analytics is switched on, this site uses a privacy-first, cookieless
                  tool that counts page views and a small set of actions — booking button
                  clicks, style views, form submissions. It does not set tracking cookies,
                  does not build a profile of you, and does not follow you to other sites.
                  That is why there is no cookie banner here.
                </p>
                <p>
                  Nothing sensitive is measured: no names, no messages, no appointment
                  details, nothing about payment.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl text-ink">Local storage</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">
                <p>
                  Saved styles, recently viewed styles, and whether you dismissed the
                  announcement bar are kept in your own browser’s local storage. They stay
                  on your device, are never sent anywhere, and clearing your browser data
                  removes them.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl text-ink">Your choices</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">
                <p>
                  Want the message you sent through the form deleted from Kristian’s inbox?
                  Ask her — call{' '}
                  <a
                    href={telHref(site.contact.phone)}
                    className="underline underline-offset-4"
                  >
                    {formatPhone(site.contact.phone)}
                  </a>{' '}
                  or DM{' '}
                  <a
                    href={site.social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {site.social.instagram.handle}
                  </a>
                  . For anything held by Acuity, their privacy policy and their tools
                  govern it.
                </p>
              </div>
            </section>

            <p className="border-t border-rule pt-6 text-sm text-ink-subtle">
              This notice describes how the site is built today. If it changes, this page
              changes with it.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
