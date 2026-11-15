import { useRef, useState } from 'react'
import { gsap, useGSAP, reducedMotion } from '../lib/gsap'
import { setReady } from '../lib/ready'
import { scroller } from '../lib/scroll'

const COLS = 5

// First visit only: a count to 100 while fonts settle, then the black lifts off in columns.
export function Loader() {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      if (reducedMotion()) {
        setReady()
        setDone(true)
        return
      }
      scroller.lenis?.stop()
      const n = { v: 0 }
      const tl = gsap.timeline({
        onComplete: () => {
          scroller.lenis?.start()
          setDone(true)
        },
      })
      tl.to(n, {
        v: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, '0')
        },
      })
        .to('[data-l-bar]', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
        .to('[data-l-fade]', { opacity: 0, duration: 0.3, ease: 'none' }, '+=0.1')
        .to('[data-l-col]', { yPercent: -101, duration: 0.9, ease: 'cut', stagger: 0.06 }, '<0.1')
        .call(setReady, undefined, '<0.25')
    },
    { scope: root },
  )

  if (done) return null

  return (
    <div ref={root} data-chrome className="fixed inset-0 z-[100]" aria-hidden>
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLS }, (_, i) => (
          <div key={i} data-l-col className="h-full flex-1 bg-ink-0" />
        ))}
      </div>
      <div data-l-fade className="gutter absolute inset-0 flex flex-col justify-between py-6">
        <p className="t-label flex items-center gap-3 text-fg-muted">
          <span className="cell" />
          Sudeep Bhandari · Portfolio 2026
        </p>
        <div>
          <span ref={count} className="vf nums block text-[clamp(5rem,22vw,20rem)] leading-[0.8]">
            000
          </span>
          <div className="mt-6 h-px w-full bg-rule">
            <div data-l-bar style={{ transform: 'scaleX(0)' }} className="h-px origin-left bg-signal" />
          </div>
        </div>
      </div>
    </div>
  )
}
