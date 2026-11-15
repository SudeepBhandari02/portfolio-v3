import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { AXION, FEATURED_PROJECTS, OTHER_PROJECTS } from '../lib/content'
import { Arrow, Label, RouteLink } from '../components/ui'

const REST = [
  ...FEATURED_PROJECTS.map((p) => ({ name: p.name, text: p.summary, stack: p.stack.join(' · '), status: p.status as string | null })),
  ...OTHER_PROJECTS.map((p) => ({ name: p.name, text: p.text, stack: p.stack, status: null as string | null })),
]

// Work opens on the one project that gets a full case study. The page holds while a small
// window onto the product opens to the full viewport, then the rest follow as a plain index.
export function Work() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: stage.current, start: 'top top', end: '+=140%', pin: true, scrub: 0.6 },
          })
          .fromTo('[data-f-clip]', { clipPath: 'inset(31% 33% 31% 33%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, 0)
          .fromTo('[data-f-img]', { scale: 1.35 }, { scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
          .fromTo('[data-f-title]', { '--wdth': 62 }, { '--wdth': 96, duration: 1 }, 0)
          .fromTo('[data-f-side]', { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.1)
          .fromTo('[data-f-cta]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, 0.8)
          .to({}, { duration: 0.15 })
      })
    },
    { scope: root },
  )

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="relative">
      <header className="gutter grid grid-cols-12 items-end gap-x-4 pt-[6vh] pb-10">
        <div className="col-span-12 md:col-span-3">
          <Label index="01">Selected work</Label>
        </div>
        <h2 id="work-title" data-reveal="lines" className="vf t-display col-span-12 mt-6 md:col-span-9 md:mt-0">
          Work <span className="t-label nums align-top text-fg-muted">({String(REST.length + 1).padStart(2, '0')})</span>
        </h2>
      </header>

      {/* Featured: AxionBI */}
      <div ref={stage} className="relative h-svh min-h-[560px] overflow-hidden">
        <RouteLink
          to="/work/axionbi"
          data-cursor="Open"
          aria-label="AxionBI: read the case study"
          className="gutter absolute inset-0 flex flex-col pt-[11svh] pb-5"
        >
          {/* The window. It takes whatever height the title below leaves it. */}
          <div className="relative min-h-0 flex-1">
            <div data-f-clip className="absolute inset-0 overflow-hidden bg-fg">
              <img
                data-f-img
                src={AXION.chapters[0].image!.src}
                alt=""
                width={2400}
                height={1221}
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-[50%_30%] will-change-transform"
              />
            </div>
            <div data-f-side className="t-label absolute inset-x-0 top-0 flex justify-between text-fg-muted">
              <span className="flex items-center gap-3">
                <span className="cell" />
                Featured · Case study
              </span>
              <span>Solo build · 2026</span>
            </div>
          </div>

          <div className="t-label mt-4 flex items-center justify-between gap-6 text-fg-muted">
            <span>01 · Semantic layer first BI</span>
            <span data-f-cta className="btn" data-tone="signal">
              Read the case study <Arrow />
            </span>
          </div>
          <h3 data-f-title className="vf t-mega mt-3 whitespace-nowrap">
            AxionBI
          </h3>
        </RouteLink>
      </div>

      <div className="gutter pt-[10vh] pb-[14vh]">
        <p className="t-lead max-w-[44ch] text-fg-muted" data-reveal="lines">
          {AXION.line} Designed and built alone, from the query compiler to the last empty state.
        </p>

        <ol className="mt-[12vh]">
          {REST.map((p, i) => (
            <li key={p.name} data-reveal="up" className="rule-t group grid grid-cols-12 items-baseline gap-x-4 gap-y-3 py-7">
              <span className="t-label nums col-span-2 text-fg-muted md:col-span-1">{String(i + 2).padStart(2, '0')}</span>
              <h3 className="vf col-span-10 text-[clamp(2rem,4.4vw,4.5rem)] leading-[0.9] uppercase transition-[font-variation-settings] duration-700 ease-soft [--wdth:66] [--wght:740] group-hover:[--wdth:92] md:col-span-4">
                {p.name}
              </h3>
              <p className="col-span-12 max-w-[46ch] text-fg-muted md:col-span-4">{p.text}</p>
              <p className="t-label col-span-12 leading-relaxed text-fg-subtle md:col-span-3 md:text-right">
                {p.status && (
                  <span className="mb-2 flex items-center gap-2 text-fg md:justify-end">
                    <span className="cell" />
                    {p.status}
                  </span>
                )}
                {p.stack}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
