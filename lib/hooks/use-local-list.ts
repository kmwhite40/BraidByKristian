'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * A small list persisted to localStorage, exposed as an external store.
 *
 * `useSyncExternalStore` is the right primitive here: localStorage is external
 * state React does not own. It gives us an SSR-safe snapshot, no
 * setState-in-effect cascade, and — because we broadcast changes — two
 * components reading the same key stay in sync automatically. The old
 * useState+useEffect shape could not do that.
 *
 * `ready` is false during SSR and on the very first client render, so consumers
 * can render an inert state and avoid a hydration mismatch.
 *
 * Storage is best-effort throughout: Safari private mode throws on setItem, and
 * someone with storage disabled should still get a working site.
 */

const cache = new Map<string, string[]>()
const listeners = new Set<() => void>()
const EMPTY: string[] = []

function read(key: string, limit: number): string[] {
  // The cache is what makes getSnapshot referentially stable — returning a
  // fresh array each call would loop forever.
  const hit = cache.get(key)
  if (hit) return hit

  let value: string[] = EMPTY
  try {
    const raw = window.localStorage.getItem(key)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        value = parsed.filter((v): v is string => typeof v === 'string').slice(0, limit)
      }
    }
  } catch {
    /* unreadable or disabled storage — treat as empty */
  }
  cache.set(key, value)
  return value
}

function write(key: string, next: string[]): void {
  cache.set(key, next)
  try {
    window.localStorage.setItem(key, JSON.stringify(next))
  } catch {
    /* storage full or blocked — keep the in-memory value working */
  }
  for (const l of listeners) l()
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  // Reflect writes made in another tab.
  const onStorage = (e: StorageEvent) => {
    if (e.key) cache.delete(e.key)
    onChange()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

export function useLocalList(key: string, limit = 50) {
  const items = useSyncExternalStore(
    subscribe,
    () => read(key, limit),
    () => EMPTY, // server + first paint
  )

  // Distinguishes "server render" from "client render with an empty list".
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  const add = useCallback(
    (value: string) => {
      const next = [value, ...read(key, limit).filter((v) => v !== value)].slice(0, limit)
      write(key, next)
    },
    [key, limit],
  )

  const remove = useCallback(
    (value: string) => write(key, read(key, limit).filter((v) => v !== value)),
    [key, limit],
  )

  const toggle = useCallback(
    (value: string) => {
      const current = read(key, limit)
      write(
        key,
        current.includes(value)
          ? current.filter((v) => v !== value)
          : [value, ...current].slice(0, limit),
      )
    },
    [key, limit],
  )

  const has = useCallback((value: string) => items.includes(value), [items])

  const clear = useCallback(() => write(key, []), [key])

  return { items, ready, add, remove, toggle, has, clear }
}

/** Test-only: drops the in-memory cache so a fresh read hits storage. */
export function __resetLocalListCache() {
  cache.clear()
}
