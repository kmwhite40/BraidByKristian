import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '@/components/ui/section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Faq } from '@/lib/content/schema'

export function FaqSection({
  faqs,
  heading = 'Questions, answered',
  eyebrow = 'Before you book',
  showAllLink = true,
}: {
  faqs: Faq[]
  heading?: string
  eyebrow?: string
  showAllLink?: boolean
}) {
  if (faqs.length === 0) return null

  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-5 text-[length:var(--text-display-md)] leading-[1.05] text-ink">
              {heading}
            </h2>
            {showAllLink ? (
              <Link
                href="/faq"
                className="group mt-6 inline-flex items-center gap-2 border-b border-rule-strong pb-1 text-[0.8125rem] font-medium tracking-[0.12em] text-ink uppercase transition-colors hover:border-ink"
              >
                All questions
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ) : null}
          </div>

          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="border-t border-rule">
              {faqs.map((f) => (
                <AccordionItem key={f.question} value={f.question}>
                  <AccordionTrigger>{f.question}</AccordionTrigger>
                  <AccordionContent>{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </Section>
  )
}
