'use client'

import { useEffect, useState } from 'react'

/**
 * Reads a single query param, WITHOUT `useSearchParams`.
 *
 * Why not just use `useSearchParams`? Because it opts the whole component tree
 * out of prerendering. Next then requires a <Suspense> boundary and ships only
 * the fallback in the static HTML — which on /services meant a 96px placeholder
 * instead of 47 service cards: a 0.151 CLS, nothing for a non-JS client, and
 * the catalog missing from the HTML a crawler sees first.
 *
 * This reads `window.location.search` after mount instead, so the component
 * prerenders normally and the param is applied on hydration.
 *
 * TRADE-OFF: arriving on `/services?category=locs` paints the unfiltered list
 * for one frame before the filter applies. That is a fair price for having the
 * catalog in the HTML at all, and those links are secondary entry points.
 *
 * Also listens for back/forward so the param stays in step with history.
 */
export function useQueryParam(key: string): string | null {
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    const read = () => setValue(new URLSearchParams(window.location.search).get(key))
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [key])

  return value
}
