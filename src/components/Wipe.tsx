import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'

const COLS = 8

// The seam between two surfaces. Columns of the next surface's color grow up from the floor of
// the current one as you scroll, so one field is cut into the next instead of ending in a line.
// Place it as the last child of a `relative` section.
export function Wipe({ to }: { to: 'ink' | 'signal' }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-w-col]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            stagger: { each: 0.12, from: 'random' },
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.4 },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      aria-hidden
      // Reduced motion: the columns stay flat and the surface simply ends.
      className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[45vh]"
    >
      {Array.from({ length: COLS }, (_, i) => (
        <div
          key={i}
          data-w-col
          data-nav={to === 'signal' ? 'ink' : 'paper'}
          // Inline transform, not a Tailwind scale class: GSAP owns `transform`, and a CSS `scale` would multiply with it.
          style={{ transform: 'scaleY(0)' }}
          className={`h-full flex-1 origin-bottom ${to === 'signal' ? 'bg-signal' : 'bg-ink-0'}`}
        />
      ))}
    </div>
  )
}
