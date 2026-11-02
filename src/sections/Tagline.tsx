import { useRef } from 'react'
import { ScrollTrigger, gsap, useGSAP, MOTION_OK, MOTION_REDUCED } from '../lib/gsap'
import { Container, OpLabel } from '../components/ui'

// Lines are broken where the thought breaks (B5).
const LINES = [
  'Your data already',
  'has the answers.',
  'You shouldn’t need',
  'an engineer to ask.',
  'I build the layer',
  'that lets you.',
]

// Tagline reveal (B11). One rAF-batched ScrollTrigger lights words in reading order.
export function Tagline() {
  const root = useRef<HTMLElement>(null)
  const words = useRef<HTMLSpanElement[]>([])

  useGSAP(
    () => {
      const all = words.current
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top 65%',
          end: 'bottom 55%',
          onUpdate: (self) => {
            const lit = Math.round(self.progress * all.length)
            all.forEach((w, i) => w.toggleAttribute('data-on', i < lit))
          },
        })
        return () => st.kill()
      })

      mm.add(MOTION_REDUCED, () => {
        all.forEach((w) => w.setAttribute('data-on', ''))
      })
    },
    { scope: root },
  )

  let n = 0
  return (
    <section id="why" ref={root} aria-label="Why I do this" className="py-24">
      <Container>
        <OpLabel id="why" />
        <p className="heading-3 md:heading-1 mt-8 max-w-[680px]">
          {LINES.map((line, li) => (
            <span key={li} className="md:block">
              {line.split(' ').map((word) => {
                const i = n++
                return (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) words.current[i] = el
                    }}
                    className="tagline-word"
                  >
                    {word}{' '}
                  </span>
                )
              })}
            </span>
          ))}
        </p>
      </Container>
    </section>
  )
}
