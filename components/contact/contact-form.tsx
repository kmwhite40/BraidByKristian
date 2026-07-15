'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldHint, Input, Label, Select, Textarea } from '@/components/ui/field'
import { contactSchema, type ContactInput, type ContactResponse } from '@/lib/validation/contact'
import { categories, getServicesByCategory } from '@/lib/content'
import { track } from '@/lib/analytics'

type Status = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Contact form.
 *
 * Validation is the same Zod schema the API route uses, so the two can never
 * disagree. The server re-validates regardless.
 *
 * Accessibility:
 *   - every input has a real <label for>
 *   - errors are wired via aria-describedby + aria-invalid, announced on blur
 *   - the form-level result is a role="status" live region, so success and
 *     failure are both announced, not just colour-coded
 *   - the submit button reports its busy state via aria-busy rather than only
 *     changing its label
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (values: ContactInput) => {
    setStatus('submitting')
    setServerError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data: ContactResponse = await res.json()

      if (!res.ok || !data.ok) {
        setServerError(
          'error' in data ? data.error : 'Something went wrong. Please try again.',
        )
        setStatus('error')
        track({ name: 'contact_form_submit', props: { status: 'error' } })
        return
      }

      setStatus('success')
      reset()
      track({ name: 'contact_form_submit', props: { status: 'success' } })
    } catch {
      setServerError(
        'Could not reach the server. Please check your connection, or call Kristian directly.',
      )
      setStatus('error')
      track({ name: 'contact_form_submit', props: { status: 'error' } })
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="border border-espresso-600 bg-clay-50 p-8 text-center">
        <CheckCircle2
          aria-hidden="true"
          className="mx-auto size-8 stroke-[1.25] text-espresso-600"
        />
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-ink">
          Message sent
        </h2>
        <p className="measure mx-auto mt-2 text-sm leading-relaxed text-ink-muted">
          Kristian will get back to you. If it is time-sensitive, a call or a DM will
          always reach her faster.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus('idle')}
          type="button"
        >
          Send another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Honeypot. aria-hidden + tabIndex -1 keeps it away from screen readers
          and the keyboard; only a bot filling every field will trip it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company (leave this blank)</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          <FieldError id="name-error">{errors.name?.message}</FieldError>
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          <FieldError id="email-error">{errors.email?.message}</FieldError>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <Label htmlFor="phone" optional>
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
            {...register('phone')}
          />
          {errors.phone ? (
            <FieldError id="phone-error">{errors.phone.message}</FieldError>
          ) : (
            <FieldHint id="phone-hint">Fastest way for Kristian to reach you.</FieldHint>
          )}
        </Field>

        <Field>
          <Label htmlFor="service" optional>
            Style you are asking about
          </Label>
          <Select id="service" defaultValue="" {...register('service')}>
            <option value="">Not sure yet</option>
            {categories.map((c) => (
              <optgroup key={c.slug} label={c.name}>
                {getServicesByCategory(c.slug).map((s) => (
                  <option key={s.slug} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>
      </div>

      <Field>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="What are you thinking? If you have a length, size or date in mind, mention it here."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
        <FieldError id="message-error">{errors.message?.message}</FieldError>
      </Field>

      {status === 'error' && serverError ? (
        <div
          role="alert"
          className="flex items-start gap-3 border border-espresso-800 bg-clay-50 p-4"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 stroke-[1.5] text-espresso-800"
          />
          <p className="text-sm leading-relaxed text-ink">{serverError}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <Loader2 aria-hidden="true" className="animate-spin" />
              Sending
            </>
          ) : (
            'Send message'
          )}
        </Button>
        <p className="text-xs text-ink-subtle">
          Booking happens on the scheduler — this form is for questions.
        </p>
      </div>
    </form>
  )
}
