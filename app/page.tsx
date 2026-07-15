import type { Metadata } from 'next'
import { Hero } from '@/components/sections/hero'
import { TrustStrip } from '@/components/sections/trust-strip'
import { FeaturedStyles } from '@/components/sections/featured-styles'
import { WhyKristian } from '@/components/sections/why-kristian'
import { GalleryPreview } from '@/components/sections/gallery-preview'
import { BookingJourney } from '@/components/sections/booking-journey'
import { Testimonials } from '@/components/sections/testimonials'
import { AboutPreview } from '@/components/sections/about-preview'
import { PreparationCallout } from '@/components/sections/preparation-callout'
import { FaqSection } from '@/components/sections/faq-section'
import { FinalCta } from '@/components/sections/final-cta'
import { FaqJsonLd } from '@/components/structured-data'
import { faqs, site } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: `Braider in ${site.contact.address.city}, ${site.contact.address.region} — Knotless Braids, Twists & Locs`,
  description: site.description,
  path: '/',
})

/** The five questions that actually block a booking. The rest live on /faq. */
const homeFaqs = faqs.filter((f) =>
  [
    'Is the braiding hair included?',
    'How should my hair be prepared?',
    'Is a deposit required?',
    'How long will my appointment take?',
    'Can I reschedule or cancel?',
  ].includes(f.question),
)

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedStyles />
      <WhyKristian />
      <GalleryPreview />
      <BookingJourney />
      <Testimonials />
      <AboutPreview />
      <PreparationCallout />
      <FaqSection faqs={homeFaqs} />
      <FinalCta />
      <FaqJsonLd faqs={homeFaqs} />
    </>
  )
}
