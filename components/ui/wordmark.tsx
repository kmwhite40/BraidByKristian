import { cn } from '@/lib/utils'

/**
 * The wordmark.
 *
 * Kristian's existing logo sets "braids" in a lowercase serif with "by kristian"
 * in script across it. There is no vector original, and the raster version is
 * baked into a leopard-print flyer — unusable at UI sizes.
 *
 * So this is a typographic rebuild in the site's own faces: "braids" in Bodoni
 * Moda, "by kristian" in its italic, joined by a hairline. It keeps the
 * structure and lowercase warmth of her mark, scales cleanly to 16px, works in
 * one colour, and needs no image request.
 */
export function Wordmark({
  className,
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const scale = {
    sm: { braids: 'text-lg', by: 'text-[0.6875rem]', gap: 'gap-1.5' },
    md: { braids: 'text-2xl', by: 'text-[0.8125rem]', gap: 'gap-2' },
    lg: { braids: 'text-4xl sm:text-5xl', by: 'text-lg sm:text-xl', gap: 'gap-3' },
  }[size]

  return (
    <span
      className={cn('inline-flex items-baseline leading-none', scale.gap, className)}
    >
      <span
        className={cn(
          'font-[family-name:var(--font-display)] font-medium lowercase',
          scale.braids,
        )}
        style={{ letterSpacing: 'var(--tracking-wordmark)' }}
      >
        braids
      </span>
      <span
        aria-hidden="true"
        className="h-px w-4 shrink-0 self-center bg-current opacity-30"
      />
      <span
        className={cn(
          'font-[family-name:var(--font-display)] italic lowercase opacity-90',
          scale.by,
        )}
      >
        by kristian
      </span>
    </span>
  )
}

/**
 * Square monogram for favicons, the 404, and anywhere the full lockup would set
 * too small. A Bodoni "K" inside a hairline arch — the arch being the shape
 * every block on Kristian's flyers sits inside.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-grid size-9 place-items-center border border-current/25',
        className,
      )}
      style={{ borderRadius: '999px 999px 4px 4px' }}
      aria-hidden="true"
    >
      <span className="font-[family-name:var(--font-display)] text-lg leading-none font-medium">
        K
      </span>
    </span>
  )
}
