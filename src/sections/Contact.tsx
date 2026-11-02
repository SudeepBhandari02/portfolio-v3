import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { ArrowUpIcon, ArrowUpRightIcon, CheckIcon, CopyIcon, GithubLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react'
import { gsap, useGSAP, MOTION_OK, MOTION_REDUCED } from '../lib/gsap'
import { PROFILE, ROW_COUNT } from '../lib/content'
import { scrollToId } from '../lib/scroll'
import { Container, EmailButton, OpLabel } from '../components/ui'

// Shades for the row cells, so the stack reads as many different things.
const SHADES = ['bg-ink-3', 'bg-ink-4', 'bg-[#3e3e3e]', 'bg-ink-4', 'bg-ink-3', 'bg-[#5c5c5c]']

// LIMIT 1. Every row on the page is a cell. The scroll collapses all of them into the one
// cell left standing, the count runs down to 1, and that last row is the inbox.
export function Contact() {
  const root = useRef<HTMLDivElement>(null)
  const anchor = useRef<HTMLSpanElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const unit = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const cells = gsap.utils.toArray<HTMLElement>('[data-row-cell]', root.current)
      const setCount = (n: number) => {
        if (count.current) count.current.textContent = String(n)
        if (unit.current) unit.current.textContent = n === 1 ? 'row left: my inbox' : 'rows on this page'
      }

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Distance from each cell to the anchor cell, measured with offsets (transform safe).
        const pos = (el: HTMLElement) => {
          let x = 0
          let y = 0
          let n: HTMLElement | null = el
          while (n && n !== root.current) {
            x += n.offsetLeft
            y += n.offsetTop
            n = n.offsetParent as HTMLElement | null
          }
          return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 }
        }
        const delta = (i: number) => {
          const a = pos(anchor.current!)
          const c = pos(cells[i])
          return { x: a.x - c.x, y: a.y - c.y }
        }

        const proxy = { p: 0 }
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        tl.fromTo(
          cells,
          { x: 0, y: 0, opacity: 1, scale: 1 },
          {
            x: (i: number) => delta(i).x,
            y: (i: number) => delta(i).y,
            scale: 0.4,
            opacity: 0,
            ease: 'power2.in',
            duration: 0.25,
            stagger: { each: 0.4 / cells.length, from: 'end' },
          },
          0,
        )
        tl.to(proxy, { p: 1, duration: 0.65, onUpdate: () => setCount(Math.round(ROW_COUNT - (ROW_COUNT - 1) * proxy.p)) }, 0)
        tl.fromTo('[data-final]', { opacity: 0, y: 32 }, { opacity: 1, y: 0, ease: 'base', duration: 0.2, stagger: 0.05 }, 0.66)
        setCount(ROW_COUNT)
      })
      mm.add(MOTION_REDUCED, () => {
        gsap.set(cells, { opacity: 0 })
        setCount(1)
      })
    },
    { scope: root },
  )

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div ref={root} className="relative flex min-h-svh flex-col justify-center py-24">
        <Container>
          <OpLabel id="contact" />

          <p className="mt-8 flex items-baseline gap-4">
            <span ref={anchor} aria-hidden className="size-6 shrink-0 self-center bg-signal" />
            <span ref={count} className="heading-3 md:heading-1 font-mono tabular-nums">
              {ROW_COUNT}
            </span>
            <span ref={unit} className="body-3 text-fg-muted">
              rows on this page
            </span>
          </p>

          <div className="relative mt-12">
            {/* The rows. They sit over the final content and collapse into the cell above. */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 flex max-w-[680px] flex-wrap gap-2">
              {Array.from({ length: ROW_COUNT - 1 }, (_, i) => (
                <span key={i} data-row-cell className={`size-4 md:size-6 ${SHADES[i % SHADES.length]}`} />
              ))}
            </div>

            <h2 data-final id="contact-title" className="heading-3 md:heading-1 max-w-[680px]">
              Working on something
              <br />
              that runs on data?
            </h2>
            <p data-final className="body-3 mt-6 max-w-[680px] text-fg-muted">
              Email is the fastest way to reach me.
            </p>
            <div data-final className="mt-8 flex flex-wrap items-center gap-4">
              <EmailButton />
              <CopyEmail />
            </div>
            <ul data-final className="mt-12 flex flex-wrap gap-2">
              <SocialLink href={PROFILE.github} label="GitHub" icon={<GithubLogoIcon size={18} aria-hidden />} />
              <SocialLink href={PROFILE.linkedin} label="LinkedIn" icon={<LinkedinLogoIcon size={18} aria-hidden />} />
            </ul>
          </div>
        </Container>
      </div>

      <footer className="border border-ink-3 bg-ink-1 pb-16">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="caption-2 text-fg-subtle">© 2026 {PROFILE.name}. Built with React, GSAP and Motion.</p>
          <a
            href="#top"
            onClick={(e: MouseEvent) => {
              e.preventDefault()
              scrollToId('top')
            }}
            className="caption-1 inline-flex items-center gap-2 rounded-full px-3 py-2 text-fg-muted transition-colors duration-300 ease-base hover:bg-ink-3 hover:text-fg active:scale-[0.98]"
          >
            <ArrowUpIcon size={16} aria-hidden />
            Back to the raw tables
          </a>
        </Container>
      </footer>
    </section>
  )
}

function CopyEmail() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setState('copied')
    } catch {
      setState('failed')
    }
    setTimeout(() => setState('idle'), 2400)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="button-md inline-flex items-center gap-2 rounded-full border border-ink-4 px-3 py-2 text-fg transition-[translate,scale,background-color] duration-300 ease-base hover:-translate-y-0.5 hover:bg-ink-2 active:translate-y-0 active:scale-[0.98]"
      >
        {state === 'copied' ? <CheckIcon size={18} aria-hidden /> : <CopyIcon size={18} aria-hidden />}
        <span className="font-mono">{PROFILE.email}</span>
      </button>
      <p role="status" className="caption-2 text-fg-muted">
        {state === 'copied' && 'Email copied'}
        {state === 'failed' && 'Copy failed. Select the address instead.'}
      </p>
    </div>
  )
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="title-4 inline-flex items-center gap-2 rounded-full bg-ink-1 px-3 py-2 text-fg-muted transition-[translate,background-color,color] duration-300 ease-base hover:-translate-y-0.5 hover:bg-ink-2 hover:text-fg active:translate-y-0"
      >
        {icon}
        {label}
        <ArrowUpRightIcon size={14} aria-hidden />
      </a>
    </li>
  )
}
