'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * True once the window has scrolled past `threshold`.
 *
 * Uses `useSyncExternalStore` rather than useState + useEffect: scroll position
 * is external state that React does not own, which is exactly what this hook is
 * for. It gives us a correct SSR snapshot (false), no setState-in-effect
 * cascade, and no tearing under concurrent rendering.
 */
export function useScrollPast(threshold: number): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('scroll', onChange, { passive: true })
    return () => window.removeEventListener('scroll', onChange)
  }, [])

  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold])

  // On the server there is no scroll — always start un-scrolled so the markup
  // matches the client's first paint at the top of the page.
  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
