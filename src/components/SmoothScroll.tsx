import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, MOTION_REDUCED } from '../lib/gsap'
import { scroller } from '../lib/scroll'

// Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
// Skipped entirely when the user prefers reduced motion.
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Fonts change line heights, which moves every trigger. Re-measure once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    if (window.matchMedia(MOTION_REDUCED).matches) return

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
    scroller.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      scroller.lenis = null
    }
  }, [])

  return <>{children}</>
}
