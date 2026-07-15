'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/lib/hooks/use-favorites'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * Save-to-favourites. localStorage only — no account, no server, nothing to
 * leak. Renders inert until mounted so SSR and the first client paint agree.
 */
export function FavoriteButton({
  slug,
  name,
  className,
}: {
  slug: string
  name: string
  className?: string
}) {
  const { isFavorite, toggle, ready } = useFavorites()
  const active = ready && isFavorite(slug)

  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={!ready}
      onClick={() => {
        toggle(slug)
        track({
          name: 'favorite_toggle',
          props: { service: slug, state: active ? 'off' : 'on' },
        })
      }}
      className={cn(
        'inline-grid size-9 place-items-center rounded-full transition-colors',
        'text-ink-subtle hover:bg-clay-100 hover:text-espresso-600',
        'disabled:opacity-40',
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        className={cn('size-4 stroke-[1.5]', active && 'fill-espresso-600 text-espresso-600')}
      />
      <span className="sr-only">
        {active ? `Remove ${name} from your saved styles` : `Save ${name} to your styles`}
      </span>
    </button>
  )
}
