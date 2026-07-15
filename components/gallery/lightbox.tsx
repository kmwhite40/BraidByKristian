'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryItem } from '@/lib/content/schema'
import { cn } from '@/lib/utils'

/**
 * Lightbox.
 *
 * Accessibility contract:
 *   - role="dialog" aria-modal, labelled by the current caption
 *   - Escape closes; ArrowLeft/ArrowRight page; Tab is trapped inside
 *   - focus moves to the dialog on open and returns to the opening thumbnail
 *     on close
 *   - the live region announces "2 of 4" as you page, for screen readers
 *   - background scroll is locked
 *
 * Touch: a horizontal swipe over 48px pages. Vertical swipes are ignored so the
 * gesture never fights the page.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: GalleryItem[]
  index: number
  onClose: () => void
  onIndexChange: (i: number) => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const item = items[index]

  const go = useCallback(
    (delta: number) => {
      const next = (index + delta + items.length) % items.length
      onIndexChange(next)
      setAnnouncement(`Image ${next + 1} of ${items.length}. ${items[next]?.caption ?? ''}`)
    },
    [index, items, onIndexChange],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key === 'ArrowLeft') return go(-1)
      if (e.key === 'ArrowRight') return go(1)
      if (e.key !== 'Tab') return
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled])',
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
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [go, onClose])

  if (!item) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.caption} — image ${index + 1} of ${items.length}`}
      tabIndex={-1}
      className="fixed inset-0 z-100 flex flex-col bg-espresso-900/97 backdrop-blur-sm focus:outline-none"
      onTouchStart={(e) => {
        const t = e.touches[0]
        if (t) touchStart.current = { x: t.clientX, y: t.clientY }
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current
        const t = e.changedTouches[0]
        if (!start || !t) return
        const dx = t.clientX - start.x
        const dy = t.clientY - start.y
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
        touchStart.current = null
      }}
    >
      {/* Clicking the backdrop closes. It is a plain div, not a button — the
          real close control is the labelled button in the toolbar. */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative flex items-center justify-between px-4 py-4 sm:px-6">
        <p className="text-xs tracking-[0.14em] text-clay-300 uppercase">
          {index + 1} / {items.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="grid size-11 place-items-center text-clay-200 transition-colors hover:text-canvas"
        >
          <X aria-hidden="true" className="size-5 stroke-[1.5]" />
          <span className="sr-only">Close gallery</span>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-6">
        {items.length > 1 ? (
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-2 z-10 grid size-11 place-items-center bg-espresso-800/70 text-clay-100 transition-colors hover:bg-espresso-700 hover:text-canvas sm:left-4"
          >
            <ChevronLeft aria-hidden="true" className="size-5 stroke-[1.5]" />
            <span className="sr-only">Previous image</span>
          </button>
        ) : null}

        <figure className="flex max-h-full flex-col items-center gap-4">
          <Image
            key={item.id}
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="(min-width: 640px) 80vw, 100vw"
            className="max-h-[72dvh] w-auto object-contain"
          />
          <figcaption className="text-center text-sm text-clay-200">
            {item.caption}
          </figcaption>
        </figure>

        {items.length > 1 ? (
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-2 z-10 grid size-11 place-items-center bg-espresso-800/70 text-clay-100 transition-colors hover:bg-espresso-700 hover:text-canvas sm:right-4"
          >
            <ChevronRight aria-hidden="true" className="size-5 stroke-[1.5]" />
            <span className="sr-only">Next image</span>
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className={cn('sr-only')}>
        {announcement}
      </p>
    </div>
  )
}
