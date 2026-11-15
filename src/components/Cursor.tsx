import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsap'

// A square that trails the pointer. Over anything marked data-cursor="Label" it opens into a tile
// carrying that label. The native cursor stays; this is company, not a replacement.
export function Cursor() {
  const el = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion()) return
    const node = el.current!
    const xTo = gsap.quickTo(node, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(node, 'y', { duration: 0.5, ease: 'power3' })
    let shown = false
    let current: string | null = null

    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      if (!shown) {
        shown = true
        gsap.set(node, { x: e.clientX, y: e.clientY })
        gsap.to(node, { opacity: 1, duration: 0.3 })
      }
    }
    const over = (e: Event) => {
      // On an orange surface the square turns black so it never disappears.
      const ink = !!(e.target as Element).closest?.('[data-nav="ink"]')
      if (node.dataset.ink !== String(ink)) node.dataset.ink = String(ink)
      const next = (e.target as Element).closest?.<HTMLElement>('[data-cursor]')?.dataset.cursor ?? null
      if (next === current) return
      current = next
      if (next) {
        label.current!.textContent = next
        gsap.to(node, { width: 84, height: 84, duration: 0.5, ease: 'soft' })
        gsap.to(label.current, { opacity: 1, duration: 0.2, delay: 0.1 })
      } else {
        gsap.to(label.current, { opacity: 0, duration: 0.1, overwrite: true })
        gsap.to(node, { width: 10, height: 10, duration: 0.4, ease: 'soft' })
      }
    }
    const leave = () => {
      shown = false
      current = null
      gsap.to(label.current, { opacity: 0, duration: 0.1, overwrite: true })
      gsap.to(node, { opacity: 0, width: 10, height: 10, duration: 0.2 })
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('mouseover', over)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('mouseover', over)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <div
      ref={el}
      data-chrome
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] grid size-[10px] -translate-x-1/2 -translate-y-1/2 place-items-center bg-signal text-black opacity-0 transition-colors duration-200 data-[ink=true]:bg-black data-[ink=true]:text-signal"
    >
      <span ref={label} className="t-label text-[0.6875rem] opacity-0" />
    </div>
  )
}
