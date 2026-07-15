'use client'

import { useMemo, useState } from 'react'
import { useQueryParam } from '@/lib/hooks/use-query-param'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ServiceCard } from '@/components/ui/service-card'
import { getCategoryName, SIZE_LABELS } from '@/lib/content'
import { formatDuration } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Service, CategorySlug, Size } from '@/lib/content'
import type { RawCategory } from '@/lib/content/schema'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Category order' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'duration-asc', label: 'Shortest appointment' },
  { value: 'duration-desc', label: 'Longest appointment' },
]

/**
 * The full catalog, filtered client-side.
 *
 * All 47 services are server-rendered into the page, so the list is complete
 * and indexable before any JS runs, and filtering is instant with no network.
 * At this size that is strictly better than paginating.
 *
 * That property is fragile and was briefly lost: `useSearchParams` opts a
 * component out of prerendering, so Next shipped only a Suspense fallback and
 * the catalog was absent from the served HTML. Do not reintroduce it here —
 * read query params via useQueryParam instead.
 *
 * Filters offered are derived from the data — the size filter only lists sizes
 * that exist, and the hair filter only appears because some services genuinely
 * state who brings the hair. Nothing filters to a dead end silently: an empty
 * result gets a real explanation and a reset.
 */
export function ServiceCatalog({
  services,
  categories,
}: {
  services: Service[]
  categories: RawCategory[]
}) {
  // Read after mount rather than via useSearchParams — see use-query-param.ts.
  // useSearchParams would opt this component out of prerendering, and the whole
  // catalog would vanish from the served HTML.
  const categoryParam = useQueryParam('category')

  const [query, setQuery] = useState('')

  /**
   * Category is DERIVED, not synced.
   *
   * `?category=` supplies the initial value; once the visitor touches a chip,
   * their choice wins and the param stops mattering. Deriving it means no
   * effect, no cascading re-render, and no window where the two disagree.
   * (Syncing param -> state in a useEffect also trips React's
   * set-state-in-effect rule, and rightly so.)
   *
   * An unknown slug resolves to null and falls through to 'all', so a bad link
   * shows the full catalog rather than an empty grid.
   */
  const paramCategory =
    categoryParam && categories.some((c) => c.slug === categoryParam)
      ? (categoryParam as CategorySlug)
      : null
  const [chosenCategory, setCategory] = useState<CategorySlug | 'all' | null>(null)
  const category: CategorySlug | 'all' = chosenCategory ?? paramCategory ?? 'all'
  const [size, setSize] = useState<Size | 'all'>('all')
  const [hairFilter, setHairFilter] = useState<'all' | 'client' | 'not-applicable'>('all')
  const [sort, setSort] = useState<Sort>('featured')
  const [showFilters, setShowFilters] = useState(false)

  const availableSizes = useMemo(
    () =>
      Array.from(new Set(services.map((s) => s.size).filter((s): s is Size => s !== null))),
    [services],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = services.filter((s) => {
      if (category !== 'all' && s.category !== category) return false
      if (size !== 'all' && s.size !== size) return false
      if (hairFilter !== 'all' && s.hairProvidedBy !== hairFilter) return false
      if (q) {
        const haystack = `${s.name} ${getCategoryName(s.category)} ${s.notes.join(' ')}`
        if (!haystack.toLowerCase().includes(q)) return false
      }
      return true
    })

    const order = new Map(categories.map((c, i) => [c.slug, i]))
    out = out.slice().sort((a, b) => {
      switch (sort) {
        case 'price-asc':
        case 'price-desc': {
          // A quoted service has no price. Sorting it as 0 would put Freestyle
          // at the top of "price: low to high" and read as "free" — so quoted
          // services always sink to the bottom, whichever way we sort.
          const aq = a.priceMode === 'quoted'
          const bq = b.priceMode === 'quoted'
          if (aq !== bq) return aq ? 1 : -1
          if (aq && bq) return a.name.localeCompare(b.name)
          return sort === 'price-asc' ? a.price - b.price : b.price - a.price
        }
        case 'duration-asc':
          return a.durationMinutes - b.durationMinutes
        case 'duration-desc':
          return b.durationMinutes - a.durationMinutes
        default: {
          const d = (order.get(a.category) ?? 0) - (order.get(b.category) ?? 0)
          return d !== 0 ? d : b.price - a.price
        }
      }
    })
    return out
  }, [services, categories, query, category, size, hairFilter, sort])

  const activeCount =
    (category !== 'all' ? 1 : 0) +
    (size !== 'all' ? 1 : 0) +
    (hairFilter !== 'all' ? 1 : 0) +
    (query ? 1 : 0)

  const reset = () => {
    setQuery('')
    setCategory('all')
    setSize('all')
    setHairFilter('all')
    setSort('featured')
  }

  return (
    <div>
      {/* Search + sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 stroke-[1.5] text-ink-subtle"
          />
          <label htmlFor="service-search" className="sr-only">
            Search styles
          </label>
          <input
            id="service-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search knotless, boho, twists…"
            className="h-12 w-full border border-rule-strong bg-canvas-raised pr-3.5 pl-10 text-base text-ink placeholder:text-ink-subtle/70 hover:border-clay-600 focus:border-espresso-600 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <div>
            <label htmlFor="service-sort" className="sr-only">
              Sort styles
            </label>
            <select
              id="service-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-12 border border-rule-strong bg-canvas-raised px-3.5 text-sm text-ink hover:border-clay-600 focus:border-espresso-600 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="service-filters"
            className="inline-flex h-12 items-center gap-2 border border-rule-strong px-4 text-sm text-ink transition-colors hover:border-ink lg:hidden"
          >
            <SlidersHorizontal aria-hidden="true" className="size-4 stroke-[1.5]" />
            Filters
            {activeCount > 0 ? (
              <span className="grid size-5 place-items-center rounded-full bg-espresso-600 text-[0.625rem] text-canvas">
                {activeCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        id="service-filters"
        className={cn('mt-6 lg:mt-8 lg:block', !showFilters && 'hidden')}
      >
        <fieldset>
          <legend className="eyebrow mb-3">Style</legend>
          <div className="flex flex-wrap gap-2">
            {(['all', ...categories.map((c) => c.slug)] as const).map((c) => {
              const active = category === c
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c)}
                  className={cn(
                    'h-9 border px-3.5 text-[0.6875rem] font-medium tracking-[0.1em] uppercase transition-colors',
                    active
                      ? 'border-espresso-600 bg-espresso-600 text-canvas'
                      : 'border-rule-strong text-ink-muted hover:border-ink hover:text-ink',
                  )}
                >
                  {c === 'all' ? 'All styles' : getCategoryName(c)}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-6 flex flex-wrap gap-x-10 gap-y-6">
          <fieldset>
            <legend className="eyebrow mb-3">Size</legend>
            <div className="flex flex-wrap gap-2">
              {(['all', ...availableSizes] as const).map((s) => {
                const active = size === s
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSize(s)}
                    className={cn(
                      'h-9 border px-3.5 text-[0.6875rem] font-medium tracking-[0.1em] uppercase transition-colors',
                      active
                        ? 'border-espresso-600 bg-espresso-600 text-canvas'
                        : 'border-rule-strong text-ink-muted hover:border-ink hover:text-ink',
                    )}
                  >
                    {s === 'all' ? 'Any size' : SIZE_LABELS[s]}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-3">Braiding hair</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['all', 'Any'],
                  ['client', 'You bring the hair'],
                  ['not-applicable', 'No added hair'],
                ] as const
              ).map(([v, label]) => {
                const active = hairFilter === v
                return (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setHairFilter(v)}
                    className={cn(
                      'h-9 border px-3.5 text-[0.6875rem] font-medium tracking-[0.1em] uppercase transition-colors',
                      active
                        ? 'border-espresso-600 bg-espresso-600 text-canvas'
                        : 'border-rule-strong text-ink-muted hover:border-ink hover:text-ink',
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        {activeCount > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-espresso-600 underline decoration-clay-500 underline-offset-4 hover:decoration-espresso-600"
          >
            <X aria-hidden="true" className="size-3.5 stroke-[1.5]" />
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Each ServiceCard titles itself with an <h3> — correct on the homepage
          and the related-styles rail, where a section <h2> sits above them. On
          /services the <h1> is the page title and nothing else intervenes, so
          the outline jumped h1 -> h3 (axe `heading-order`). This heading is the
          missing rung, and it doubles as a real navigation target for anyone
          moving through the page by heading. */}
      <h2 className="sr-only">Matching styles</h2>

      {/* Result count — announced to screen readers as filters change. */}
      <p
        aria-live="polite"
        className="mt-8 border-t border-rule pt-5 text-sm text-ink-subtle"
      >
        {results.length === 0
          ? 'No styles match those filters.'
          : `${results.length} ${results.length === 1 ? 'style' : 'styles'}`}
        {results.length > 0 && sort.startsWith('duration')
          ? ` · ${formatDuration(Math.min(...results.map((r) => r.durationMinutes)))} – ${formatDuration(Math.max(...results.map((r) => r.durationMinutes)))}`
          : null}
      </p>

      {results.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl text-ink">
            Nothing matches that combination.
          </p>
          <p className="measure mx-auto mt-2 text-sm text-ink-muted">
            Try removing a filter, or search a style name like “knotless” or “boho”.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex h-11 items-center border border-rule-strong px-6 text-[0.6875rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:border-ink"
          >
            Show all {services.length} styles
          </button>
        </div>
      ) : (
        <div className="mt-2 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      )}
    </div>
  )
}
