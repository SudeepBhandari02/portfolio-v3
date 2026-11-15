import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { AXION } from '../lib/content'
import { Label } from '../components/ui'

const { wrong, right, gap, captions } = AXION.problem

// A number where the digits that differ between `from` and `to` can roll from one to the other.
function Figure({ from, to, id }: { from: string; to: string; id: string }) {
  return (
    <span className="nums font-mono text-[clamp(1.75rem,5.6vw,5.5rem)] leading-none tracking-[-0.04em]" aria-hidden>
      <span className="text-[0.5em] tracking-normal text-fg-muted">US$</span>
      {from.split('').map((ch, i) =>
        ch === to[i] ? (
          <span key={i}>{ch}</span>
        ) : (
          <span key={i} className="roll" data-diff={id}>
            <span data-roll={id}>
              <span>{ch}</span>
              <span>{to[i]}</span>
            </span>
          </span>
        ),
      )}
    </span>
  )
}

// The case in one held frame. Two dashboards answer "revenue" with two numbers. The digits that
// disagree light up, the gap is named, the rule is written once, and the wrong number rolls into the right one.
// Figures come from the product's demo warehouse.
export function Problem() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const caps = gsap.utils.toArray<HTMLElement>('[data-cap]')
        gsap.set(caps.slice(1), { opacity: 0, yPercent: 60 })
        gsap.set(['[data-gap]', '[data-rule]'], { opacity: 0, y: 24 })
        gsap.set('[data-title-b]', { opacity: 0 })
        gsap.set('[data-step]', { scaleX: 0, transformOrigin: 'left' })

        const swap = (tl: gsap.core.Timeline, i: number, at: number) =>
          tl
            .to(caps[i - 1], { opacity: 0, yPercent: -60, duration: 0.25, ease: 'power2.in' }, at)
            .to(caps[i], { opacity: 1, yPercent: 0, duration: 0.35, ease: 'power2.out' }, at + 0.2)

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: stage.current, start: 'top top', end: '+=320%', pin: true, scrub: 0.6 },
        })
        // 1 → 2: the digits that differ, and what the difference is
        tl.to('[data-diff="a"]', { '--hot': 1, duration: 0.3 }, 0.5)
          .to('[data-step="0"]', { scaleX: 1, duration: 1 }, 0)
        swap(tl, 1, 1)
        tl.to('[data-gap]', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 1.2)
          .to('[data-step="1"]', { scaleX: 1, duration: 1 }, 1)
        // 2 → 3: the definition
        swap(tl, 2, 2)
        tl.to('[data-gap]', { opacity: 0, y: -16, duration: 0.25 }, 2)
          .to('[data-rule]', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.2)
          .to('[data-step="2"]', { scaleX: 1, duration: 1 }, 2)
        // 3 → 4: the roll
        swap(tl, 3, 3)
        tl.to('[data-roll="a"]', { yPercent: -50, duration: 0.6, ease: 'power3.inOut', stagger: 0.05 }, 3.1)
          .to('[data-diff="a"]', { '--hot': 0, duration: 0.3 }, 3.7)
          .to('[data-title-a]', { opacity: 0, duration: 0.2 }, 3.2)
          .to('[data-title-b]', { opacity: 1, duration: 0.2 }, 3.4)
          .to('[data-step="3"]', { scaleX: 1, duration: 1 }, 3)
          .to({}, { duration: 0.3 })
      })
    },
    { scope: root },
  )

  return (
    <section id="problem" ref={root} aria-labelledby="problem-title" className="rule-t relative">
      <div ref={stage} className="gutter relative flex min-h-svh flex-col justify-between pt-[14vh] pb-8">
        <div className="grid grid-cols-12 gap-x-4">
          <div className="col-span-12 md:col-span-3">
            <Label index="01">The problem</Label>
          </div>
          {/* Captions share one slot. Without motion they simply stack and read top to bottom. */}
          <h2 id="problem-title" className="col-span-12 mt-6 grid md:col-span-9 md:mt-0">
            {captions.map((c, i) => (
              <span key={c} data-cap className="t-h2 motion-safe:[grid-area:1/1] motion-reduce:mb-2 motion-reduce:block">
                {i === captions.length - 1 ? <span className="text-signal">{c}</span> : c}
              </span>
            ))}
          </h2>
        </div>

        <div className="my-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { id: 'a', board: 'Sales overview', from: wrong, to: right },
            { id: 'b', board: 'Board pack', from: right, to: right },
          ].map((t) => (
            <figure key={t.id} className="relative border border-rule p-5 md:p-8">
              <figcaption className="t-label flex items-center justify-between text-fg-muted">
                <span className="grid">
                  <span data-title-a className="[grid-area:1/1]">
                    Revenue
                  </span>
                  <span data-title-b className="[grid-area:1/1] text-fg motion-reduce:hidden">
                    Net revenue
                  </span>
                </span>
                <span>{t.board}</span>
              </figcaption>
              <p className="mt-8 md:mt-14">
                <span className="sr-only">US${t.from}</span>
                <Figure from={t.from} to={t.to} id={t.id} />
              </p>
            </figure>
          ))}
        </div>

        <div className="grid min-h-[7.5rem] grid-cols-12 gap-x-4">
          <div className="col-span-12 grid content-start gap-y-6 md:col-span-9 md:col-start-4">
          <p data-gap className="t-code text-fg-muted motion-safe:[grid-area:1/1]">
            <span className="text-signal-ink">− US${gap}</span>
            <br />
            cancelled orders, counted by one chart and not the other
          </p>
          <div data-rule className="motion-safe:[grid-area:1/1]">
            <p className="t-label flex items-center gap-3 text-fg-muted">
              <span className="cell" />
              Measure · certified
            </p>
            <pre className="t-code mt-3 whitespace-pre-wrap">
              net_revenue = SUM(line_amount){'\n'}
              <span className="text-signal-ink">WHERE order_status IS NOT Cancelled</span>
            </pre>
          </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div aria-hidden className="grid flex-1 grid-cols-4 gap-2">
            {captions.map((_, i) => (
              <span key={i} className="h-px bg-rule">
                <span data-step={i} className="block h-px bg-signal" />
              </span>
            ))}
          </div>
          <p className="t-label text-fg-subtle">Demo warehouse figures</p>
        </div>
      </div>
    </section>
  )
}
