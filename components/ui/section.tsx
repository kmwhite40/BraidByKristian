import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Layout primitives. Spacing lives here rather than being re-improvised per
 * section, which is what keeps the vertical rhythm consistent across pages.
 */

export function Container({
  className,
  children,
  size = 'default',
}: {
  className?: string
  children: React.ReactNode
  size?: 'default' | 'wide' | 'narrow'
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8',
        {
          default: 'max-w-[80rem]',
          wide: 'max-w-[92rem]',
          narrow: 'max-w-[52rem]',
        }[size],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Section({
  className,
  children,
  id,
  tone = 'canvas',
  as: Comp = 'section',
  ...rest
}: {
  className?: string
  children: React.ReactNode
  id?: string
  tone?: 'canvas' | 'sunk' | 'clay' | 'espresso'
  as?: 'section' | 'div' | 'article'
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Comp
      id={id}
      className={cn(
        'py-20 sm:py-28',
        {
          canvas: 'bg-canvas text-ink',
          sunk: 'bg-canvas-sunk text-ink',
          clay: 'bg-clay-500 text-ink',
          espresso: 'bg-espresso-800 text-canvas',
        }[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/**
 * Section heading. The eyebrow is decorative-adjacent but reads as real content
 * to a screen reader, so it stays in the flow rather than being aria-hidden —
 * it genuinely labels the section.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  as = 'h2',
  className,
  tone = 'dark',
}: {
  eyebrow?: string
  title: React.ReactNode
  lede?: React.ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  tone?: 'dark' | 'light'
}) {
  const Heading = as
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn('eyebrow mb-4', tone === 'light' && 'text-clay-300')}>
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          'text-[length:var(--text-display-md)] leading-[1.05]',
          tone === 'light' ? 'text-canvas' : 'text-ink',
        )}
      >
        {title}
      </Heading>
      {lede ? (
        <div
          className={cn(
            'measure mt-5 text-base leading-relaxed',
            tone === 'light' ? 'text-clay-100' : 'text-ink-muted',
            align === 'center' && 'mx-auto',
          )}
        >
          {lede}
        </div>
      ) : null}
    </div>
  )
}

/** Hairline divider used between editorial blocks. */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-rule', className)} />
}
