import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Form primitives.
 *
 * Every field gets a real <label for>, and errors are wired through
 * aria-describedby + aria-invalid so a screen reader announces the message when
 * focus lands on the field. Errors are text, never colour alone.
 */

export function Label({
  className,
  children,
  htmlFor,
  optional,
}: {
  className?: string
  children: React.ReactNode
  htmlFor: string
  optional?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'flex items-baseline justify-between gap-2 text-sm font-medium text-ink',
        className,
      )}
    >
      <span>{children}</span>
      {optional ? (
        <span className="text-xs font-normal text-ink-subtle">Optional</span>
      ) : null}
    </label>
  )
}

const controlStyles = [
  'w-full bg-canvas-raised border border-rule-strong',
  'px-3.5 py-3 text-base text-ink',
  'placeholder:text-ink-subtle/70',
  'transition-colors duration-150',
  'hover:border-clay-600',
  'focus:border-espresso-600 focus:outline-none',
  'aria-[invalid=true]:border-espresso-800 aria-[invalid=true]:bg-clay-50',
  'disabled:opacity-50',
].join(' ')

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(controlStyles, 'h-12', className)} {...props} />
))
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(controlStyles, 'min-h-36 resize-y', className)} {...props} />
))
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(controlStyles, 'h-12 pr-9', className)} {...props}>
    {children}
  </select>
))
Select.displayName = 'Select'

export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null
  return (
    <p id={id} className="text-sm font-medium text-espresso-800">
      {children}
    </p>
  )
}

export function FieldHint({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-sm text-ink-subtle">
      {children}
    </p>
  )
}

export function Field({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('flex flex-col gap-2', className)}>{children}</div>
}
