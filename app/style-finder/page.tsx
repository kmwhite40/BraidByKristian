import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import { StyleFinder } from '@/components/style-finder/style-finder'
import { BreadcrumbJsonLd } from '@/components/structured-data'
import { catalogStats } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Find Your Style',
  description: `Five quick questions to narrow ${catalogStats.serviceCount} styles down to the ones that fit your look, your hair and the time you have.`,
  path: '/style-finder',
})

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'Find your style', href: '/style-finder' },
]

export default function StyleFinderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Not sure what to book?"
        title="Find your style"
        lede={`Five questions. Every suggestion is a real style from Kristian's menu — nothing invented, nothing she does not actually do.`}
        breadcrumbs={breadcrumbs}
      />

      <Section className="py-12 sm:py-16">
        <Container size="narrow">
          <StyleFinder />
        </Container>
      </Section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
