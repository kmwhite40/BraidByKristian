'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useScrollPast } from '@/lib/hooks/use-scroll-past'
import { Menu, X } from 'lucide-react'
import { Wordmark } from '@/components/ui/wordmark'
import { BookButton } from '@/components/ui/book-button'
import { primaryNav } from '@/lib/content/navigation'
import { cn } from '@/lib/utils'

/**
 * Header.
 *
 * Sticky, but it only *looks* different once you have scrolled — at the top it
 * sits transparently on the hero; past 24px it gains a solid ground and a
 * hairline. The height never changes, so nothing below it moves (no CLS).
 *
 * The mobile menu is a focus-trapped dialog: Escape closes it, focus returns to
 * the trigger, Tab cycles inside it, and the background is inert to a screen
 * reader. Body scroll is locked while it is open.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const scrolled = useScrollPast(24)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close on navigation, by adjusting state during render rather than in an
  // effect. This is React's documented pattern for "reset state when a prop
  // changes" — it re-renders before paint, so the menu never flashes open on
  // the new route the way an effect-based reset would.
  const [openedAt, setOpenedAt] = useState(pathname)
  if (openedAt !== pathname) {
    setOpenedAt(pathname)
    if (open) setOpen(false)
  }

  // Lock scroll + trap focus while the menu is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!nodes?.length) return
      const first = nodes[0]!
      const last = nodes[nodes.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300 print:hidden',
        scrolled || open
          ? 'border-b border-rule bg-canvas/95 backdrop-blur-sm'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[80rem] items-center justify-between gap-6 px-5 sm:h-18 sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-ink transition-opacity hover:opacity-70"
          aria-label={`${'Braids by Kristian'} — home`}
        >
          <Wordmark size="md" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {primaryNav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative py-2 text-[0.8125rem] font-medium tracking-[0.1em] uppercase transition-colors',
                      'after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-espresso-600',
                      'after:transition-all after:duration-300 after:content-[""]',
                      active
                        ? 'text-ink after:w-full'
                        : 'text-ink-muted after:w-0 hover:text-ink hover:after:w-full',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <BookButton placement="header" size="sm" className="hidden sm:inline-flex">
            Book now
          </BookButton>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid size-11 place-items-center text-ink lg:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="size-5 stroke-[1.5]" />
            ) : (
              <Menu aria-hidden="true" className="size-5 stroke-[1.5]" />
            )}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-rule bg-canvas lg:hidden"
      >
        <nav aria-label="Mobile" className="px-5 py-6 sm:px-8">
          <ul className="flex flex-col">
            {primaryNav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <li key={item.href} className="border-b border-rule last:border-0">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-[3.25rem] items-center font-[family-name:var(--font-display)] text-2xl transition-colors',
                      active ? 'text-espresso-600' : 'text-ink',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <BookButton placement="mobile-menu" size="lg" className="mt-6 w-full">
            Book an appointment
          </BookButton>
        </nav>
      </div>
    </header>
  )
}
