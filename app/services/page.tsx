import type { Metadata } from 'next'
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
  description: `All ${catalogStats.serviceCount} styles from ${formatPrice(catalogStats.lowestPrice)} — knotless, bohemian, twists, locs and cornrows in ${site.contact.address.city}, ${site.contact.address.region}. Every price and sitting time listed.`,
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
          {/* No Suspense: ServiceCatalog no longer calls useSearchParams, so it
              prerenders with all 47 cards in the HTML. A fallback here would put
              the catalog back behind a client render. */}
          <ServiceCatalog services={services} categories={categories} />
        </Container>
      </Section>

      <FinalCta />
      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
