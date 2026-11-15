import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/gsap'
import { setTransitionHandler, takeLanding } from '../lib/router'
import { jumpToTop, scrollToId, scroller } from '../lib/scroll'
import { updateNavTheme } from '../lib/nav-theme'

const COLS = 5

// Page change: orange columns rise from the floor, the route swaps behind them, they leave through the ceiling.
export function Transition() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cols = root.current!.querySelectorAll('[data-t-col]')
    let busy = false

    // Runs once the new page is in the DOM.
    const settle = () => {
      jumpToTop()
      ScrollTrigger.refresh()
      const id = takeLanding()
      if (id) scrollToId(id, true)
      updateNavTheme()
      document.getElementById('main')?.focus({ preventScroll: true })
    }

    setTransitionHandler((_to, commit) => {
      if (reducedMotion()) {
        commit()
        requestAnimationFrame(settle)
        return
      }
      if (busy) return
      busy = true
      scroller.lenis?.stop()
      gsap
        .timeline({
          onComplete: () => {
            busy = false
            scroller.lenis?.start()
          },
        })
        .set(root.current, { visibility: 'visible' })
        .fromTo(
          cols,
          { scaleY: 0, transformOrigin: '50% 100%' },
          { scaleY: 1, duration: 0.6, ease: 'cut', stagger: 0.05 },
        )
        .call(commit)
        // Two frames: one for React to render the new page, one for its layout effects to run.
        .to({}, { duration: 0.12 })
        .call(settle)
        .set(cols, { transformOrigin: '50% 0%' })
        .to(cols, { scaleY: 0, duration: 0.7, ease: 'cut', stagger: 0.05 })
        .set(root.current, { visibility: 'hidden' })
    })
    return () => setTransitionHandler(null)
  }, [])

  return (
    <div ref={root} data-chrome aria-hidden className="pointer-events-none invisible fixed inset-0 z-[95] flex">
      {Array.from({ length: COLS }, (_, i) => (
        <div key={i} data-t-col style={{ transform: 'scaleY(0)' }} className="h-full flex-1 bg-signal" />
      ))}
    </div>
  )
}
