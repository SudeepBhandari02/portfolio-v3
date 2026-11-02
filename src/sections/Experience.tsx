import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { CURRENT_ROLE, INTERNSHIP, ROUTE } from '../lib/content'
import { Container, OpLabel, StatusBadge } from '../components/ui'
import { Reveal } from '../components/Reveal'

const DEPTH_ROWS = CURRENT_ROLE.points.length + INTERNSHIP.items.length

export function Experience() {
  return (
    <section id="work" aria-labelledby="work-title">
      <Drill />
      {/* One level down. The surface is lighter so you can feel the depth. */}
      <div className="bg-ink-1 pt-12">
        <Container>
          <header className="max-w-[680px]">
            <p className="caption-4 flex items-center gap-3 font-mono text-fg-subtle">
              <span className="text-signal">↳</span> stackpro_technologies · {DEPTH_ROWS} rows
            </p>
            <h3 className="heading-4 md:heading-2 mt-6">StackPro Technologies</h3>
            <p className="body-3 mt-4 text-fg-muted">
              I joined as a full stack intern in Jun 2025 and became a Software Development Engineer in Jun 2026.
            </p>
          </header>

          <Reveal className="mt-16 grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div>
              <StatusBadge>Current</StatusBadge>
              <h4 className="heading-5 mt-4">{CURRENT_ROLE.title}</h4>
              <p className="caption-4 mt-2 font-mono text-fg-subtle">{CURRENT_ROLE.dates}</p>
            </div>
            <ol className="divide-y divide-ink-3 border-y border-ink-3">
              {CURRENT_ROLE.points.map((p) => (
                <li key={p.lead} className="grid gap-2 py-6 md:grid-cols-[200px_1fr] md:gap-6">
                  <p className="title-3">{p.lead}</p>
                  <p className="body-6 text-fg-muted">{p.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>

        <InternCursor />
      </div>
    </section>
  )
}

// The career so far as a four row table. Scrolling dims the rest and zooms into the StackPro cell
// until it fills the screen. The next block shares that cell's surface, so you land inside it.
function Drill() {
  const root = useRef<HTMLDivElement>(null)
  const target = useRef<HTMLSpanElement>(null)
  const portal = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // The target cell itself never moves or transforms, so its rect relative to the root is stable.
        const measure = () => {
          const t = target.current!.getBoundingClientRect()
          const r = root.current!.getBoundingClientRect()
          const box = { x: t.left - r.left, y: t.top - r.top, w: t.width, h: t.height }
          Object.assign(portal.current!.style, {
            left: `${box.x}px`,
            top: `${box.y}px`,
            width: `${box.w}px`,
            height: `${box.h}px`,
          })
          return box
        }
        let b = measure()

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=160%',
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              b = measure()
            },
          },
        })
        tl.to('[data-dim]', { opacity: 0.2, duration: 0.18 }, 0)
        tl.set(portal.current, { opacity: 1 }, 0.2)
        tl.fromTo(
          portal.current,
          { x: 0, y: 0, scaleX: 1, scaleY: 1 },
          {
            x: () => window.innerWidth / 2 - (b.x + b.w / 2),
            y: () => window.innerHeight / 2 - (b.y + b.h / 2),
            scaleX: () => (window.innerWidth / b.w) * 1.05,
            scaleY: () => (window.innerHeight / b.h) * 1.05,
            ease: 'power4.in',
            duration: 0.66,
          },
          0.2,
        )
        tl.fromTo('[data-arrive]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.1 }, 0.88)
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative flex h-svh min-h-[600px] flex-col justify-center overflow-hidden py-24">
      <Container>
        <div data-dim>
          <OpLabel id="work" />
          <h2 id="work-title" className="heading-4 md:heading-2 mt-6 max-w-[680px]">
            Four rows so far.
            <br />
            The last one goes deeper.
          </h2>
        </div>

        <table className="mt-12 w-full max-w-[960px] text-left">
          <thead>
            <tr data-dim className="caption-4 font-mono text-fg-subtle">
              <th scope="col" className="w-24 py-2 pr-6 font-medium md:w-40">
                year
              </th>
              <th scope="col" className="hidden py-2 pr-6 font-medium md:table-cell">
                place
              </th>
              <th scope="col" className="py-2 font-medium">
                row
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-3 border-y border-ink-3">
            {ROUTE.map((r) => (
              <tr key={r.year} data-dim={r.current ? undefined : ''}>
                <td className="caption-4 py-4 pr-6 align-top font-mono text-signal">{r.year}</td>
                <td className="body-6 hidden py-4 pr-6 align-top text-fg-muted md:table-cell">{r.place}</td>
                <td className="py-4 align-top">
                  <p className="title-4">{r.title}</p>
                  {r.current ? (
                    // The selected cell, with a spreadsheet fill handle.
                    <span
                      ref={target}
                      className="body-6 relative mt-1 -ml-2 inline-block px-2 py-0.5 text-fg outline outline-1 outline-signal"
                    >
                      {r.org}
                      <span aria-hidden className="absolute -right-1 -bottom-1 size-2 bg-signal" />
                    </span>
                  ) : (
                    <p className="body-6 mt-1 text-fg-muted">{r.org}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>

      <div ref={portal} aria-hidden className="absolute z-10 origin-center bg-ink-1 opacity-0 will-change-transform" />
      <p
        data-arrive
        aria-hidden
        className="caption-4 absolute inset-0 z-20 flex items-center justify-center gap-3 font-mono text-fg-muted opacity-0"
      >
        <span className="size-2 bg-signal" />
        stackpro_technologies · {DEPTH_ROWS} rows
      </p>
    </div>
  )
}

// The internship as a spreadsheet. On large screens the block holds still and the scroll
// moves the selection down one row at a time, like pressing the down arrow.
// The selected row's full text shows in the formula bar.
function InternCursor() {
  const root = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)
  const [on, setOn] = useState(false)

  useGSAP(
    () => {
      gsap.matchMedia().add(`(min-width: 1024px) and (min-height: 720px) and ${MOTION_OK}`, () => {
        const el = root.current!
        el.dataset.cursor = 'on'
        setOn(true)
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]', el)
        let current = -1
        const go = (i: number) => {
          if (i === current) return
          current = i
          setActive(i)
          gsap.to(cursor.current, { y: rows[i].offsetTop, duration: 0.5, ease: 'base' })
        }
        const pick = (progress: number) => go(Math.min(rows.length - 1, Math.floor(progress * rows.length)))

        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'center center',
            end: () => `+=${window.innerHeight * 2.2}`,
            pin: true,
            onUpdate: (self) => pick(self.progress),
            onRefresh: (self) => pick(self.progress),
          },
        })

        return () => {
          delete el.dataset.cursor
          setOn(false)
          setActive(0)
        }
      })
    },
    { scope: root },
  )

  const item = INTERNSHIP.items[active]

  return (
    <div ref={root} className="group/cursor bg-ink-1 py-24">
      <Container>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h4 className="heading-5">{INTERNSHIP.title}</h4>
          <p className="caption-4 font-mono text-fg-subtle">{INTERNSHIP.dates}</p>
        </div>

        {/* Formula bar: only while the cursor mode is on */}
        <div
          aria-live="polite"
          className="mt-8 hidden items-start gap-4 rounded-lg border border-ink-3 bg-ink-0 px-4 py-3 group-data-[cursor=on]/cursor:flex"
        >
          <span aria-hidden className="caption-3 w-8 shrink-0 pt-1 font-mono text-signal">
            B{active + 2}
          </span>
          <span aria-hidden className="caption-4 shrink-0 pt-1 font-mono text-fg-subtle">
            fx
          </span>
          {on && <Typed text={item.text} />}
        </div>

        <div className="relative mt-6">
          <span
            ref={cursor}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-12 outline outline-1 outline-signal group-data-[cursor=on]/cursor:block"
          >
            <span className="absolute -right-1 -bottom-1 size-2 bg-signal" />
          </span>
          <ol className="divide-y divide-ink-3 border-y border-ink-3">
            {INTERNSHIP.items.map((it, i) => (
              <li
                key={it.title}
                data-row
                className="grid gap-2 py-6 md:grid-cols-[48px_1fr] md:gap-6 lg:grid-cols-[48px_1fr_240px] group-data-[cursor=on]/cursor:h-12 group-data-[cursor=on]/cursor:items-center group-data-[cursor=on]/cursor:py-0"
              >
                <span className="caption-4 font-mono text-signal">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h5
                    className={`title-3 transition-colors duration-300 ease-base ${
                      on && i !== active ? 'text-fg-subtle' : 'text-fg'
                    }`}
                  >
                    {it.title}
                  </h5>
                  <p className="body-6 mt-2 text-fg-muted group-data-[cursor=on]/cursor:hidden">{it.text}</p>
                </div>
                <span className="caption-4 font-mono text-fg-subtle lg:text-right">{it.tags.join(' · ')}</span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </div>
  )
}

// Types a cell's contents into the formula bar.
function Typed({ text }: { text: string }) {
  const reduced = useReducedMotion()
  const [out, setOut] = useState(text)
  useEffect(() => {
    if (reduced) {
      setOut(text)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / 420)
      setOut(text.slice(0, Math.ceil(t * text.length)))
      if (t < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [text, reduced])

  return (
    <p className="body-3 min-h-12 flex-1 text-fg">
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </p>
  )
}
