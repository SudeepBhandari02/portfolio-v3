import { useSyncExternalStore } from 'react'

// Tiny store for "which stop is the reader at". Written by the QueryBar, read by the Nav.
let active = 0
const listeners = new Set<() => void>()

export function setActiveStop(index: number) {
  if (index === active) return
  active = index
  listeners.forEach((l) => l())
}

export function useActiveStop() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => active,
  )
}
