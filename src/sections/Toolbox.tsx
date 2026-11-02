import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { TOOLBOX } from '../lib/content'
import { Container, SectionHeader } from '../components/ui'
import { Reveal } from '../components/Reveal'

const TOOL_COUNT = TOOLBOX.reduce((n, g) => n + g.tools.length, 0)

// GROUP BY. On large screens every tool starts in one unsorted heap in the middle,
// and the scroll sorts them into their groups. Elsewhere they simply sit in their groups.
export function Toolbox() {
  const root = useRef<HTMLElement>(null)
  const board = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(`(min-width: 1024px) and (min-height: 720px) and ${MOTION_OK}`, () => {
        const tiles = gsap.utils.toArray<HTMLElement>('[data-tile]', board.current)
        const rand = gsap.utils.random(-1, 1, true)
        // Fixed jitter per tile, so the heap keeps its shape on resize.
        const jitter = tiles.map(() => ({ x: rand(), y: rand(), r: rand() }))

        // Offsets ignore transforms, so the heap can be re-measured mid animation.
        const heap = (i: number) => {
          const b = board.current!
          const t = tiles[i]
          const cx = b.clientWidth / 2
          const cy = b.clientHeight / 2
          return {
            x: cx - (t.offsetLeft + t.offsetWidth / 2) + jitter[i].x * b.clientWidth * 0.14,
            y: cy - (t.offsetTop + t.offsetHeight / 2) + jitter[i].y * b.clientHeight * 0.16,
          }
        }

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'center center',
            end: '+=110%',
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        tl.fromTo('[data-group-head]', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.7)
        tl.fromTo(
          tiles,
          {
            x: (i: number) => heap(i).x,
            y: (i: number) => heap(i).y,
            rotation: (i: number) => jitter[i].r * 14,
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            ease: 'base',
            duration: 0.6,
            stagger: { each: 0.4 / tiles.length, from: 'random' },
          },
          0.05,
        )
      })
    },
    { scope: root },
  )

  return (
    <section id="toolbox" ref={root} aria-labelledby="toolbox-title" className="py-24">
      <Container>
        <SectionHeader id="toolbox" title={<span id="toolbox-title">Toolbox</span>}>
          {TOOL_COUNT} tools, grouped by what they’re for.
        </SectionHeader>

        <Reveal>
          <div ref={board} className="relative mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {TOOLBOX.map((g) => (
              <div key={g.line}>
                <div data-group-head className="flex items-baseline justify-between gap-4 border-b border-ink-3 pb-2">
                  <h3 className="title-3">{g.category}</h3>
                  <span className="caption-4 font-mono text-fg-subtle">
                    {g.line} · {g.tools.length}
                  </span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1">
                  {g.tools.map((t) => (
                    <li
                      key={t}
                      data-tile
                      className="caption-1 border border-ink-3 bg-ink-1 px-2 py-1 font-mono text-fg-muted transition-colors duration-300 ease-base hover:border-signal hover:text-fg"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
