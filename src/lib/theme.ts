import { useSyncExternalStore } from 'react'
import { reducedMotion } from './gsap'

export type Theme = 'dark' | 'light'

const root = document.documentElement
const listeners = new Set<() => void>()

export const getTheme = (): Theme => (root.dataset.theme === 'light' ? 'light' : 'dark')

function apply(next: Theme) {
  if (next === 'light') root.dataset.theme = 'light'
  else delete root.dataset.theme
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#ffffff' : '#000000')
  try {
    localStorage.setItem('theme', next)
  } catch {
    // Private windows can refuse storage. The theme still changes for this visit.
  }
  listeners.forEach((fn) => fn())
}

// Switches theme. Given a point, the new theme spreads out from it as a ripple (a view transition
// masked by an expanding ring pattern, see index.css). Without the API, or with reduced motion, it just switches.
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = getTheme() === 'light' ? 'dark' : 'light'
  if (!origin || reducedMotion() || !document.startViewTransition) {
    apply(next)
    return
  }
  const { x, y } = origin
  // Far enough to clear the farthest corner, plus the width of the ring bands that lead the edge.
  const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 240
  root.style.setProperty('--ripple-x', `${x}px`)
  root.style.setProperty('--ripple-y', `${y}px`)
  root.style.setProperty('--ripple-end', `${reach}px`)
  root.classList.add('theme-ripple')
  document.startViewTransition(() => apply(next)).finished.finally(() => root.classList.remove('theme-ripple'))
}

export function useTheme(): Theme {
  return useSyncExternalStore((fn) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, getTheme)
}
