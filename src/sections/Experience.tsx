import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/gsap'
import { CURRENT_ROLE, INTERNSHIP } from '../lib/content'
import { Label } from '../components/ui'

type Item = { title: string; text: string; tags?: string[]; role: number }

const ROLES = [
  { title: CURRENT_ROLE.title, dates: CURRENT_ROLE.dates },
  { title: INTERNSHIP.title, dates: INTERNSHIP.dates },
]
const ITEMS: Item[] = [
  ...CURRENT_ROLE.points.map((p) => ({ title: p.lead, text: p.text, role: 0 })),
  ...INTERNSHIP.items.map((p) => ({ title: p.title, text: p.text, tags: p.tags, role: 1 })),
]
const TOTAL = String(ITEMS.length).padStart(2, '0')

// One employer, two roles, ten pieces of work. The left column stays put and keeps count
// while the work scrolls past on the right.
export function Experience() {
  const root = useRef<HTMLElement>(null)
  const digits = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const roles = gsap.utils.toArray<HTMLElement>('[data-role]')
        let shownRole = 0
        const show = (i: number) => {
          // Counter: the strip of numbers slides to the current one.
          gsap.to(digits.current, { yPercent: (-100 * i) / ITEMS.length, duration: 0.7, ease: 'soft', overwrite: true })
          const role = ITEMS[i].role
          if (role !== shownRole) {
            gsap.to(roles[shownRole], { opacity: 0, y: -12, duration: 0.3, ease: 'power2.in', overwrite: true })
            gsap.fromTo(roles[role], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'soft', delay: 0.2, overwrite: true })
            shownRole = role
          }
        }
        gsap.set(roles.slice(1), { opacity: 0 })
        gsap.utils.toArray<HTMLElement>('[data-item]').forEach((el, i) => {
          // onEnter and onEnterBack both fire even when a fast scroll jumps clean over an item.
          ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onEnter: () => show(i), onEnterBack: () => show(i) })
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="experience" ref={root} aria-labelledby="exp-title" className="rule-t relative">
      <header className="gutter grid grid-cols-12 items-end gap-x-4 pt-[12vh] pb-[8vh]">
        <div className="col-span-12 md:col-span-3">
          <Label index="02">Experience</Label>
        </div>
        <h2 id="exp-title" data-reveal="lines" className="vf t-display col-span-12 mt-6 md:col-span-9 md:mt-0">
          StackPro Technologies
        </h2>
      </header>

      <div className="gutter grid grid-cols-12 gap-x-4 pb-[14vh]">
        {/* Sticky counter and role (desktop). */}
        <div className="col-span-4 hidden md:block">
          <div className="sticky top-[18vh]">
            <p className="t-label text-fg-muted">
              Jun 2025 to present · {TOTAL} pieces of work
            </p>
            <div aria-hidden className="vf nums mt-6 flex text-[clamp(6rem,15vw,15rem)] leading-[0.8] text-signal">
              <span className="block h-[0.8em] overflow-hidden">
                <span ref={digits} className="block">
                  {ITEMS.map((_, i) => (
                    <span key={i} className="block h-[0.8em]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  ))}
                </span>
              </span>
            </div>
            <div className="mt-8 grid">
              {ROLES.map((r) => (
                <div key={r.title} data-role className="[grid-area:1/1]">
                  <p className="t-h3">{r.title}</p>
                  <p className="t-label mt-2 text-fg-muted">{r.dates}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ol className="col-span-12 md:col-span-8">
          {ITEMS.map((item, i) => {
            const firstOfRole = i === 0 || ITEMS[i - 1].role !== item.role
            return (
              <li key={item.title} data-item>
                {firstOfRole && (
                  <div className="rule-t flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-4 pb-8 md:hidden">
                    <p className="t-h3">{ROLES[item.role].title}</p>
                    <p className="t-label text-fg-muted">{ROLES[item.role].dates}</p>
                  </div>
                )}
                <div data-reveal="up" className="rule-t grid grid-cols-8 gap-x-4 gap-y-3 py-8">
                  <span className="t-label nums col-span-1 text-signal">{String(i + 1).padStart(2, '0')}</span>
                  <div className="col-span-7">
                    <h3 className="t-h2">{item.title}</h3>
                    <p className="mt-4 max-w-[56ch] text-fg-muted">{item.text}</p>
                    {item.tags && <p className="t-label mt-5 text-fg-subtle">{item.tags.join(' · ')}</p>}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
