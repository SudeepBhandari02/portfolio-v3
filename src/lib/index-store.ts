import { useSyncExternalStore } from 'react'

// Whether the Index (the full-screen map of the site) is open. The top bar, the rail and the
// Index itself all need to know, so it lives here instead of in one component.
let open = false
const listeners = new Set<() => void>()

export function setIndexOpen(next: boolean) {
  if (next === open) return
  open = next
  listeners.forEach((fn) => fn())
}
export const toggleIndex = () => setIndexOpen(!open)

export function useIndexOpen() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => open,
  )
}
