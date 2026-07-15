import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/page-header'
import { Container, Section } from '@/components/ui/section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FinalCta } from '@/components/sections/final-cta'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/structured-data'
import { faqs, faqCategories } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Do I bring my own hair? How should my hair be prepared? Is a deposit required? Answers to the questions clients ask Kristian most, all drawn from her booking policies.',
  path: '/faq',
})

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'FAQ', href: '/faq' },
]

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Answers"
        title="Questions people ask"
        lede="Everything here comes from Kristian's own booking site. If something is not answered, it is because she has not published an answer — call or DM and ask."
        breadcrumbs={breadcrumbs}
      />

      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Jump list */}
            <nav aria-labelledby="faq-topics" className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <h2 id="faq-topics" className="eyebrow">
                  Topics
                </h2>
                <ul className="mt-5 space-y-3">
                  {faqCategories.map((c) => (
                    <li key={c.slug}>
                      <a
                        href={`#${c.slug}`}
                        className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                      >
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="lg:col-span-9">
              {faqCategories.map((cat) => {
                const items = faqs.filter((f) => f.category === cat.slug)
                if (items.length === 0) return null
                return (
                  <section key={cat.slug} id={cat.slug} className="mb-14 scroll-mt-28">
                    <h2 className="text-[length:var(--text-display-sm)] text-ink">
                      {cat.label}
                    </h2>
                    <Accordion
                      type="single"
                      collapsible
                      className="mt-6 border-t border-rule"
                    >
                      {items.map((f) => (
                        <AccordionItem key={f.question} value={f.question}>
                          <AccordionTrigger>{f.question}</AccordionTrigger>
                          <AccordionContent>{f.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                )
              })}

              <div className="border border-rule bg-canvas-sunk p-6 sm:p-8">
                <h2 className="text-xl text-ink">Still not sure?</h2>
                <p className="measure mt-2 leading-relaxed text-ink-muted">
                  Kristian would rather talk a style through before you book than sort it
                  out at the chair.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex h-11 items-center border border-rule-strong px-6 text-[0.6875rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:border-ink"
                >
                  Ask a question
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <FinalCta />
      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  )
}
