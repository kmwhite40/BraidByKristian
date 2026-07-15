import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { BookingClient } from '@/components/booking/booking-client'
import { BreadcrumbJsonLd } from '@/components/structured-data'
import { site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Book an Appointment',
  description: `Book with Kristian in ${site.contact.address.city}, ${site.contact.address.region}. Live availability, ${formatPrice(site.deposit.amount)} deposit to secure your spot, balance in cash at your appointment.`,
  path: '/book',
})

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'Book', href: '/book' },
]

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book"
        title="Save your seat"
        lede="Kristian’s real calendar, on her own site. Pick a style, pick a time, and send the deposit to lock it in."
        breadcrumbs={breadcrumbs}
      />

      <Section className="py-12 sm:py-16">
        <Container>
          <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
            <BookingClient />
          </Suspense>
        </Container>
      </Section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
