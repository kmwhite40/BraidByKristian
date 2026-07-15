'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * CardStack — a 3D fanned deck of photographs you can drag, click or arrow
 * through.
 *
 * Adapted from a generic shadcn-style card-stack to this codebase:
 *   - `motion/react`, not `framer-motion` (this project uses the renamed package)
 *   - `next/image` with real intrinsic sizes, rather than a plain img element:
 *     these are the heaviest assets on the page, so CLS and AVIF/WebP matter
 *   - this site's tokens (canvas/clay/espresso/ink). The original's
 *     `bg-foreground` / `text-muted-foreground` / `bg-secondary` do not exist
 *     here and would have rendered unstyled
 *   - square-ish corners and a hairline border rather than rounded-2xl +
 *     shadow-xl + a gradient scrim, to match the editorial system
 *   - no autoplay. An auto-advancing carousel of a stylist's portfolio moves
 *     work out of view before you have looked at it, and auto-advance without a
 *     pause control fails WCAG 2.2.2. Navigation is entirely user-driven.
 *
 * Accessibility:
 *   - the deck is a labelled group with `aria-roledescription="carousel"`
 *   - Left/Right arrows move the deck when it has focus
 *   - dots are real buttons carrying `aria-current`
 *   - the active card's caption is announced politely on change
 *   - inactive cards are `inert`, so a screen reader and the tab order only
 *     ever see the card on top of the deck
 *   - with reduced motion the deck lays out flat and swaps instantly
 */

export type CardStackItem = {
  id: string
  title: string
  description?: string
  src: string
  width: number
  height: number
  alt: string
  href?: string
}

export type CardStackProps = {
  items: CardStackItem[]
  initialIndex?: number
  /** How many cards show either side of the active one. */
  maxVisible?: number
  /**
   * Nominal width. Cards do NOT all use it — each one takes its own
   * photograph's aspect ratio (see `cardWidthFor`). This value only drives the
   * fan spacing and the swipe threshold, so the deck stays evenly spaced
   * whatever mix of portraits and landscapes it holds.
   */
  cardWidth?: number
  /** Uniform card height. This is what makes the fan read as one deck. */
  cardHeight?: number
  /** Stops a landscape photo from dominating the deck. */
  maxCardWidth?: number
  /** 0..0.8 — higher packs the fan tighter. */
  overlap?: number
  /** Total fan angle in degrees. */
  spreadDeg?: number
  loop?: boolean
  className?: string
  label?: string
  onChangeIndex?: (index: number, item: CardStackItem) => void
}

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0
  return ((n % len) + len) % len
}

/** Shortest signed distance from `active` to `i`, wrapping when looped. */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active
  if (!loop || len <= 1) return raw
  const alt = raw > 0 ? raw - len : raw + len
  return Math.abs(alt) < Math.abs(raw) ? alt : raw
}

export function CardStack({
  items,
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 380,
  cardHeight = 480,
  maxCardWidth = 440,
  overlap = 0.52,
  spreadDeg = 26,
  loop = true,
  className,
  label = 'Photo gallery',
  onChangeIndex,
}: CardStackProps) {
  const reduceMotion = useReducedMotion()
  const len = items.length
  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len))

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2))
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)))
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0

  const CAPTION_H = 52
  const imageAreaHeight = cardHeight - CAPTION_H

  /**
   * Each card takes its own photograph's width at the shared height, so the
   * image is shown whole with no crop AND no letterbox mat.
   *
   * The alternative — one fixed card shape — forced a choice between cropping
   * (which cut 41% off the portraits) and matting (which left the deck mostly
   * empty backdrop), because these sources range from 0.47 to 0.87. Varying
   * widths at a constant height is what a real fan of prints looks like anyway.
   */
  const cardWidthFor = (item: CardStackItem) =>
    Math.round(
      Math.min(maxCardWidth, (imageAreaHeight * item.width) / item.height),
    )

  const go = React.useCallback(
    (delta: number) => {
      setActive((a) => {
        const next = loop
          ? wrapIndex(a + delta, len)
          : Math.min(Math.max(a + delta, 0), len - 1)
        const item = items[next]
        if (item) onChangeIndex?.(next, item)
        return next
      })
    },
    [items, len, loop, onChangeIndex],
  )

  if (len === 0) return null
  const activeItem = items[active]!

  return (
    <div className={cn('w-full', className)}>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            go(-1)
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            go(1)
          }
        }}
        // `overflow-hidden` is load-bearing, not cosmetic: the fanned outer
        // cards are translated well past the stage on purpose, and without
        // clipping they push the document's scroll width past the viewport and
        // the whole page scrolls sideways on a 360px phone.
        className="relative w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-espresso-600"
        style={{ height: cardHeight + 64, perspective: 1200 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {items.map((item, i) => {
            const off = signedOffset(i, active, len, loop)
            const abs = Math.abs(off)
            if (abs > maxOffset) return null

            const isActive = off === 0
            // Reduced motion: no fan, no tilt — just the active card.
            const x = reduceMotion ? 0 : off * cardSpacing
            const rotate = reduceMotion ? 0 : off * stepDeg
            const scale = reduceMotion ? 1 : isActive ? 1 : 0.92
            const y = reduceMotion ? 0 : abs * 8

            if (reduceMotion && !isActive) return null

            return (
              <motion.div
                key={item.id}
                className={cn(
                  'absolute overflow-hidden border border-rule-strong bg-clay-200',
                  'will-change-transform select-none',
                  isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
                )}
                style={{
                  // Per-photo width at the shared height — the card is the
                  // print, so nothing is cropped and nothing is matted.
                  width: cardWidthFor(item),
                  height: cardHeight,
                  zIndex: 100 - abs,
                  // The brand arch. Kept shallower than the flyers' full
                  // semicircle so the rotated outer cards still read as arches
                  // rather than petals.
                  borderRadius: '6rem 6rem 2px 2px',
                }}
                animate={{ x, y, rotate, scale, opacity: 1 }}
                initial={false}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 260, damping: 30 }
                }
                // Only the top card is interactive; the rest are decorative and
                // must stay out of the tab order and the a11y tree.
                inert={!isActive}
                aria-hidden={!isActive}
                onClick={() => {
                  if (!isActive) {
                    setActive(i)
                    onChangeIndex?.(i, item)
                  }
                }}
                {...(isActive && !reduceMotion
                  ? {
                      drag: 'x' as const,
                      dragConstraints: { left: 0, right: 0 },
                      dragElastic: 0.16,
                      onDragEnd: (
                        _e: unknown,
                        info: { offset: { x: number }; velocity: { x: number } },
                      ) => {
                        const threshold = Math.min(140, cardWidth * 0.22)
                        if (info.offset.x > threshold || info.velocity.x > 600) go(-1)
                        else if (info.offset.x < -threshold || info.velocity.x < -600)
                          go(1)
                      },
                    }
                  : {})}
              >
                {/* MATTED, NOT CROPPED.
                    `object-contain` shows each photograph whole. `object-cover`
                    was throwing away 41% of the height on the portraits, and
                    because the subjects sit mid-frame (not at the top), an
                    `object-top` crop kept the empty backdrop and cut the face
                    off at the chin.
                    Letterboxing onto a clay mat also means a deck of
                    mixed-aspect photos stays uniform without anyone hand-tuning
                    a focal point per image — drop a new photo in and it fits. */}
                <div className="flex h-full flex-col">
                  <div className="min-h-0 flex-1 bg-clay-100">
                    <Image
                      src={item.src}
                      alt={isActive ? item.alt : ''}
                      width={item.width}
                      height={item.height}
                      draggable={false}
                      sizes={`${maxCardWidth}px`}
                      priority={abs <= 1}
                      // The card is already this photo's aspect ratio, so
                      // object-cover fills it exactly and crops nothing. It
                      // stays as `cover` only to absorb sub-pixel rounding in
                      // cardWidthFor.
                      className="pointer-events-none size-full object-cover"
                    />
                  </div>
                  {/* Caption sits below the photo on a solid plate, so it can
                      never cover the subject. No gradient scrim — the scrim is
                      the tell, and solid keeps the text contrast real. */}
                  {isActive ? (
                    <div className="shrink-0 border-t border-rule bg-canvas px-4 py-3">
                      <p className="truncate text-sm font-medium text-ink">{item.title}</p>
                      {item.description ? (
                        <p className="mt-0.5 truncate text-xs text-ink-subtle">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={!loop && active === 0}
          className="grid size-11 place-items-center border border-rule-strong text-ink transition-colors hover:border-ink hover:bg-clay-50 disabled:opacity-35"
        >
          <ChevronLeft aria-hidden="true" className="size-4 stroke-[1.5]" />
          <span className="sr-only">Previous photo</span>
        </button>

        <ul className="flex items-center gap-2">
          {items.map((item, i) => {
            const on = i === active
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={on ? 'true' : undefined}
                  onClick={() => {
                    setActive(i)
                    onChangeIndex?.(i, item)
                  }}
                  className="grid size-6 place-items-center"
                >
                  <span
                    className={cn(
                      'block size-1.5 rounded-full transition-colors',
                      on ? 'bg-espresso-600' : 'bg-clay-600/40 hover:bg-clay-700',
                    )}
                  />
                  <span className="sr-only">
                    Show {item.title} ({i + 1} of {len})
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={!loop && active === len - 1}
          className="grid size-11 place-items-center border border-rule-strong text-ink transition-colors hover:border-ink hover:bg-clay-50 disabled:opacity-35"
        >
          <ChevronRight aria-hidden="true" className="size-4 stroke-[1.5]" />
          <span className="sr-only">Next photo</span>
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {activeItem.title}, photo {active + 1} of {len}.
      </p>
    </div>
  )
}
