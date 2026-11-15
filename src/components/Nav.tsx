import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/gsap'
import { NAV_LINKS, PROFILE } from '../lib/content'
import { goToSection, scroller } from '../lib/scroll'
import { useRoute } from '../lib/router'
import { Arrow, Clock } from './ui'

// Fixed bar: name on the left, place and time in the middle, the menu on the right.
// It steps out of the way while you scroll down and comes back the moment you scroll up.
export function Nav() {
  const route = useRoute()
  const bar = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 120,
      end: 'max',
      onUpdate: (self) => {
        if (self.direction === 1) bar.current?.setAttribute('data-hidden', '')
        else bar.current?.removeAttribute('data-hidden')
      },
      onLeaveBack: () => bar.current?.removeAttribute('data-hidden'),
    })
    return () => st.kill()
  }, [])

  useGSAP(
    () => {
      const fast = reducedMotion()
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'cut' } })
        .set(panel.current, { visibility: 'visible' })
        .fromTo(panel.current, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: fast ? 0 : 0.8 })
        .from('[data-m-link]', { yPercent: 110, duration: fast ? 0 : 0.9, ease: 'soft', stagger: 0.06 }, fast ? 0 : 0.25)
        .from('[data-m-fade]', { opacity: 0, duration: fast ? 0 : 0.5, ease: 'none' }, fast ? 0 : 0.6)
    },
    { scope: panel },
  )

  useEffect(() => {
    if (!tl.current) return
    if (open) {
      bar.current?.removeAttribute('data-hidden')
      scroller.lenis?.stop()
      tl.current.timeScale(1).play()
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
      window.addEventListener('keydown', onKey)
      panel.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
      return () => window.removeEventListener('keydown', onKey)
    }
    scroller.lenis?.start()
    tl.current.timeScale(1.6).reverse().then(() => {
      if (tl.current?.reversed()) gsap.set(panel.current, { visibility: 'hidden' })
    })
  }, [open])

  const go = (id: string) => () => {
    setOpen(false)
    toggle.current?.focus({ preventScroll: true })
    goToSection(id)
  }

  return (
    <>
      <header
        ref={bar}
        data-chrome
        className="nav gutter fixed inset-x-0 top-0 z-[80] flex items-center justify-between py-5"
        style={open ? { color: '#000' } : undefined}
      >
        <button type="button" onClick={go('top')} className="t-label flex items-center gap-3" aria-label="Sudeep Bhandari, back to top">
          <span className="size-2 bg-current" aria-hidden />
          Sudeep Bhandari
        </button>

        <p className="t-label hidden md:block">
          Bengaluru · <Clock />
        </p>

        <div className="flex items-center gap-6">
          {route !== '/' && (
            <button type="button" onClick={go('work')} className="t-label link hidden sm:inline-block">
              Index
            </button>
          )}
          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu"
            className="t-label flex items-center gap-3 py-1"
          >
            <span className="grid">
              <span className={`[grid-area:1/1] transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}>Menu</span>
              <span className={`[grid-area:1/1] transition-opacity duration-200 ${open ? '' : 'opacity-0'}`} aria-hidden={!open}>
                Close
              </span>
            </span>
            <span aria-hidden className="relative block h-2 w-6">
              <span
                className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-500 ease-soft ${open ? 'translate-y-[4px] rotate-[20deg]' : ''}`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500 ease-soft ${open ? '-translate-y-[3px] -rotate-[20deg]' : ''}`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={panel}
        id="menu"
        data-chrome
        data-nav="ink"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="on-signal gutter invisible fixed inset-0 z-[70] flex flex-col justify-end overflow-y-auto pt-24 pb-8"
      >
        <nav aria-label="Sections">
          <ul>
            {NAV_LINKS.map((link, i) => (
              <li key={link.id} className="rule-t overflow-hidden">
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    go(link.id)()
                  }}
                  data-m-link
                  className="group flex items-baseline gap-4 py-2 md:gap-8"
                >
                  <span className="t-label nums w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="vf t-display transition-[font-variation-settings] duration-500 ease-soft group-hover:[--wdth:100] group-focus-visible:[--wdth:100]">
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div data-m-fade className="rule-t t-label flex flex-wrap items-center justify-between gap-x-8 gap-y-3 pt-5">
          <a href={`mailto:${PROFILE.email}`} className="link flex items-center gap-2">
            {PROFILE.email} <Arrow />
          </a>
          <span className="flex gap-6">
            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="link">
              GitHub
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="link">
              LinkedIn
            </a>
          </span>
        </div>
      </div>
    </>
  )
}
