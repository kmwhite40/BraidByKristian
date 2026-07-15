import type { Metadata } from 'next'
import { Instagram, MapPin, Phone } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { BookButton } from '@/components/ui/book-button'
import { ContactForm } from '@/components/contact/contact-form'
import { BreadcrumbJsonLd } from '@/components/structured-data'
import { site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { formatPhone, telHref } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: `Questions for Kristian? Call ${formatPhone(site.contact.phone)}, DM ${site.social.instagram.handle}, or send a message. Salon suite in ${site.contact.address.city}, ${site.contact.address.region}.`,
  path: '/contact',
})

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact' },
]

export default function ContactPage() {
  const a = site.contact.address

  return (
    <>
      <PageHeader
        eyebrow="Say hello"
        title="Ask Kristian"
        lede="Booking is done on the scheduler — but if you have a question about a style, a length, or whether something will work for your hair, this is the place."
        breadcrumbs={breadcrumbs}
      />

      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-rule bg-canvas-sunk p-6 sm:p-8">
                <p className="eyebrow">Faster than the form</p>
                <ul className="mt-6 space-y-6">
                  <li className="flex gap-4">
                    <Phone
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 stroke-[1.5] text-clay-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">Call or text</p>
                      <a
                        href={telHref(site.contact.phone)}
                        className="mt-0.5 inline-block text-base text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
                      >
                        {formatPhone(site.contact.phone)}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <Instagram
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 stroke-[1.5] text-clay-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">DM on Instagram</p>
                      <a
                        href={site.social.instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-block text-base text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
                      >
                        {site.social.instagram.handle}
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <MapPin
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 stroke-[1.5] text-clay-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">The suite</p>
                      <address className="mt-0.5 text-base leading-relaxed not-italic text-ink-muted">
                        {a.street}
                        <br />
                        {a.unit}
                        <br />
                        {a.city}, {a.region} {a.postalCode}
                      </address>
                      <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
                        Full details come with your booking confirmation.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 border-t border-rule pt-6">
                  <p className="eyebrow">Hours</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    {site.hours.map((h) => (
                      <div key={h.label} className="flex justify-between gap-4">
                        <dt className="text-ink-subtle">{h.label}</dt>
                        <dd className="text-right whitespace-nowrap text-ink">
                          {h.display}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
                    {site.hoursNote}
                  </p>
                </div>

                <BookButton placement="contact-rail" className="mt-8 w-full">
                  Book an appointment
                </BookButton>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
