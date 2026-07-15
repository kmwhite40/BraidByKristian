'use client'

import { usePathname } from 'next/navigation'
import { BookButton } from '@/components/ui/book-button'
import { useScrollPast } from '@/lib/hooks/use-scroll-past'
import { cn } from '@/lib/utils'

/**
 * Mobile sticky booking control.
 *
 * Appears once the hero is behind you, so it never covers the hero's own CTA.
 * Hidden on /book (you are already there) and on desktop, where the header CTA
 * is always visible.
 *
 * It reserves its own space via a spacer on the layout rather than floating
 * over the footer, and respects the safe-area inset on notched phones.
 */
export function StickyBookBar() {
  const pathname = usePathname()
  const scrolledPastHero = useScrollPast(640)
  const hidden = pathname === '/book'
  const visible = scrolledPastHero && !hidden

  if (hidden) return null

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-espresso-700 bg-espresso-800/97 backdrop-blur-sm',
        'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'pb-[env(safe-area-inset-bottom)] sm:hidden print:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      // While translated off-screen the bar must not be reachable by keyboard
      // or announced. React 19 takes `inert` as a real boolean.
      inert={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1 text-xs leading-tight text-clay-200">
          <span className="block font-medium text-canvas">Ready to book?</span>
          $25 deposit holds your spot
        </p>
        {/* Via BookButton so it follows `booking.mode` with every other CTA. */}
        <BookButton
          placement="sticky-mobile"
          variant="inverse"
          size="sm"
          className="h-11 shrink-0 px-5 text-xs"
        >
          Book now
        </BookButton>
      </div>
    </div>
  )
}
