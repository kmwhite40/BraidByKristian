import { site, booking } from '@/lib/content/site'
import { absoluteUrl } from '@/lib/seo'
import { durationToIso } from '@/lib/utils'
import type { Service } from '@/lib/content'
import type { Faq } from '@/lib/content/schema'

/**
 * Structured data.
 *
 * Rules held to throughout:
 *   - Only facts published on Kristian's booking site are emitted. No
 *     aggregateRating (there is no review platform behind it), no
 *     priceValidUntil, no fabricated openingHours.
 *   - HairSalon is the correct Schema.org type here — it is a documented
 *     subtype of LocalBusiness, more specific than BeautySalon for a braider.
 *   - JSON-LD is injected with JSON.stringify, and `<` is escaped so a stray
 *     angle bracket in content can never break out of the script tag.
 */

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

const ORG_ID = absoluteUrl('/#business')

export function BusinessJsonLd() {
  const a = site.contact.address
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'HairSalon',
        '@id': ORG_ID,
        name: site.name,
        description: site.description,
        url: site.url,
        telephone: `+1${site.contact.phone}`,
        image: absoluteUrl('/images/studio-kristian-and-clients.jpg'),
        priceRange: '$$',
        currenciesAccepted: 'USD',
        // Verified: balance is cash only; the deposit is Cash App or Zelle.
        paymentAccepted: 'Cash, Cash App, Zelle',
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${a.street}, ${a.unit}`,
          addressLocality: a.city,
          addressRegion: a.region,
          postalCode: a.postalCode,
          addressCountry: a.country,
        },
        areaServed: { '@type': 'City', name: `${a.city}, ${a.region}` },
        sameAs: [
          site.social.instagram.url,
          ...(site.social.tiktok ? [site.social.tiktok.url] : []),
        ],
        openingHoursSpecification: site.hours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
          opens: h.opens,
          closes: h.closes,
        })),
        hasMap: undefined,
        potentialAction: {
          '@type': 'ReserveAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: booking.scheduleUrl,
            inLanguage: 'en-US',
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/MobileWebPlatform',
            ],
          },
          result: { '@type': 'Reservation', name: 'Braiding appointment' },
        },
      }}
    />
  )
}

export function ServiceJsonLd({ service }: { service: Service }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        serviceType: 'Hair braiding',
        url: absoluteUrl(`/services/${service.slug}`),
        provider: { '@id': ORG_ID },
        areaServed: {
          '@type': 'City',
          name: `${site.contact.address.city}, ${site.contact.address.region}`,
        },
        // A quoted service has no price to publish, so no Offer is emitted at
        // all rather than an Offer with a misleading 0.
        ...(service.priceMode === 'fixed'
          ? {
              offers: {
                '@type': 'Offer',
                price: service.price,
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: absoluteUrl(`/book?style=${service.slug}`),
              },
            }
          : {}),
        ...(service.notes.length
          ? { description: service.notes.join(' ') }
          : { description: `${service.name} by ${site.stylist} in ${site.contact.address.city}, ${site.contact.address.region}.` }),
        // Scheduled chair time, not a delivery estimate.
        estimatedDuration: durationToIso(service.durationMinutes),
      }}
    />
  )
}

export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[]
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.href),
        })),
      }}
    />
  )
}
