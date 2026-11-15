import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { goToSection } from '../lib/scroll'
import { setIndexOpen, toggleIndex, useIndexOpen } from '../lib/index-store'
import { Clock } from './ui'

// Fixed bar: name on the left, place and time in the middle, the Index on the right.
// It steps out of the way while you scroll down and comes back the moment you scroll up.
// Getting around is the navigator's job (see Navigator.tsx); this bar only opens it.
export function Nav() {
  const bar = useRef<HTMLElement>(null)
  const open = useIndexOpen()

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

  useEffect(() => {
    if (open) bar.current?.removeAttribute('data-hidden')
  }, [open])

  return (
    <header
      ref={bar}
      data-chrome
      className="nav gutter fixed inset-x-0 top-0 z-[80] flex items-center justify-between py-5"
      // Over the open Index the bar always reads in the page's text color.
      style={open ? { color: 'var(--color-fg)' } : undefined}
    >
      <button
        type="button"
        onClick={() => {
          setIndexOpen(false)
          goToSection('top')
        }}
        className="t-label flex items-center gap-3"
        aria-label="Sudeep Bhandari, back to top"
      >
        <span className="size-2 bg-current" aria-hidden />
        Sudeep Bhandari
      </button>

      <p className="t-label hidden md:block">
        Bengaluru · <Clock />
      </p>

      <button
        id="index-toggle"
        type="button"
        onClick={toggleIndex}
        aria-expanded={open}
        aria-controls="index"
        className="t-label flex items-center gap-3 py-1"
      >
        <span className="grid">
          <span className={`[grid-area:1/1] transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}>Index</span>
          <span className={`[grid-area:1/1] transition-opacity duration-200 ${open ? '' : 'opacity-0'}`} aria-hidden={!open}>
            Close
          </span>
        </span>
        {/* Four cells. They pull together into one when the Index is open. */}
        <span aria-hidden className={`grid size-3 grid-cols-2 transition-[gap] duration-500 ease-soft ${open ? 'gap-0' : 'gap-0.5'}`}>
          <span className="bg-current" />
          <span className="bg-current" />
          <span className="bg-current" />
          <span className="bg-current" />
        </span>
      </button>
    </header>
  )
}
