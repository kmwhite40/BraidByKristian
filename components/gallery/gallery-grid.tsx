'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Expand } from 'lucide-react'
import { Lightbox } from './lightbox'
import { getCategoryName } from '@/lib/content'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import type { GalleryItem } from '@/lib/content/schema'
import type { CategorySlug } from '@/lib/content/schema'

/**
 * Gallery.
 *
 * A staggered, column-balanced layout rather than a uniform square grid — with
 * only a handful of photographs, a rigid 3-up grid would look like it is
 * waiting for more. This composes what exists.
 *
 * Filter chips only appear for categories that actually have photographs
 * (see lib/content/gallery.ts), so the control can never filter to an empty
 * state. Filter changes are announced to screen readers.
 */
export function GalleryGrid({
  items,
  categories,
  className,
}: {
  items: GalleryItem[]
  categories: CategorySlug[]
  className?: string
}) {
  const [filter, setFilter] = useState<CategorySlug | 'all'>('all')
  const [open, setOpen] = useState<number | null>(null)

  const visible =
    filter === 'all' ? items : items.filter((i) => i.category === filter)

  return (
    <div className={className}>
      {categories.length > 0 ? (
        <>
          <div role="group" aria-label="Filter by style" className="flex flex-wrap gap-2">
            {(['all', ...categories] as const).map((c) => {
              const active = filter === c
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(c)}
                  className={cn(
                    'h-9 border px-4 text-[0.6875rem] font-medium tracking-[0.12em] uppercase transition-colors',
                    active
                      ? 'border-espresso-600 bg-espresso-600 text-canvas'
                      : 'border-rule-strong text-ink-muted hover:border-ink hover:text-ink',
                  )}
                >
                  {c === 'all' ? 'All' : getCategoryName(c)}
                </button>
              )
            })}
          </div>
          <p aria-live="polite" className="sr-only">
            Showing {visible.length} {visible.length === 1 ? 'photo' : 'photos'}
            {filter === 'all' ? '' : ` in ${getCategoryName(filter)}`}.
          </p>
        </>
      ) : null}

      <ul
        className={cn(
          'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4',
          categories.length > 0 && 'mt-8',
        )}
      >
        {visible.map((item, i) => (
          <li
            key={item.id}
            className={cn(
              // Staggered rhythm: every third image runs tall and the first
              // spans two columns on desktop.
              i === 0 && 'lg:col-span-2 lg:row-span-2',
              i % 3 === 2 && 'lg:mt-8',
            )}
          >
            <button
              type="button"
              onClick={() => {
                setOpen(items.indexOf(item))
                track({ name: 'gallery_open', props: { item: item.id } })
              }}
              className="group relative block w-full overflow-hidden bg-clay-200 text-left"
            >
              <span
                className={cn(
                  'block',
                  i === 0 ? 'aspect-[4/5] lg:aspect-[9/10]' : 'aspect-[3/4]',
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="size-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </span>

              {/* Caption plate. Solid, not a gradient scrim. */}
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-canvas/92 px-3 py-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-ink">
                    {item.caption}
                  </span>
                  {item.category ? (
                    <span className="block text-[0.625rem] tracking-[0.1em] text-ink-subtle uppercase">
                      {getCategoryName(item.category)}
                    </span>
                  ) : null}
                </span>
                <Expand aria-hidden="true" className="size-4 shrink-0 stroke-[1.5] text-ink" />
              </span>
              <span className="sr-only">View larger: {item.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null ? (
        <Lightbox
          items={items}
          index={open}
          onClose={() => setOpen(null)}
          onIndexChange={setOpen}
        />
      ) : null}
    </div>
  )
}
