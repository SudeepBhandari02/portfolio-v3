import { useSyncExternalStore } from 'react'

// Two pages, routed on the hash so the site works on any static host without rewrites.
export type Route = '/' | '/work/axionbi'

const ROUTES: Route[] = ['/', '/work/axionbi']

export function parseHash(): Route {
  const path = window.location.hash.replace(/^#/, '') || '/'
  return ROUTES.includes(path as Route) ? (path as Route) : '/'
}

let current: Route = parseHash()
const listeners = new Set<() => void>()

// Section to land on after the next route change (used by "back to work" style links).
let landing: string | null = null
export const takeLanding = () => {
  const id = landing
  landing = null
  return id
}

// The page transition owns the moment the route actually swaps. It registers itself here.
type Handler = (to: Route, commit: () => void) => void
let handler: Handler | null = null
export const setTransitionHandler = (h: Handler | null) => {
  handler = h
}

function commit(to: Route) {
  current = to
  listeners.forEach((fn) => fn())
}

function onHashChange() {
  const to = parseHash()
  if (to === current) return
  if (handler) handler(to, () => commit(to))
  else commit(to)
}
window.addEventListener('hashchange', onHashChange)

export function navigate(to: Route, opts: { scrollTo?: string } = {}) {
  landing = opts.scrollTo ?? null
  if (to === current) return
  window.location.hash = to
}

export const getRoute = () => current

export function useRoute(): Route {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => current,
  )
}
