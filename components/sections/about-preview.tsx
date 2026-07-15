import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/section'
import { about } from '@/lib/content'
import { Reveal } from '@/components/motion/reveal'

export function AboutPreview() {
  return (
    <Section tone="clay">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Portrait in the arch — the motif from Kristian's own flyer, where
              this same photograph sits inside one. */}
          <Reveal className="lg:col-span-5">
            <div className="arch-sm relative mx-auto aspect-[298/504] w-full max-w-sm overflow-hidden bg-clay-300">
              <Image
                src="/images/kristian-portrait.jpg"
                alt="Kristian, the braider behind Braids by Kristian."
                width={298}
                height={504}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 60vw, 90vw"
                className="size-full object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-espresso-800">{about.eyebrow}</p>
              <h2 className="mt-5 text-[length:var(--text-display-md)] leading-[1.05] text-ink">
                {about.heading}
              </h2>
              <div className="measure mt-6 space-y-4 text-base leading-relaxed text-espresso-900">
                {about.intro.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 border-b border-espresso-800/40 pb-1 text-[0.8125rem] font-medium tracking-[0.12em] text-espresso-900 uppercase transition-colors hover:border-espresso-800"
              >
                More about Kristian
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
