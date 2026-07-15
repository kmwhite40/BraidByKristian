import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Container } from './section'
import { cn } from '@/lib/utils'

/**
 * Shared page masthead. Keeps every interior page on the same vertical rhythm
 * and guarantees exactly one h1 per route.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  className,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: React.ReactNode
  breadcrumbs?: { name: string; href: string }[]
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn('border-b border-rule bg-canvas-sunk pt-10 pb-14 sm:pt-14', className)}>
      <Container>
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-subtle">
              {breadcrumbs.map((b, i) => {
                const last = i === breadcrumbs.length - 1
                return (
                  <li key={b.href} className="flex items-center gap-1.5">
                    {last ? (
                      <span aria-current="page" className="text-ink">
                        {b.name}
                      </span>
                    ) : (
                      <>
                        <Link
                          href={b.href}
                          className="underline-offset-4 transition-colors hover:text-ink hover:underline"
                        >
                          {b.name}
                        </Link>
                        <ChevronRight
                          aria-hidden="true"
                          className="size-3 stroke-[1.5] text-clay-600"
                        />
                      </>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-4 max-w-4xl text-[length:var(--text-display-lg)] leading-[1.0] text-ink">
          {title}
        </h1>
        {lede ? (
          <div className="measure mt-5 text-lg leading-relaxed text-ink-muted">{lede}</div>
        ) : null}
        {children}
      </Container>
    </div>
  )
}
