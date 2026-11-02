import type Lenis from 'lenis'
import { gsap } from './gsap'

// Holds the Lenis instance (null when reduced motion turns smooth scroll off).
export const scroller: { lenis: Lenis | null } = { lenis: null }

// Keeps section headers clear of the floating nav. Sections already carry 96px top padding.
const NAV_CLEARANCE = 0

const baseEase = (t: number) => gsap.parseEase('base')(t)

// Pinned sections get wrapped in a pin spacer; scroll to the spacer so we land at the start.
function scrollTarget(el: HTMLElement) {
  const parent = el.parentElement
  return parent?.classList.contains('pin-spacer') ? parent : el
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const target = scrollTarget(el)

  if (scroller.lenis) {
    scroller.lenis.start()
    scroller.lenis.scrollTo(id === 'top' ? 0 : target, { offset: NAV_CLEARANCE, duration: 1.4, easing: baseEase })
  } else {
    const y = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY + NAV_CLEARANCE
    window.scrollTo({ top: y, behavior: 'auto' })
  }

  // Move keyboard focus with the scroll, without a second jump.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
