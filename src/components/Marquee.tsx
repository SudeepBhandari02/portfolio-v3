import { useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/gsap'

// An endless line of type. It drifts on its own, and scrolling pushes it: faster with the scroll,
// reversing when the scroll reverses. Reduced motion gets the still line.
export function Marquee({
  children,
  speed = 60,
  dir = 1,
  className = '',
}: {
  children: ReactNode
  speed?: number // px per second at rest
  dir?: 1 | -1
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        let x = 0
        let half = track.current!.scrollWidth / 2
        let boost = 0
        let visible = false
        const measure = () => (half = track.current!.scrollWidth / 2)
        ScrollTrigger.addEventListener('refresh', measure)

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (visible = self.isActive),
          onUpdate: (self) => (boost = gsap.utils.clamp(-40, 40, self.getVelocity() / 60)),
        })

        const tick = (_t: number, dt: number) => {
          if (!visible || !half) return
          boost *= 0.92
          x -= dir * (speed * (dt / 1000) + boost)
          x = gsap.utils.wrap(-half, 0, x)
          gsap.set(track.current, { x })
        }
        gsap.ticker.add(tick)
        return () => {
          gsap.ticker.remove(tick)
          ScrollTrigger.removeEventListener('refresh', measure)
          st.kill()
        }
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`overflow-hidden ${className}`} aria-hidden>
      <div ref={track} className="marquee">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  )
}
