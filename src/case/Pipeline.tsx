import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK, DESKTOP } from '../lib/gsap'
import { AXION } from '../lib/content'
import { Arrow, Label } from '../components/ui'

const STEPS = AXION.pipeline
const LAST = String(STEPS.length).padStart(2, '0')

// How a chart gets its number, as eight stations on one line. On desktop the page holds and the
// line travels sideways; on touch and with reduced motion it is a strip you swipe.
export function Pipeline() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        stage.current!.classList.remove('track-native')
        const distance = () => track.current!.scrollWidth - window.innerWidth
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .to(track.current, { x: () => -distance() }, 0)
          .fromTo('[data-p-line]', { scaleX: 0 }, { scaleX: 1 }, 0)
        return () => stage.current?.classList.add('track-native')
      })
    },
    { scope: root },
  )

  return (
    <section id="pipeline" ref={root} aria-labelledby="pipeline-title" className="rule-t relative flex min-h-svh flex-col overflow-hidden pt-[14vh] pb-8">
      <header className="gutter grid grid-cols-12 items-end gap-x-4">
        <div className="col-span-12 md:col-span-3">
          <Label index="02">How a number is made</Label>
        </div>
        <h2 id="pipeline-title" className="t-h2 col-span-12 mt-6 max-w-[22ch] md:col-span-9 md:mt-0">
          Eight stations between a warehouse and a chart. No one writes SQL at any of them.
        </h2>
      </header>

      <div ref={stage} className="track-native mt-auto pt-12">
        <div ref={track} className="gutter relative w-max will-change-transform">
          {/* The line every station hangs from. */}
          <span aria-hidden className="absolute top-0 right-[var(--gutter)] left-[var(--gutter)] h-px bg-rule">
            <span data-p-line className="block h-px origin-left bg-signal" />
          </span>
          <ol className="flex gap-4">
          {STEPS.map((s, i) => (
            <li key={s.step} className="relative flex w-[78vw] shrink-0 flex-col pt-6 sm:w-[46vw] lg:w-[30vw]">
              <span aria-hidden className="absolute top-0 left-0 size-2 -translate-y-1/2 bg-signal" />
              <p className="t-label nums flex items-center justify-between text-fg-muted">
                <span>
                  {String(i + 1).padStart(2, '0')} / {LAST}
                </span>
                {i < STEPS.length - 1 && <Arrow dir="e" />}
              </p>
              <h3 className="vf mt-6 text-[clamp(2rem,3.6vw,3.75rem)] leading-[0.92] uppercase [--wdth:68] [--wght:740]">{s.step}</h3>
              <p className="mt-5 max-w-[34ch] text-fg-muted">{s.text}</p>
              <pre className="t-code mt-8 border-l border-signal-ink py-1 pl-4 whitespace-pre-wrap text-fg-muted">{s.code}</pre>
            </li>
          ))}
          </ol>
        </div>
      </div>

      <p className="gutter t-label mt-10 text-fg-subtle">Snippets are illustrative, shortened from the real shapes.</p>
    </section>
  )
}
