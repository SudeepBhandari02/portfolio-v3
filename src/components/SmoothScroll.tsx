import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/gsap'
import { scroller } from '../lib/scroll'
import { updateNavTheme } from '../lib/nav-theme'

// Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
// Skipped entirely when the user prefers reduced motion.
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Fonts change line heights, which moves every trigger. Re-measure once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    window.addEventListener('scroll', updateNavTheme, { passive: true })
    window.addEventListener('resize', updateNavTheme)
    updateNavTheme()

    let cleanup = () => {}
    if (!reducedMotion()) {
      const lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
      scroller.lenis = lenis
      lenis.on('scroll', ScrollTrigger.update)

      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      cleanup = () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        scroller.lenis = null
      }
    }

    return () => {
      window.removeEventListener('scroll', updateNavTheme)
      window.removeEventListener('resize', updateNavTheme)
      cleanup()
    }
  }, [])

  return <>{children}</>
}
