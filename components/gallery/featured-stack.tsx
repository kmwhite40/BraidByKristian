'use client'

import { CardStack, type CardStackItem } from '@/components/ui/card-stack'
import { track } from '@/lib/analytics'
import type { GalleryItem } from '@/lib/content/schema'

/**
 * The gallery's lead: Kristian's work as a draggable fanned deck.
 *
 * Fed from lib/content/gallery.ts, so it grows automatically as real photos are
 * added — there is no second list to keep in sync. The grid below it stays as
 * the complete, filterable, lightboxable view; the deck is the hook, not a
 * replacement for it.
 */
export function FeaturedStack({ items }: { items: GalleryItem[] }) {
  if (items.length < 2) return null

  const cards: CardStackItem[] = items.map((g) => ({
    id: g.id,
    title: g.caption,
    description: g.category ?? undefined,
    src: g.src,
    width: g.width,
    height: g.height,
    alt: g.alt,
  }))

  return (
    <CardStack
      items={cards}
      label="Featured work by Kristian"
      cardWidth={340}
      cardHeight={430}
      maxVisible={5}
      onChangeIndex={(_i, item) => track({ name: 'gallery_open', props: { item: item.id } })}
    />
  )
}
