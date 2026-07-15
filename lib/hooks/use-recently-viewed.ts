'use client'

import { useEffect } from 'react'
import { useLocalList } from './use-local-list'

const KEY = 'bbk:recently-viewed'

export function useRecentlyViewed() {
  const { items, ready, add, clear } = useLocalList(KEY, 6)
  return { recent: items, ready, add, clear }
}

/** Drop this on a service page to record the visit. Renders nothing. */
export function useTrackRecentlyViewed(slug: string) {
  const { add, ready } = useRecentlyViewed()
  useEffect(() => {
    if (ready) add(slug)
    // `add` is stable; re-running on slug change is the whole point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, ready])
}
