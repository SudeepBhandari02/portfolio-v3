import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { onReady } from '../lib/ready'
import { AXION } from '../lib/content'
import { useReveals } from '../components/Reveals'
import { Arrow, Label, RouteLink } from '../components/ui'
import { Marquee } from '../components/Marquee'
import { Wipe } from '../components/Wipe'
import { Problem } from '../case/Problem'
import { Pipeline } from '../case/Pipeline'
import { Contact } from '../sections/Contact'

const HERO = AXION.chapters[0].image!
const INSPECTOR = {
  src: '/work/axionbi/inspector.webp',
  alt: 'The Net revenue measure in the AxionBI inspector: sum of line amount where order status is not Cancelled, marked Certified.',
}

export function Axion() {
  const root = useRef<HTMLDivElement>(null)
  useReveals(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const intro = gsap
          .timeline({ paused: true, defaults: { ease: 'soft' }, delay: 0.25 })
          .from('[data-a-char]', { yPercent: 110, duration: 1.1, stagger: 0.04 }, 0)
          .fromTo('[data-a-char]', { '--wdth': 125, '--wght': 200 }, { '--wdth': 62, '--wght': 800, duration: 1.4, stagger: 0.04 }, 0.1)
          .from('[data-a-fade]', { opacity: 0, y: 16, duration: 0.9, stagger: 0.07 }, 0.6)
          .from('[data-a-rule]', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'cut' }, 0.5)
        const cancel = onReady(() => intro.play())

        // The product capture opens from a letterbox to the full frame as the title scrolls away.
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: '[data-a-shot]', start: 'top 95%', end: 'top 12%', scrub: 0.6 },
          })
          .fromTo('[data-a-shot]', { clipPath: 'inset(14% 9% 14% 9%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }, 0)
          .fromTo('[data-a-shot] img', { scale: 1.2 }, { scale: 1 }, 0)
        return cancel
      })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <article>
        {/* Title */}
        <header className="gutter relative flex min-h-[92svh] flex-col justify-end pt-[16vh] pb-6">
          <div data-a-fade className="t-label mb-auto flex flex-wrap items-center justify-between gap-4 text-fg-muted">
            <RouteLink to="/" scrollTo="work" className="link flex items-center gap-2 text-fg">
              <Arrow dir="w" /> Index
            </RouteLink>
            <span className="flex items-center gap-3">
              <span className="cell" />
              Case study · Solo build
            </span>
          </div>

          <p data-a-fade className="t-lead mt-12 mb-8 max-w-[30ch] md:ml-auto md:max-w-[34ch]">
            {AXION.line}
          </p>
          <h1 aria-label={AXION.name} className="t-mega overflow-hidden whitespace-nowrap pt-[0.06em]">
            {AXION.name.split('').map((ch, i) => (
              <span key={i} data-a-char aria-hidden className="vf inline-block">
                {ch}
              </span>
            ))}
            <span aria-hidden data-a-fade className="ml-[0.06em] inline-block size-[0.17em] bg-signal" />
          </h1>

          <div data-a-rule className="mt-6 h-px bg-rule" />
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
            {AXION.meta.map((m) => (
              <div key={m.k} data-a-fade>
                <dt className="t-label text-fg-muted">{m.k}</dt>
                <dd className="mt-2">{m.v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <figure className="gutter pb-[12vh]">
          <div data-a-shot className="overflow-hidden bg-fg">
            <img src={HERO.src} alt={HERO.alt} width={HERO.w} height={HERO.h} decoding="async" className="w-full will-change-transform" />
          </div>
          <figcaption className="t-label mt-3 flex justify-between gap-6 text-fg-subtle">
            <span>Fig. 1 · Model builder</span>
            <span className="text-right">Real product capture, demo data</span>
          </figcaption>
        </figure>

        {/* Overview */}
        <section aria-labelledby="overview-title" className="gutter grid grid-cols-12 gap-x-4 pb-[16vh]">
          <div className="col-span-12 md:col-span-3">
            <h2 id="overview-title">
              <Label index="00">Overview</Label>
            </h2>
          </div>
          <p data-reveal="lines" className="t-lead col-span-12 mt-6 md:col-span-8 md:mt-0">
            {AXION.intro}
          </p>
        </section>

        <Problem />
        <Pipeline />

        {/* What I built */}
        <section aria-labelledby="built-title" className="rule-t relative pb-[10vh]">
          <header className="gutter grid grid-cols-12 items-end gap-x-4 pt-[12vh] pb-[8vh]">
            <div className="col-span-12 md:col-span-3">
              <Label index="03">What I built</Label>
            </div>
            <h2 id="built-title" data-reveal="lines" className="vf t-display col-span-12 mt-6 md:col-span-9 md:mt-0">
              Six systems, one person
            </h2>
          </header>

          {AXION.chapters.map((c, i) => (
            <div key={c.title}>
              <div className="gutter rule-t grid grid-cols-12 gap-x-4 gap-y-6 py-[7vh]">
                <span data-reveal="up" className="t-label nums col-span-12 text-signal md:col-span-3">
                  3.{i + 1}
                </span>
                <div className="col-span-12 md:col-span-5">
                  <h3 data-reveal="lines" className="t-h2">
                    {c.title}
                  </h3>
                  <p data-reveal="up" className="mt-6 max-w-[54ch] text-fg-muted">
                    {c.text}
                  </p>
                </div>
                <ul className="t-label col-span-12 space-y-3 leading-snug md:col-span-4 md:pl-8">
                  {c.points.map((p) => (
                    <li key={p} data-reveal="up" className="flex gap-3">
                      <span className="cell mt-[0.3em]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {c.image && i > 0 && (
                <figure className="gutter pb-[9vh]">
                  <div data-reveal="image" className="overflow-hidden bg-fg">
                    <img src={c.image.src} alt={c.image.alt} width={c.image.w} height={c.image.h} loading="lazy" decoding="async" className="w-full" />
                  </div>
                  <figcaption className="t-label mt-3 flex justify-between gap-6 text-fg-subtle">
                    <span>Fig. 3 · A dashboard built from the model</span>
                    <span className="text-right">Demo data</span>
                  </figcaption>
                </figure>
              )}

              {i === 0 && (
                <figure className="gutter grid grid-cols-12 gap-x-4 pb-[9vh]">
                  <div className="col-span-12 md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-4">
                    <div data-reveal="image" className="overflow-hidden bg-fg">
                      <img src={INSPECTOR.src} alt={INSPECTOR.alt} width={1100} height={1630} loading="lazy" decoding="async" className="w-full" />
                    </div>
                  </div>
                  <figcaption className="col-span-12 mt-4 md:col-span-3 md:mt-0 md:self-end">
                    <span className="t-label text-fg-subtle">Fig. 2 · The definition</span>
                    <p className="mt-3 text-fg-muted">
                      One measure, one rule, one place. This panel is the whole reason the two revenue numbers above
                      became one.
                    </p>
                  </figcaption>
                </figure>
              )}
            </div>
          ))}
        </section>

        {/* Warehouses */}
        <section aria-label="Supported warehouses" className="rule-t py-[7vh]">
          <p className="gutter t-label mb-8 flex items-center gap-3 text-fg-muted">
            <span className="cell" />
            One engine, ten warehouses
          </p>
          <ul className="sr-only">
            {AXION.warehouses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <Marquee speed={80}>
            {AXION.warehouses.map((w, i) => (
              <span key={w} className="flex items-center">
                <span className={`vf t-display px-[0.18em] whitespace-nowrap ${i % 2 ? 'outline-type' : ''}`}>{w}</span>
                <span className="size-[clamp(0.6rem,1.4vw,1.5rem)] shrink-0 bg-signal" />
              </span>
            ))}
          </Marquee>
        </section>

        {/* Numbers */}
        <section aria-labelledby="numbers-title" className="rule-t gutter pt-[12vh] pb-[14vh]">
          <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-12 md:col-span-3">
              <Label index="04">By the numbers</Label>
            </div>
            <h2 id="numbers-title" data-reveal="lines" className="t-h2 col-span-12 mt-6 max-w-[20ch] md:col-span-9 md:mt-0">
              Counted from the repository, not rounded up.
            </h2>
          </div>
          <dl className="mt-[8vh] grid grid-cols-2 border-t border-l border-rule md:grid-cols-4">
            {AXION.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-between gap-10 border-r border-b border-rule p-4 md:p-6">
                <dt className="t-label text-fg-muted">{s.label}</dt>
                <dd className="vf nums text-[clamp(3rem,7.5vw,8rem)] leading-[0.8] [--wdth:70]">
                  <span data-count={s.n}>{s.n.toLocaleString('en-US')}</span>
                  <span className="text-signal">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Stack */}
        <section aria-labelledby="stack-title" className="rule-t gutter relative grid grid-cols-12 gap-x-4 pt-[12vh] pb-[60vh]">
          <div className="col-span-12 md:col-span-3">
            <h2 id="stack-title">
              <Label index="05">Stack</Label>
            </h2>
          </div>
          <dl className="col-span-12 mt-6 md:col-span-9 md:mt-0">
            {AXION.stack.map((s) => (
              <div key={s.k} data-reveal="up" className="rule-t grid grid-cols-9 gap-x-4 gap-y-1 py-6">
                <dt className="t-h3 col-span-9 md:col-span-2">{s.k}</dt>
                <dd className="col-span-9 max-w-[60ch] text-fg-muted md:col-span-7">{s.v}</dd>
              </div>
            ))}
          </dl>
          <Wipe to="signal" />
        </section>
      </article>

      <Contact index="06" />
    </div>
  )
}
