import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { onReady } from '../lib/ready'
import { PROFILE } from '../lib/content'
import { goToSection } from '../lib/scroll'
import { updateNavTheme } from '../lib/nav-theme'
import { createCellField } from '../lib/cell-field'
import { Arrow, Magnetic } from '../components/ui'

const LINES = ['Sudeep', 'Bhandari']
// Once the orange has taken the screen, the name rolls over into the handle.
const ALIAS = ['AKA', 'Stylezee']

// The label above the name cycles through these, re-typing itself each time.
const ROLES = [PROFILE.role, 'Semantic layers', 'Query engines', 'LLM agents', 'Interfaces people touch']

// Width axis range of the display face, and how far the pointer's pull reaches.
const NARROW = 62
const WIDE = 118
const REACH = 0.22 // share of the viewport width

// The name is the hero. Set heavy and condensed, it widens under the pointer letter by letter.
// Behind it lies a sheet of cells that behaves like water: it swells on its own, rises under the
// pointer, and rings outward from every click and from the orange cell when it lands.
// On scroll the page holds still: the one orange cell beside the name grows until it is the page.
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const cell = useRef<HTMLSpanElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const role = useRef<HTMLSpanElement>(null)
  const addr = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      // The sheet is drawn once even without motion; it only moves when motion is allowed.
      const field = createCellField(canvas.current!)
      window.addEventListener('resize', field.resize)

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const section = root.current!
        const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? field.start() : field.stop()))
        io.observe(section)

        const local = (x: number, y: number) => {
          const r = canvas.current!.getBoundingClientRect()
          return [x - r.left, y - r.top] as const
        }
        let touched = 0
        const onMove = (e: PointerEvent) => {
          const [x, y] = local(e.clientX, e.clientY)
          field.point(x, y)
          if (addr.current) addr.current.textContent = field.address(x, y)
          touched = performance.now()
        }
        const onDown = (e: PointerEvent) => {
          field.drop(...local(e.clientX, e.clientY))
          touched = performance.now()
        }
        section.addEventListener('pointermove', onMove)
        section.addEventListener('pointerleave', field.release)
        section.addEventListener('pointerdown', onDown)

        // The orange cell is the stone. It drops one ring when it lands, and another now and then if left alone.
        const dropAtCell = () => {
          const c = cell.current!.getBoundingClientRect()
          field.drop(...local(c.left + c.width / 2, c.top + c.height / 2))
        }
        const idle = window.setInterval(() => {
          if (performance.now() - touched > 5000 && window.scrollY < 40 && !document.hidden) dropAtCell()
        }, 6500)

        // The role label re-types itself through what the role actually covers.
        const roles = gsap.timeline({ repeat: -1, delay: 4 })
        ROLES.forEach((_, i) => {
          const next = ROLES[(i + 1) % ROLES.length]
          roles.to(role.current, { duration: 0.9, ease: 'none', scrambleText: { text: next, chars: 'upperCase', speed: 0.5 } }, '+=2.4')
        })

        const chars = gsap.utils.toArray<HTMLElement>('[data-char]')
        const aliasChars = gsap.utils.toArray<HTMLElement>('[data-alias-char]')
        // The handle waits below its mask until the scroll calls it up.
        gsap.set('[data-alias]', { visibility: 'visible' })
        gsap.set(aliasChars, { yPercent: 110 })

        // Entrance: letters come up thin and wide, then pull tight into the heavy condensed set.
        const intro = gsap
          .timeline({ paused: true, defaults: { ease: 'soft' } })
          .from(chars, { yPercent: 110, duration: 1.1, stagger: 0.035 }, 0)
          .fromTo(chars, { '--wdth': 125, '--wght': 200 }, { '--wdth': NARROW, '--wght': 800, duration: 1.4, stagger: 0.035 }, 0.1)
          .from('[data-cell-in]', { scale: 0, duration: 0.7, ease: 'back.out(2.4)' }, 0.9)
          .call(dropAtCell, undefined, 1.2)
          .from(canvas.current, { opacity: 0, duration: 1.6, ease: 'none' }, 0.2)
          .from('[data-h-fade]', { opacity: 0, y: 16, duration: 0.9, stagger: 0.08 }, 0.7)
          .from('[data-h-rule]', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'cut' }, 0.5)
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
              end: '+=200%',
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: updateNavTheme,
            },
          })
          .to('[data-h-out]', { opacity: 0, duration: 0.2 }, 0)
          // Only the second line moves, so nothing is pushed off the left edge.
          .to('[data-line="1"]', { xPercent: 8, duration: 1 }, 0)
          .to(cell.current, { scale: cover, duration: 0.85, ease: 'power2.in' }, 0.1)
          // Not a color tween: the title mixes toward black through a variable, so it follows the theme at rest.
          // The letters turn black only as the orange finishes arriving, so they are never black on black.
          .fromTo(title.current, { '--inked': 0 }, { '--inked': 1, duration: 0.12 }, 0.8)
          // The screen is orange now. Each letter of the name rolls up and out, and the handle rolls in
          // from below, arriving wide and tightening into the same heavy set.
          // The roll moves a wrapper around each letter, never the letter itself: the entrance and the
          // pointer own the letters, and two animations on one element end up restoring each other's leftovers.
          .to('[data-roll]', { yPercent: -110, duration: 0.3, ease: 'power2.in', stagger: 0.025 }, 1)
          .to(aliasChars, { yPercent: 0, duration: 0.4, ease: 'power3.out', stagger: 0.03 }, 1.18)
          .fromTo(aliasChars, { '--wdth': 118 }, { '--wdth': 62, duration: 0.5, ease: 'power2.out', stagger: 0.03 }, 1.18)
          // Hold on the handle before the page moves on.
          .to({}, { duration: 0.25 })

        return () => {
          cancel()
          cancelAnimationFrame(raf)
          title.current?.removeEventListener('pointermove', pull)
          title.current?.removeEventListener('pointerleave', rest)
          io.disconnect()
          window.clearInterval(idle)
          field.stop()
          section.removeEventListener('pointermove', onMove)
          section.removeEventListener('pointerleave', field.release)
          section.removeEventListener('pointerdown', onDown)
        }
      })

      return () => {
        window.removeEventListener('resize', field.resize)
        field.destroy()
      }
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="relative flex h-svh min-h-[600px] flex-col justify-end overflow-hidden pb-6">
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />

      {/* Top right: who, in a sentence. */}
      <div data-h-out className="gutter absolute inset-x-0 top-[18svh] grid grid-cols-12 gap-x-4 md:top-[16svh]">
        <p data-h-fade className="t-label col-span-12 flex items-center gap-3 text-fg-muted md:col-span-4">
          <span className="cell" />
          <span className="sr-only">{PROFILE.role}</span>
          <span ref={role} aria-hidden>
            {PROFILE.role}
          </span>
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
            // Each line is moved on scroll, which makes it its own stacking context. The first line is
            // lifted above the second so the growing cell (inside the second) can never cover it.
            <span key={line} data-line={i} aria-hidden className={`relative block whitespace-nowrap ${i === 0 ? 'z-10' : ''}`}>
              {/* The name and the handle each sit in their own mask, so letters can roll through
                  without clipping the cell, which has to outgrow the line. */}
              <span className="inline-block overflow-hidden pt-[0.06em] align-bottom">
                {line.split('').map((ch, j) => (
                  <span key={j} data-roll className="inline-block will-change-transform">
                    <span data-char className="vf inline-block will-change-transform">
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
              {/* "AKA" is a small lead-in sitting just above the handle; the handle takes the full size. */}
              <span
                data-alias
                className={`invisible absolute left-0 overflow-hidden pt-[0.06em] pr-[0.04em] ${
                  i === 0 ? 'bottom-[0.1em] left-[0.02em] text-[0.26em] tracking-[0.03em]' : 'top-0'
                }`}
              >
                {ALIAS[i].split('').map((ch, j) => (
                  <span key={j} data-alias-char className="vf inline-block will-change-transform">
                    {ch}
                  </span>
                ))}
              </span>
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
        <p className="sr-only">Also known as Stylezee.</p>

        <div data-h-rule className="mt-6 hidden h-px bg-rule md:block" />
        <div data-h-out className="t-label mt-4 hidden flex-wrap items-center justify-between gap-x-8 gap-y-3 text-fg-muted md:flex">
          <span data-h-fade>SDE 1 at StackPro Technologies</span>
          <span data-h-fade className="hidden lg:inline">
            Cell{' '}
            <span ref={addr} className="nums text-fg">
              R00:C00
            </span>{' '}
            · Click anywhere, it ripples
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
