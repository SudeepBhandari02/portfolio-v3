import type Lenis from 'lenis'
import { gsap } from './gsap'
import { getRoute, navigate } from './router'

// Holds the Lenis instance (null when reduced motion turns smooth scroll off).
export const scroller: { lenis: Lenis | null } = { lenis: null }

const cut = (t: number) => gsap.parseEase('cut')(t)

// Pinned sections get wrapped in a pin spacer; scroll to the spacer so we land at the start.
function scrollTarget(el: HTMLElement) {
  const parent = el.parentElement
  return parent?.classList.contains('pin-spacer') ? parent : el
}

export function jumpToTop() {
  if (scroller.lenis) scroller.lenis.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id)
  if (!el) return
  const target = scrollTarget(el)

  if (scroller.lenis) {
    scroller.lenis.start()
    scroller.lenis.scrollTo(id === 'top' ? 0 : target, { duration: 1.4, easing: cut, immediate, force: true })
  } else {
    const y = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: y, behavior: 'auto' })
  }

  // Move keyboard focus with the scroll, without a second jump.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

// Section links work from any page: on the case study they go home first, then land on the section.
export function goToSection(id: string) {
  if (getRoute() === '/') scrollToId(id)
  else navigate('/', { scrollTo: id })
}
