import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { PIPELINE } from '../lib/content'
import { Container, SectionHeader } from '../components/ui'
import { Reveal } from '../components/Reveal'

// Shown the way a query plan runs: leaves at the bottom, the answer on top.
// While pinned you scroll down and the data climbs. Stage by stage, bottom to top.
const SHOWN = PIPELINE.map((stage, i) => ({ stage, i })).reverse()

export function Systems() {
  const root = useRef<HTMLElement>(null)
  const fill = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(`(min-width: 1024px) and (min-height: 720px) and ${MOTION_OK}`, () => {
        const section = root.current!
        const stages = gsap.utils.toArray<HTMLElement>('[data-stage]', section)
        section.setAttribute('data-pipeline', 'pinned')

        const setStage = (progress: number) => {
          const idx = Math.min(PIPELINE.length - 1, Math.floor(progress * PIPELINE.length))
          stages.forEach((s) => {
            const i = Number(s.dataset.stage)
            s.dataset.state = i < idx ? 'passed' : i === idx ? 'active' : 'next'
          })
        }

        gsap.fromTo(
          fill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${window.innerHeight * 2.4}`,
              pin: true,
              scrub: 0.6,
              onUpdate: (self) => setStage(self.progress),
              onRefresh: (self) => setStage(self.progress),
            },
          },
        )

        return () => {
          section.removeAttribute('data-pipeline')
          stages.forEach((s) => delete s.dataset.state)
        }
      })
    },
    { scope: root },
  )

  return (
    <section id="systems" ref={root} aria-labelledby="systems-title" className="group/pipeline flex flex-col justify-center bg-ink-1 py-24 lg:min-h-svh">
      <Container className="grid w-full gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeader
            id="systems"
            title={
              <span id="systems-title">
                How a question
                <br />
                reaches a warehouse
              </span>
            }
          >
            Four pieces I’ve built at StackPro. They come from different projects, but they sit on the same
            path. Like a query plan, it runs from the bottom up.
          </SectionHeader>

          {/* Detail panel, only shown while pinned. All four stacked in one grid cell. */}
          <div className="stage-panel mt-12" aria-hidden>
            {PIPELINE.map((stage, i) => (
              <div key={stage.title} data-stage={i} className="rounded-2xl border border-ink-4 bg-ink-2 p-6">
                <StageDetail stage={stage} />
              </div>
            ))}
          </div>
        </div>

        <ol className="relative grid gap-4">
          <span aria-hidden className="absolute top-8 bottom-8 left-4 w-px bg-ink-4" />
          <span
            ref={fill}
            aria-hidden
            className="absolute top-8 bottom-8 left-4 hidden w-px origin-bottom bg-signal group-data-[pipeline=pinned]/pipeline:block"
          />
          {/* Packets of data rising along the line */}
          <span aria-hidden className="absolute top-8 bottom-8 left-4 hidden group-data-[pipeline=pinned]/pipeline:block">
            {[0, 1, 2].map((k) => (
              <span key={k} className="absolute inset-0 animate-rise" style={{ animationDelay: `${k * 0.8}s` }}>
                <span className="absolute bottom-0 left-0 size-1.5 -translate-x-1/2 bg-signal" />
              </span>
            ))}
          </span>

          {SHOWN.map(({ stage, i }) => (
            <li key={stage.title} className="relative pl-12">
              <span
                aria-hidden
                className="caption-3 absolute top-4 left-0 flex size-8 items-center justify-center border border-ink-4 bg-ink-1 font-mono text-signal"
              >
                {i + 1}
              </span>
              <Reveal>
                <article data-stage={i} className="stage-card rounded-2xl border border-ink-3 bg-ink-2 p-4 md:p-6 lg:p-4">
                  <p className="caption-4 font-mono uppercase tracking-widest text-fg-subtle">{stage.step}</p>
                  <h3 className="title-1 mt-2">{stage.title}</h3>
                  {/* Inline detail: hidden while pinned, since the panel shows it */}
                  <div className="stage-inline mt-2">
                    <StageBody stage={stage} />
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="mt-24">
        <p aria-hidden className="caption-4 flex items-center gap-3 font-mono text-fg-subtle">
          <span className="text-signal">↑</span> DRILL UP · back to everything
        </p>
      </Container>
    </section>
  )
}

type Stage = (typeof PIPELINE)[number]

function StageDetail({ stage }: { stage: Stage }) {
  return (
    <>
      <p className="caption-4 font-mono uppercase tracking-widest text-signal">{stage.step}</p>
      <p className="heading-6 mt-2">{stage.title}</p>
      <div className="mt-2">
        <StageBody stage={stage} />
      </div>
    </>
  )
}

function StageBody({ stage }: { stage: Stage }) {
  return (
    <>
      <p className="body-6 text-fg-muted">{stage.text}</p>
      <p className="caption-4 mt-4 font-mono text-fg-subtle">
        {stage.chips.map((c, k) => (
          <span key={c} className={c === 'Next adapter' ? 'text-fg-subtle' : 'text-fg-muted'}>
            {k > 0 && ' · '}
            {c === 'Next adapter' ? `${c} (open slot)` : c}
          </span>
        ))}
      </p>
    </>
  )
}
