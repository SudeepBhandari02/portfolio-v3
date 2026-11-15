import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { PROFILE } from '../lib/content'
import { goToSection } from '../lib/scroll'
import { Arrow, Clock, Label, Magnetic } from '../components/ui'

const LINKS = [
  { label: 'GitHub', href: PROFILE.github, handle: 'SudeepBhandari02' },
  { label: 'LinkedIn', href: PROFILE.linkedin, handle: 'sudeepbhandari02' },
]

// The page ends where it began: on the orange field. Shared by the home page and the case study.
export function Contact({ index = '05' }: { index?: string }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // The headline arrives thin and wide and tightens into the heavy set as it rises into view.
        gsap.fromTo(
          '[data-c-char]',
          { '--wdth': 125, '--wght': 180 },
          {
            '--wdth': 62,
            '--wght': 800,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: { trigger: '[data-c-title]', start: 'top 95%', end: 'top 30%', scrub: 0.6 },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <section id="contact" ref={root} data-nav="ink" aria-labelledby="contact-title" className="on-signal relative flex min-h-svh flex-col justify-between pt-[8vh]">
      <div className="gutter grid grid-cols-12 gap-x-4">
        <div className="col-span-12 md:col-span-3">
          <Label index={index}>Contact</Label>
        </div>
        <p data-reveal="lines" className="t-lead col-span-12 mt-6 max-w-[30ch] md:col-span-6 md:mt-0">
          Building something with data in it? I’d like to hear about it.
        </p>
      </div>

      <div className="gutter mt-[8vh]">
        <h2 id="contact-title" data-c-title aria-label="Let’s talk" className="t-mega overflow-hidden whitespace-nowrap">
          {'Let’s talk'.split('').map((ch, i) => (
            <span key={i} data-c-char aria-hidden className="vf inline-block">
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </h2>

        <div className="mt-[6vh] grid grid-cols-12 gap-x-4 gap-y-10">
          <div className="col-span-12 md:col-span-7">
            <Magnetic strength={0.15}>
              <a
                href={`mailto:${PROFILE.email}`}
                data-cursor="Mail"
                className="link inline-flex items-center gap-[0.4em] text-[clamp(1.05rem,3vw,3rem)] leading-tight font-semibold tracking-[-0.02em] whitespace-nowrap [font-stretch:88%]"
              >
                {PROFILE.email}
                <Arrow />
              </a>
            </Magnetic>
          </div>
          <ul className="col-span-12 md:col-span-5">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="row rule-t flex items-baseline justify-between gap-6 px-3 py-4">
                  <span className="vf row-name text-[clamp(1.5rem,2.6vw,2.5rem)] leading-none uppercase [--wdth:70] [--wght:720]">{l.label}</span>
                  <span className="t-label flex items-center gap-2">
                    {l.handle} <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="gutter rule-t t-label mt-[10vh] flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
        <span>© 2026 {PROFILE.name}</span>
        <span>
          Bengaluru · <Clock />
        </span>
        <button type="button" onClick={() => goToSection('top')} className="link inline-flex items-center gap-2 whitespace-nowrap">
          Back to top <Arrow dir="ne" />
        </button>
      </footer>
    </section>
  )
}
