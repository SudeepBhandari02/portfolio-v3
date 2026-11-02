import { useRef } from 'react'
import { motion } from 'motion/react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, MOTION_REDUCED } from '../lib/gsap'
import { createField } from '../lib/field'
import { PROFILE } from '../lib/content'
import { Container, EmailButton } from '../components/ui'
import { BASE_EASE } from '../components/Reveal'

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: BASE_EASE },
})

const gradient = 'block w-fit bg-linear-to-r from-[#ffffff] to-[#9b9b9b] bg-clip-text text-transparent'

// First scroll: you expect the page to move. It doesn't. The raw table on the right
// filters itself and sorts into a chart, and the second line of the headline comes true.
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const region = useRef<HTMLDivElement>(null)
  const line2 = useRef<HTMLSpanElement>(null)
  const cellCount = useRef<HTMLSpanElement>(null)
  const barCount = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const field = createField(canvas.current!, region.current!, (cells, bars) => {
        if (cellCount.current) cellCount.current.textContent = cells.toLocaleString('en-US')
        if (barCount.current) barCount.current.textContent = String(bars)
      })
      field.layout()
      ScrollTrigger.addEventListener('refresh', field.layout)

      // Only animate while the hero is on screen.
      const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? field.start() : field.stop()))
      io.observe(root.current!)

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const proxy = { p: 0 }
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=140%', pin: true, scrub: 0.8 },
        })
        tl.to(proxy, { p: 1, duration: 1, onUpdate: () => field.setProgress(proxy.p) }, 0)
        tl.to('[data-raw]', { opacity: 0, duration: 0.12 }, 0.02)
        tl.fromTo(line2.current, { opacity: 0.25 }, { opacity: 1, duration: 0.25 }, 0.68)
        tl.to('[data-done]', { opacity: 1, duration: 0.12 }, 0.86)
      })
      mm.add(MOTION_REDUCED, () => {
        field.setProgress(1)
        gsap.set(line2.current, { opacity: 1 })
        gsap.set('[data-raw]', { opacity: 0 })
        gsap.set('[data-done]', { opacity: 1 })
      })

      return () => {
        ScrollTrigger.removeEventListener('refresh', field.layout)
        io.disconnect()
        field.stop()
      }
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="relative h-svh min-h-[640px] overflow-hidden">
      <motion.canvas
        ref={canvas}
        aria-hidden
        className="absolute inset-0 size-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: BASE_EASE }}
      />

      <Container className="relative grid h-full grid-rows-[auto_minmax(0,1fr)] gap-12 pt-24 pb-24 lg:grid-cols-2 lg:grid-rows-1 lg:gap-16">
        <div className="flex flex-col justify-center">
          <motion.p {...enter(0)} className="title-2 text-fg-muted">
            {PROFILE.name} · {PROFILE.role}
          </motion.p>

          <motion.h1 id="hero-title" {...enter(0.08)} className="heading-3 md:heading-1 mt-4 max-w-[680px] pb-2">
            <span className={gradient}>Raw tables in.</span>
            <span ref={line2} className={`${gradient} opacity-25`}>
              Clear answers out.
            </span>
          </motion.h1>

          <motion.p {...enter(0.16)} className="body-3 mt-6 max-w-[680px] text-fg-muted">
            I’m a full stack engineer at StackPro Technologies in Bengaluru, building a BI platform and the
            semantic layer under it. Before that I moved a client from AWS to GCP, rebuilt a query engine to
            work across warehouses, and built LLM agents.
          </motion.p>

          <motion.div {...enter(0.24)} className="mt-8 flex flex-wrap items-center gap-4">
            <EmailButton />
            <p className="caption-2 text-fg-subtle">SDE 1 at StackPro since Jun 2026</p>
          </motion.div>
        </div>

        {/* The canvas draws inside this box. CSS decides where it sits at each breakpoint. */}
        <div ref={region} aria-hidden className="relative min-h-[160px] lg:my-12">
          <div className="caption-4 absolute inset-x-0 -top-8 flex justify-between gap-4 font-mono text-fg-subtle">
            <span className="grid">
              <span data-raw className="[grid-area:1/1]">
                raw_tables · <span ref={cellCount}>0</span> cells
              </span>
              <span data-done className="text-fg-muted opacity-0 [grid-area:1/1]">
                answer · <span ref={barCount}>0</span> groups
              </span>
            </span>
            <span data-raw className="flex items-center gap-2">
              Scroll to sort
              <span className="size-2 animate-caret bg-signal motion-reduce:animate-none" />
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
