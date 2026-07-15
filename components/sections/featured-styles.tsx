import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section, SectionHeading } from '@/components/ui/section'
import { ServiceCard } from '@/components/ui/service-card'
import { getFeaturedServices } from '@/lib/content'
import { Reveal } from '@/components/motion/reveal'

/**
 * Featured styles. Controlled entirely by `featuredServiceSlugs` in
 * lib/content/index.ts — change that array, this section follows.
 */
export function FeaturedStyles() {
  const featured = getFeaturedServices()

  return (
    <Section id="featured">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="A few to start with"
            title={
              <>
                The styles people
                <br className="hidden sm:block" /> come back for
              </>
            }
          />
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 pb-2 text-[0.8125rem] font-medium tracking-[0.12em] text-ink uppercase"
          >
            All styles
            <ArrowRight
              aria-hidden="true"
              className="size-4 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {featured.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
