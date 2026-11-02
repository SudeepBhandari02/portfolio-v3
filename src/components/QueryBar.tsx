import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { STOPS } from '../lib/content'
import { ScrollTrigger } from '../lib/gsap'
import { setActiveStop, useActiveStop } from '../lib/active-stop'
import { QueryText } from './ui'

// Fixed console at the bottom of the screen. It types the operation the current section runs,
// and it is what tells the nav which section is current.
export function QueryBar() {
  const active = useActiveStop()
  const reduced = useReducedMotion()
  const query = STOPS[active].query
  const [shown, setShown] = useState<string>(query)

  // Current section: the last one whose top has passed the middle of the screen.
  // Pinned sections sit at top 0 while pinned, so they count as current for their whole run.
  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight * 0.5
      let idx = 0
      STOPS.forEach(({ id }, i) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= mid) idx = i
      })
      setActiveStop(idx)
    }
    update()
    // ScrollTrigger batches scroll work through requestAnimationFrame (B7).
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: update })
    return () => st.kill()
  }, [])

  // Type the new query in, character by character.
  useEffect(() => {
    if (reduced) {
      setShown(query)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const duration = Math.min(520, query.length * 18)
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / duration)
      setShown(query.slice(0, Math.ceil(t * query.length)))
      if (t < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [query, reduced])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="caption-4 flex max-w-full items-center gap-3 rounded-full border border-ink-3 bg-ink-1/80 px-4 py-2 font-mono text-fg-muted backdrop-blur-xl">
        <span className="text-signal">›</span>
        <span className="truncate whitespace-pre">
          <QueryText text={shown} />
        </span>
        <span className="h-3 w-2 shrink-0 animate-caret bg-signal motion-reduce:animate-none" />
        <span className="h-3 w-px shrink-0 bg-ink-4" />
        <span className="shrink-0 text-fg-subtle tabular-nums">
          {String(active + 1).padStart(2, '0')}/{String(STOPS.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
