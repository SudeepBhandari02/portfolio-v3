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

// Firefox-based browsers do not render the masked view-transition ripple (see index.css), so they
// get the disc below instead, as does any browser without View Transitions.
const isFirefox = /Firefox\//.test(navigator.userAgent)

// Fallback ripple: a disc in the new theme's background grows from the origin over the untouched
// old page, and the theme is swapped once the disc covers the screen. Uses only clip-path animation.
function discRipple(origin: { x: number; y: number }, reach: number, next: Theme) {
  const { x, y } = origin
  const disc = document.createElement('div')
  disc.setAttribute('aria-hidden', 'true')
  disc.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;background:${next === 'light' ? '#ffffff' : '#000000'}`
  document.body.append(disc)
  const shape = (r: number) => `circle(${r}px at ${x}px ${y}px)`
  const anim = disc.animate([{ clipPath: shape(0) }, { clipPath: shape(reach) }], {
    duration: 1500,
    easing: 'cubic-bezier(0.22, 0.61, 0.24, 1)',
    fill: 'forwards',
  })
  // The disc is still covering the screen when the theme is swapped, so there is no flash.
  anim.onfinish = () => {
    apply(next)
    disc.remove()
  }
}

// Switches theme. Given a point, the new theme spreads out from it as a ripple (a view transition
// masked by an expanding ring pattern, see index.css; on Firefox, a growing disc instead).
// Without the API, or with reduced motion, it just switches.
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = getTheme() === 'light' ? 'dark' : 'light'
  if (!origin || reducedMotion() || (!document.startViewTransition && !isFirefox)) {
    apply(next)
    return
  }
  const { x, y } = origin
  // Far enough to clear the farthest corner, plus the width of the ring bands that lead the edge.
  const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 240
  if (isFirefox || !document.startViewTransition) {
    discRipple(origin, reach, next)
    return
  }
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
