import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { onReady } from '../lib/ready'
import { PROFILE } from '../lib/content'
import { goToSection } from '../lib/scroll'
import { updateNavTheme } from '../lib/nav-theme'
import { Arrow, Magnetic } from '../components/ui'

const LINES = ['Sudeep', 'Bhandari']

// Width axis range of the display face, and how far the pointer's pull reaches.
const NARROW = 62
const WIDE = 118
const REACH = 0.22 // share of the viewport width

// The name is the hero. Set heavy and condensed, it widens under the pointer letter by letter.
// On scroll the page holds still: the one orange cell beside the name grows until it is the page.
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const cell = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const chars = gsap.utils.toArray<HTMLElement>('[data-char]')
        // Lines mask their letters for the entrance only. Afterwards the cell must be free to outgrow its line.
        gsap.set('[data-line]', { overflow: 'hidden' })

        // Entrance: letters come up thin and wide, then pull tight into the heavy condensed set.
        const intro = gsap
          .timeline({ paused: true, defaults: { ease: 'soft' } })
          .from(chars, { yPercent: 110, duration: 1.1, stagger: 0.035 }, 0)
          .fromTo(chars, { '--wdth': 125, '--wght': 200 }, { '--wdth': NARROW, '--wght': 800, duration: 1.4, stagger: 0.035 }, 0.1)
          .from('[data-cell-in]', { scale: 0, duration: 0.7, ease: 'back.out(2.4)' }, 0.9)
          .from('[data-h-fade]', { opacity: 0, y: 16, duration: 0.9, stagger: 0.08 }, 0.7)
          .from('[data-h-rule]', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'cut' }, 0.5)
          .set('[data-line]', { overflow: 'visible' })
        const cancel = onReady(() => intro.play())

        // Pointer pull. Only after the entrance, so the two never fight over the same letters.
        let raf = 0
        const pull = (e: PointerEvent) => {
          if (intro.progress() < 1) return
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(() => {
            const reach = window.innerWidth * REACH
            chars.forEach((ch) => {
              const r = ch.getBoundingClientRect()
              const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
              const t = gsap.utils.clamp(0, 1, 1 - d / reach)
              gsap.to(ch, { '--wdth': NARROW + (WIDE - NARROW) * t * t, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
            })
          })
        }
        const rest = () => gsap.to(chars, { '--wdth': NARROW, duration: 0.9, ease: 'soft', overwrite: 'auto' })
        const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        if (fine) {
          title.current!.addEventListener('pointermove', pull)
          title.current!.addEventListener('pointerleave', rest)
        }

        // Scroll: hold the page, let the cell take it over.
        const cover = () => {
          // Measured from the cell's centre and its untransformed size, so it is right at any moment.
          const r = cell.current!.getBoundingClientRect()
          const cx = r.left + r.width / 2
          const cy = r.top + r.height / 2
          const far = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy))
          return (far * 2.1) / cell.current!.offsetWidth
        }
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: '+=110%',
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: updateNavTheme,
            },
          })
          .to('[data-h-out]', { opacity: 0, duration: 0.2 }, 0)
          .to('[data-line="0"]', { xPercent: -6, duration: 1 }, 0)
          .to('[data-line="1"]', { xPercent: 6, duration: 1 }, 0)
          .to(cell.current, { scale: cover, duration: 0.85, ease: 'power2.in' }, 0.1)
          // Not a color tween: the title mixes toward black through a variable, so it follows the theme at rest.
          .fromTo(title.current, { '--inked': 0 }, { '--inked': 1, duration: 0.2 }, 0.55)

        return () => {
          cancel()
          cancelAnimationFrame(raf)
          title.current?.removeEventListener('pointermove', pull)
          title.current?.removeEventListener('pointerleave', rest)
        }
      })
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="relative flex h-svh min-h-[600px] flex-col justify-end overflow-hidden pb-6">
      {/* Top right: who, in a sentence. */}
      <div data-h-out className="gutter absolute inset-x-0 top-[18svh] grid grid-cols-12 gap-x-4 md:top-[16svh]">
        <p data-h-fade className="t-label col-span-12 flex items-center gap-3 text-fg-muted md:col-span-4">
          <span className="cell" />
          {PROFILE.role}
        </p>
        <p data-h-fade className="t-lead col-span-12 mt-6 max-w-[34ch] md:col-span-7 md:col-start-6 md:mt-0 lg:col-span-5 lg:col-start-8">
          I build the layer between raw tables and the answers people trust: semantic models, query engines, and the
          interfaces on top.
        </p>
      </div>

      {/* On phones the navigator rail sits along the bottom edge; the name stops above it. */}
      <div className="gutter relative mb-14 md:mb-0">
        <h1
          id="hero-title"
          ref={title}
          aria-label={PROFILE.name}
          className="t-mega relative z-10 w-fit text-[color-mix(in_srgb,#000_calc(var(--inked,0)*100%),var(--color-fg))] select-none"
        >
          {LINES.map((line, i) => (
            <span key={line} data-line={i} aria-hidden className="block whitespace-nowrap pt-[0.06em]">
              {line.split('').map((ch, j) => (
                <span key={j} data-char className="vf inline-block will-change-transform">
                  {ch}
                </span>
              ))}
              {i === 1 && (
                // The cell. It sits where a full stop would, and on scroll it becomes the next surface.
                <span
                  ref={cell}
                  data-nav="ink"
                  className="relative -z-10 ml-[0.06em] inline-block size-[0.17em] align-baseline will-change-transform"
                >
                  <span data-cell-in className="block size-full bg-signal" />
                </span>
              )}
            </span>
          ))}
        </h1>

        <div data-h-rule className="mt-6 hidden h-px bg-rule md:block" />
        <div data-h-out className="t-label mt-4 hidden flex-wrap items-center justify-between gap-x-8 gap-y-3 text-fg-muted md:flex">
          <span data-h-fade>SDE 1 at StackPro Technologies</span>
          <span data-h-fade className="hidden sm:inline">
            Portfolio · 2026
          </span>
          <Magnetic>
            <button data-h-fade type="button" onClick={() => goToSection('work')} className="flex items-center gap-2 text-fg">
              Scroll <Arrow dir="s" />
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
