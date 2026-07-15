import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { ServiceCatalog } from '@/components/services/service-catalog'
import { BreadcrumbJsonLd } from '@/components/structured-data'
import { FinalCta } from '@/components/sections/final-cta'
import { categories, services, catalogStats, site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'All Services & Prices',
  description: `Every style Kristian offers — ${catalogStats.serviceCount} services from ${formatPrice(catalogStats.lowestPrice)}. Knotless braids, bohemian, twists, locs, cornrows, Fulani and children's styles in ${site.contact.address.city}, ${site.contact.address.region}. Prices and appointment lengths listed.`,
  path: '/services',
})

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
]

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The menu"
        title="Every style, every price"
        lede={
          <>
            All {catalogStats.serviceCount} styles Kristian offers, from{' '}
            {formatPrice(catalogStats.lowestPrice)}. Each one lists its price, how long
            you will be in the chair, and whether you need to bring braiding hair — before
            you book, not after.
          </>
        }
        breadcrumbs={breadcrumbs}
      />

      <Section className="py-12 sm:py-16">
        <Container>
          {/* useSearchParams needs a Suspense boundary to keep the route static. */}
          <Suspense
            fallback={<div className="h-24" aria-hidden="true" />}
          >
            <ServiceCatalog services={services} categories={categories} />
          </Suspense>
        </Container>
      </Section>

      <FinalCta />
      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
