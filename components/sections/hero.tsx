import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { BookButton } from '@/components/ui/book-button'
import { Container } from '@/components/ui/section'
import { catalogStats, site } from '@/lib/content'
import { formatPrice } from '@/lib/utils'
import { Reveal } from '@/components/motion/reveal'

/**
 * Hero.
 *
 * Asymmetric: the type column is narrower than the image and sits low, so the
 * headline and the photograph read as one composition rather than two halves of
 * a split screen. The arch on the image is the motif carried over from
 * Kristian's flyers, where every block sits inside one.
 *
 * The headline is deliberately about the sitting time. These are 5-to-9-hour
 * appointments — pretending otherwise gets people in the chair who then leave
 * angry. Saying it out loud, with confidence, is both honest and better
 * positioning than "elevate your beauty".
 *
 * The photograph is a real one of Kristian with her own clients, cropped from
 * the brand photography on her booking site. It is `priority` + `fetchPriority`
 * so it is the LCP element and starts loading immediately, with explicit
 * width/height to hold its box and keep CLS at 0.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/* A single soft clay field anchoring the composition. Not a gradient
          wash — it has a hard edge and a job: it puts the arch on a ground. */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 h-[70%] w-[46%] bg-canvas-sunk max-lg:hidden"
      />

      <Container className="relative">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Type */}
          <div className="lg:col-span-6 lg:pb-8">
            <Reveal>
              <p className="eyebrow">
                {site.contact.address.city}, Texas · By appointment
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 text-[length:var(--text-display-xl)] leading-[0.92] font-medium text-ink">
                Braids worth
                <br />
                the sit.
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="measure mt-7 text-lg leading-relaxed text-ink-muted">
                Knotless, bohemian, twists and locs — installed one client at a time in a
                salon suite in {site.contact.address.city}. Every price and every sitting
                time is on the menu before you book.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <BookButton placement="hero" size="lg">
                  Book an appointment
                </BookButton>
                <Link
                  href="/services"
                  className="inline-flex h-13 items-center gap-2 border border-rule-strong px-8 text-[0.8125rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:border-ink hover:bg-clay-50"
                >
                  Explore styles
                  <ArrowDown aria-hidden="true" className="size-4 stroke-[1.5]" />
                </Link>
              </div>
            </Reveal>

            {/* Real, countable facts from the live catalog — not invented
                "10+ years" or "500+ clients". These numbers are computed. */}
            <Reveal delay={0.24}>
              <dl className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-rule pt-6">
                <div className="flex items-baseline gap-2">
                  <dt className="sr-only">Styles on the menu</dt>
                  <dd className="font-[family-name:var(--font-display)] text-2xl text-ink">
                    {catalogStats.serviceCount}
                  </dd>
                  <dd className="text-xs tracking-[0.1em] text-ink-subtle uppercase">
                    styles
                  </dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="sr-only">Starting price</dt>
                  <dd className="font-[family-name:var(--font-display)] text-2xl text-ink">
                    {formatPrice(catalogStats.lowestPrice)}
                  </dd>
                  <dd className="text-xs tracking-[0.1em] text-ink-subtle uppercase">
                    starting
                  </dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="sr-only">Deposit</dt>
                  <dd className="font-[family-name:var(--font-display)] text-2xl text-ink">
                    {formatPrice(site.deposit.amount)}
                  </dd>
                  <dd className="text-xs tracking-[0.1em] text-ink-subtle uppercase">
                    deposit
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* Image */}
          <div className="lg:col-span-6">
            <Reveal delay={0.1} distance={24}>
              <figure className="relative">
                <div className="arch-sm relative aspect-[780/892] overflow-hidden bg-clay-200">
                  <Image
                    src="/images/studio-kristian-and-clients.jpg"
                    alt="Kristian seated with two of her clients in the salon suite. Both clients wear long braided styles with curled ends."
                    width={780}
                    height={892}
                    priority
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="size-full object-cover object-top"
                  />
                </div>
                <figcaption className="mt-3 text-xs text-ink-subtle">
                  Kristian (seated) with clients.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
