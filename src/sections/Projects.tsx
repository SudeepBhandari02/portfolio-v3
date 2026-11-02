import { useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, MOTION_REDUCED } from '../lib/gsap'
import { FEATURED_PROJECTS, OTHER_PROJECTS } from '../lib/content'
import { rng } from '../lib/field'
import { Container, SectionHeader, StatusBadge } from '../components/ui'
import { Reveal } from '../components/Reveal'

const [WAYGO, KLYN] = FEATURED_PROJECTS

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="py-24">
      <Container>
        <SectionHeader id="projects" title={<span id="projects-title">Projects</span>}>
          Two in progress right now, and a few earlier ones.
        </SectionHeader>

        <article className="mt-24 grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          <ProjectText project={WAYGO} />
          <RouteVisual />
        </article>

        <article className="mt-24 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-center lg:gap-16">
          <div className="lg:order-2">
            <ProjectText project={KLYN}>
              <ul className="mt-6 grid gap-2">
                {KLYN.points.map((pt) => (
                  <li key={pt} className="body-6 flex gap-3 text-fg-muted">
                    <span aria-hidden className="mt-2 size-1 shrink-0 bg-signal" />
                    {pt}
                  </li>
                ))}
              </ul>
            </ProjectText>
          </div>
          <KnowledgeVisual />
        </article>

        <div className="mt-24">
          <p className="caption-4 font-mono text-fg-subtle">earlier · {OTHER_PROJECTS.length} rows</p>
          <ul className="mt-4 divide-y divide-ink-3 border-y border-ink-3">
            {OTHER_PROJECTS.map((p, i) => (
              <li key={p.name}>
                <Reveal delay={i * 0.06}>
                  <div className="grid gap-2 py-6 md:grid-cols-[240px_1fr_auto] md:items-baseline md:gap-6">
                    <h3 className="title-3">{p.name}</h3>
                    <p className="body-6 text-fg-muted">{p.text}</p>
                    <p className="caption-4 font-mono text-fg-subtle">{p.stack}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

function ProjectText({
  project,
  children,
}: {
  project: (typeof FEATURED_PROJECTS)[number]
  children?: ReactNode
}) {
  return (
    <Reveal>
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="heading-3">{project.name}</h3>
        <StatusBadge>{project.status}</StatusBadge>
      </div>
      <p className="body-3 mt-4 text-fg-muted">{project.summary}</p>
      {children}
      <p className="caption-4 mt-6 font-mono text-fg-subtle">{project.stack.join(' · ')}</p>
    </Reveal>
  )
}

// WayGo: the feature list is the route. A bus (one cell) drives it as you scroll,
// and each feature lights up when the bus reaches its stop.
const VB = { w: 640, h: 400 }
const PATH = 'M 32 344 H 160 L 224 280 V 168 L 272 120 H 416 L 464 168 V 280 L 528 344 H 608'
// Stop positions on the path, plus where each label sits relative to its stop (large screens).
const ROUTE_STOPS = [
  { x: 224, y: 224, label: 'left' },
  { x: 344, y: 120, label: 'above' },
  { x: 464, y: 224, label: 'left' },
] as const
const LABEL_POS = {
  left: 'lg:-translate-x-full lg:-translate-y-1/2 lg:pr-6 lg:text-right',
  above: 'lg:-translate-x-1/2 lg:-translate-y-full lg:pb-6 lg:text-center',
} as const

function RouteVisual() {
  const box = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const bus = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const p = path.current!
      const total = p.getTotalLength()
      const marks = gsap.utils.toArray<Element>('[data-mark]', box.current)
      const labels = gsap.utils.toArray<Element>('[data-label]', box.current)

      // Where along the path each stop sits.
      const stopAt = ROUTE_STOPS.map(({ x, y }) => {
        let best = 0
        let bestD = Infinity
        for (let l = 0; l <= total; l += 2) {
          const pt = p.getPointAtLength(l)
          const d = (pt.x - x) ** 2 + (pt.y - y) ** 2
          if (d < bestD) {
            bestD = d
            best = l
          }
        }
        return best
      })

      const place = (l: number) => {
        const s = box.current!.clientWidth / VB.w
        const pt = p.getPointAtLength(l)
        gsap.set(bus.current, { x: pt.x * s, y: pt.y * s })
        stopAt.forEach((at, i) => {
          const on = l >= at - 1
          marks[i]?.toggleAttribute('data-on', on)
          labels[i]?.toggleAttribute('data-on', on)
        })
      }

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const proxy = { l: 0 }
        gsap.to(proxy, {
          l: total,
          ease: 'none',
          onUpdate: () => place(proxy.l),
          scrollTrigger: { trigger: box.current, start: 'top 75%', end: 'bottom 35%', scrub: 0.6 },
        })
        const onRefresh = () => place(proxy.l)
        ScrollTrigger.addEventListener('refresh', onRefresh)
        place(0)
        return () => ScrollTrigger.removeEventListener('refresh', onRefresh)
      })
      mm.add(MOTION_REDUCED, () => {
        const done = () => place(total)
        done()
        ScrollTrigger.addEventListener('refresh', done)
        return () => ScrollTrigger.removeEventListener('refresh', done)
      })
    },
    { scope: box },
  )

  return (
    <div>
      <div ref={box} className="relative aspect-[8/5] w-full">
        <svg aria-hidden viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 size-full overflow-visible">
          <path ref={path} d={PATH} fill="none" stroke="#313131" strokeWidth="2" strokeLinejoin="round" />
          {[
            { x: 32, y: 344 },
            { x: 608, y: 344 },
          ].map((e) => (
            <rect key={e.x} x={e.x - 4} y={e.y - 4} width="8" height="8" fill="#9b9b9b" />
          ))}
          {ROUTE_STOPS.map((s) => (
            <rect
              key={s.x}
              data-mark
              x={s.x - 7}
              y={s.y - 7}
              width="14"
              height="14"
              strokeWidth="2"
              className="fill-ink-0 stroke-fg-subtle transition-colors duration-300 ease-base data-on:fill-signal data-on:stroke-signal"
            />
          ))}
        </svg>

        <span
          ref={bus}
          aria-hidden
          className="absolute top-0 left-0 -mt-3 -ml-3 flex size-6 items-center justify-center bg-signal will-change-transform"
        >
          <span className="size-2 bg-ink-0" />
        </span>

        <span aria-hidden className="caption-4 absolute bottom-0 left-0 font-mono text-fg-subtle">
          Board
        </span>
        <span aria-hidden className="caption-4 absolute right-0 bottom-0 font-mono text-fg-subtle">
          Arrive
        </span>

        {/* Feature labels: positioned on the map on large screens */}
        <ol className="absolute inset-0 hidden lg:block">
          {WAYGO.points.map((pt, i) => {
            const s = ROUTE_STOPS[i]
            return (
              <li
                key={pt}
                data-label
                style={{ left: `${(s.x / VB.w) * 100}%`, top: `${(s.y / VB.h) * 100}%` }}
                className={`body-6 absolute w-[200px] text-fg opacity-35 transition-opacity duration-500 ease-base data-on:opacity-100 ${LABEL_POS[s.label]}`}
              >
                <span className="caption-4 block font-mono text-signal">Stop {i + 1}</span>
                {pt}
              </li>
            )
          })}
        </ol>
      </div>

      {/* Small screens: the same stops as a list */}
      <ol className="mt-8 grid gap-4 lg:hidden">
        {WAYGO.points.map((pt, i) => (
          <li key={pt} className="body-6 flex gap-4 text-fg-muted">
            <span className="caption-4 w-12 shrink-0 font-mono text-signal">Stop {i + 1}</span>
            {pt}
          </li>
        ))}
      </ol>
    </div>
  )
}

// KLYN: a learner knowledge model. Concepts light up out of order, the way learning happens.
const COLS = 36
const CELLS = COLS * 12
// The model never finishes: by the end of the scroll about two thirds is known.
const KNOWN_AT_END = Math.round(CELLS * 0.68)
// A fixed shuffle, so concepts light up out of order but the same way every visit.
const ORDER = (() => {
  const a = Array.from({ length: CELLS }, (_, i) => i)
  const rand = rng(11)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
})()

function KnowledgeVisual() {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const cells = gsap.utils.toArray<HTMLElement>('[data-cell]', root.current)
      const show = (lit: number) => {
        ORDER.forEach((cellIndex, k) => cells[cellIndex]?.toggleAttribute('data-on', k < lit))
        if (count.current) count.current.textContent = String(lit)
      }
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top 80%',
          end: 'bottom 30%',
          onUpdate: (self) => show(Math.round(self.progress * KNOWN_AT_END)),
        })
        return () => st.kill()
      })
      mm.add(MOTION_REDUCED, () => show(KNOWN_AT_END))
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden>
      <div className="caption-4 flex items-center justify-between font-mono text-fg-subtle">
        <span>learner_knowledge_model</span>
        <span>
          known <span ref={count} className="text-fg tabular-nums">0</span> of {CELLS}
        </span>
      </div>
      <div className="mt-4 grid gap-0.5" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: CELLS }, (_, i) => (
          <span key={i} data-cell className="group relative aspect-square bg-ink-2">
            <span className="absolute inset-0 bg-signal opacity-0 transition-opacity duration-500 ease-base group-data-on:opacity-100" />
          </span>
        ))}
      </div>
    </div>
  )
}
