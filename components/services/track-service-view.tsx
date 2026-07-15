'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'
import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'

/**
 * Records a service view: one analytics event, plus the slug in the local
 * "recently viewed" list. Renders nothing.
 *
 * The slug and category are the only things sent. No visitor identifier.
 */
export function TrackServiceView({
  slug,
  category,
}: {
  slug: string
  category: string
}) {
  const { add, ready } = useRecentlyViewed()

  useEffect(() => {
    track({ name: 'service_view', props: { service: slug, category } })
  }, [slug, category])

  useEffect(() => {
    if (ready) add(slug)
    // `add` is stable across renders; re-running when the slug changes is intended.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, ready])

  return null
}
