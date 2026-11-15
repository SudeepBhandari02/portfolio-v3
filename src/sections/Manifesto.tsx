import { useRef } from 'react'
import { gsap, SplitText, useGSAP, MOTION_OK } from '../lib/gsap'
import { PROFILE } from '../lib/content'
import { Label } from '../components/ui'
import { Wipe } from '../components/Wipe'

const FACTS = [
  { k: 'Now', v: 'Software Development Engineer 1 at StackPro Technologies, building a BI platform and the semantic layer under it.' },
  { k: 'Before', v: 'A year as a full stack intern: a multi warehouse query engine, LLM agents, an AWS to GCP migration.' },
  { k: 'Based', v: `${PROFILE.location}. B.E. Computer Science, 2026.` },
]

// The orange field the hero cell grew into. One statement, inked in word by word as you read down.
export function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const text = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        SplitText.create(text.current, {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              {
                opacity: 1,
                ease: 'none',
                stagger: 0.1,
                scrollTrigger: { trigger: text.current, start: 'top 78%', end: 'bottom 45%', scrub: 0.5 },
              },
            ),
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} data-nav="ink" aria-labelledby="about-title" className="on-signal relative pt-[14vh] pb-[58vh]">
      <div className="gutter grid grid-cols-12 gap-x-4">
        <div className="col-span-12 md:col-span-3">
          <h2 id="about-title">
            <Label index="00">About</Label>
          </h2>
        </div>
        <p
          ref={text}
          className="col-span-12 mt-8 text-[clamp(1.9rem,5.1vw,5.4rem)] leading-[1.02] font-semibold tracking-[-0.025em] [font-stretch:80%] md:col-span-9 md:mt-0"
        >
          I’m a full stack engineer who likes the unglamorous middle of a data product. The semantic layer. The query
          engine under it. The agents beside it. And the interface people actually touch.
        </p>
      </div>

      <dl className="gutter mt-[12vh] grid grid-cols-12 gap-x-4 gap-y-10">
        {FACTS.map((f) => (
          <div key={f.k} data-reveal="up" className="rule-t col-span-12 pt-4 md:col-span-3 md:[&:first-child]:col-start-4">
            <dt className="t-label">{f.k}</dt>
            <dd className="mt-3 max-w-[32ch]">{f.v}</dd>
          </div>
        ))}
      </dl>

      <Wipe to="ink" />
    </section>
  )
}
