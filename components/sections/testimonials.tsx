import { Container, Section } from '@/components/ui/section'
import { testimonials } from '@/lib/content'
import { Reveal } from '@/components/motion/reveal'

/**
 * Testimonials.
 *
 * Renders nothing when the array is empty — an empty reviews section is worse
 * than none, and inventing filler would be a fabricated business claim.
 *
 * The quotes are real, transcribed from the testimonial flyer Kristian
 * publishes on her booking site, spelling and all. No star ratings are drawn:
 * the flyer shows five stars per quote, but there is no review platform behind
 * them to substantiate an aggregate rating, so none is claimed here or in the
 * structured data.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null

  const [lead, ...rest] = testimonials

  return (
    <Section>
      <Container>
        <p className="eyebrow">In their words</p>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Lead quote, set as display type. */}
          {lead ? (
            <Reveal className="lg:col-span-7">
              <figure>
                <blockquote>
                  <p className="font-[family-name:var(--font-display)] text-[length:var(--text-display-sm)] leading-[1.3] text-ink">
                    <span aria-hidden="true" className="text-clay-500">
                      “
                    </span>
                    {lead.quote}
                    <span aria-hidden="true" className="text-clay-500">
                      ”
                    </span>
                  </p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-sm">
                  <span aria-hidden="true" className="h-px w-8 bg-clay-500" />
                  <span className="font-medium text-ink">{lead.author}</span>
                  {lead.service ? (
                    <span className="text-ink-subtle">· {lead.service}</span>
                  ) : null}
                </figcaption>
              </figure>
            </Reveal>
          ) : null}

          {/* Supporting quotes. */}
          <ul className="flex flex-col gap-8 lg:col-span-5">
            {rest.map((t, i) => (
              <li key={t.author}>
                <Reveal delay={i * 0.06}>
                  <figure className="border-t border-rule pt-5">
                    <blockquote>
                      <p className="text-base leading-relaxed text-ink-muted">
                        “{t.quote}”
                      </p>
                    </blockquote>
                    <figcaption className="mt-3 text-sm font-medium text-ink">
                      {t.author}
                      {t.service ? (
                        <span className="font-normal text-ink-subtle"> · {t.service}</span>
                      ) : null}
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
