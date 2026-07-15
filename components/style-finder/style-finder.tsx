'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { ServiceCard } from '@/components/ui/service-card'
import { questions, recommend, type Answers } from '@/lib/style-finder'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * Guided style finder.
 *
 * Five questions, one per screen. Every recommendation is a real bookable
 * service scored out of the live catalog — see lib/style-finder.ts.
 *
 * Accessibility: each step is a radiogroup, progress is announced politely, and
 * the heading is re-rendered per step so a screen reader lands on the new
 * question rather than silently swapping options underneath the user.
 */
export function StyleFinder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answers>>({})

  const done = step >= questions.length
  const current = questions[step]

  if (done) {
    const results = recommend(answers as Answers)
    return (
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
          <div>
            <p className="eyebrow">Your matches</p>
            <h2 className="mt-3 text-[length:var(--text-display-sm)] text-ink">
              {results.length > 0
                ? `${results.length} ${results.length === 1 ? 'style' : 'styles'} that fit`
                : 'Nothing quite fit'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep(0)
              setAnswers({})
            }}
            className="inline-flex h-11 items-center gap-2 border border-rule-strong px-5 text-[0.6875rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:border-ink"
          >
            <RotateCcw aria-hidden="true" className="size-3.5 stroke-[1.5]" />
            Start over
          </button>
        </div>

        <p aria-live="polite" className="sr-only">
          {results.length} styles matched your answers.
        </p>

        {results.length === 0 ? (
          <div className="py-12 text-center">
            <p className="measure mx-auto leading-relaxed text-ink-muted">
              That combination does not line up with anything on the menu — most likely
              the sitting time. Kristian’s shortest adult styles still run about three
              hours.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex h-11 items-center border border-rule-strong px-6 text-[0.6875rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:border-ink"
            >
              Browse everything instead
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => (
                <div key={r.service.slug}>
                  <ServiceCard service={r.service} />
                  {r.why.length > 0 ? (
                    <ul className="-mt-2 flex flex-wrap gap-1.5 pb-6">
                      {r.why.map((w) => (
                        <li
                          key={w}
                          className="bg-clay-100 px-2 py-0.5 text-[0.625rem] tracking-wide text-espresso-800"
                        >
                          {w}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="mt-8 border-t border-rule pt-6 text-sm text-ink-subtle">
              These are suggestions from Kristian’s real menu, not a diagnosis. If none
              feel right,{' '}
              <Link
                href="/contact"
                className="text-espresso-600 underline decoration-clay-500 underline-offset-4"
              >
                ask her
              </Link>{' '}
              — or browse{' '}
              <Link
                href="/services"
                className="text-espresso-600 underline decoration-clay-500 underline-offset-4"
              >
                all styles
              </Link>
              .
            </p>
          </>
        )}
      </div>
    )
  }

  if (!current) return null

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-4">
        <div
          className="h-px flex-1 bg-rule"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label={`Question ${step + 1} of ${questions.length}`}
        >
          <div
            className="h-px bg-espresso-600 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="shrink-0 text-xs tracking-[0.12em] text-ink-subtle uppercase">
          {step + 1} / {questions.length}
        </p>
      </div>

      <fieldset className="mt-10">
        <legend className="text-[length:var(--text-display-sm)] leading-tight text-ink">
          {current.question}
        </legend>
        {current.help ? (
          <p className="measure mt-3 text-sm leading-relaxed text-ink-muted">
            {current.help}
          </p>
        ) : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {current.options.map((opt) => {
            const selected = answers[current.id] === opt.value
            return (
              <label
                key={opt.value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 border p-4 transition-colors',
                  selected
                    ? 'border-espresso-600 bg-clay-50'
                    : 'border-rule-strong hover:border-ink hover:bg-clay-50',
                )}
              >
                <input
                  type="radio"
                  name={current.id}
                  value={opt.value}
                  checked={selected}
                  onChange={() => {
                    const next = { ...answers, [current.id]: opt.value }
                    setAnswers(next)
                    // Advance on choose — one tap per question, no extra Next.
                    window.setTimeout(() => {
                      setStep((s) => {
                        const advanced = s + 1
                        if (advanced >= questions.length) {
                          track({
                            name: 'style_finder_complete',
                            props: { matches: recommend(next as Answers).length },
                          })
                        }
                        return advanced
                      })
                    }, 140)
                  }}
                  className="mt-1 size-4 shrink-0 accent-[var(--color-espresso-600)]"
                />
                <span>
                  <span className="block text-base font-medium text-ink">{opt.label}</span>
                  {opt.detail ? (
                    <span className="mt-0.5 block text-sm leading-relaxed text-ink-subtle">
                      {opt.detail}
                    </span>
                  ) : null}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {step > 0 ? (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="mt-8 inline-flex items-center gap-2 text-sm text-ink-muted underline decoration-clay-500 underline-offset-4 hover:text-ink"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5 stroke-[1.5]" />
          Back
        </button>
      ) : null}
    </div>
  )
}
