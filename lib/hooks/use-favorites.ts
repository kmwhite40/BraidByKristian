'use client'

import { useLocalList } from './use-local-list'

const KEY = 'bbk:favorites'

export function useFavorites() {
  const { items, ready, toggle, remove, has, clear } = useLocalList(KEY, 40)
  return {
    favorites: items,
    ready,
    isFavorite: has,
    toggle,
    remove,
    clear,
  }
}
