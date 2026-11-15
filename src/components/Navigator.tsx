import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { gsap, useGSAP, reducedMotion } from '../lib/gsap'
import { AXION, PROFILE, SECTIONS } from '../lib/content'
import { navigate, useRoute, type Route } from '../lib/router'
import { scrollToId, scroller } from '../lib/scroll'
import { setIndexOpen, toggleIndex, useIndexOpen } from '../lib/index-store'
import { toggleTheme, useTheme } from '../lib/theme'
import { onReady } from '../lib/ready'
import { Arrow } from './ui'
import { ThemeToggle } from './ThemeToggle'

// ---------------------------------------------------------------------------
// The navigator has two halves.
//   Rail:  one cell per section of the current page, always on screen. The cell for the section
//          you are in stretches into a bar and fills as you read. One click jumps.
//   Index: every destination on the site as one board of tiles. Sections, the case study's
//          chapters, links and actions, all one click away from anywhere.
// ---------------------------------------------------------------------------

// A pinned section sits inside a spacer that holds its real scroll length.
const box = (el: HTMLElement) => (el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el)

function go(route: Route, id: string, current: Route) {
  setIndexOpen(false)
  if (route === current) scrollToId(id)
  else navigate(route, { scrollTo: id })
}

function Rail() {
  const route = useRoute()
  const open = useIndexOpen()
  const sections = SECTIONS[route]
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(false)
  const [flash, setFlash] = useState(false)

  useEffect(() => onReady(() => setShown(true)), [])

  // Which section holds the middle of the viewport, and how far through it we are.
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const mid = window.innerHeight / 2
      let current = 0
      let progress = 0
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (!el) return
        const r = box(el).getBoundingClientRect()
        if (r.top <= mid) {
          current = i
          progress = gsap.utils.clamp(0, 1, (mid - r.top) / Math.max(r.height, 1))
        }
      })
      setActive(current)
      root.current?.style.setProperty('--p', progress.toFixed(3))
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    // The page under the rail is swapped during a transition; measure again once it has settled.
    const t = window.setTimeout(measure, 400)
    measure()
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      window.clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [sections])

  // Name the section for a moment each time you cross into a new one.
  useEffect(() => {
    setFlash(true)
    const t = window.setTimeout(() => setFlash(false), 1400)
    return () => window.clearTimeout(t)
  }, [active, route])

  return (
    <nav
      ref={root}
      data-chrome
      aria-label="Sections on this page"
      className={`dock fixed bottom-3 left-1/2 z-[78] flex -translate-x-1/2 items-center p-1 transition-[opacity,visibility] duration-500 md:top-1/2 md:right-1.5 md:bottom-auto md:left-auto md:translate-x-0 md:-translate-y-1/2 md:flex-col ${
        shown && !open ? 'opacity-100' : 'invisible opacity-0'
      }`}
    >
      <button type="button" onClick={toggleIndex} aria-label="Open the index" className="dock-btn">
        <span aria-hidden className="grid size-3 grid-cols-2 gap-0.5">
          <span className="bg-current" />
          <span className="bg-current" />
          <span className="bg-current" />
          <span className="bg-current" />
        </span>
        <span className="dock-tip t-label text-[0.6875rem]" aria-hidden>
          Index
        </span>
      </button>

      <span aria-hidden className="mx-1 h-4 w-px bg-rule md:mx-0 md:my-1 md:h-px md:w-4" />

      <ol className="flex items-center md:flex-col">
        {sections.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => scrollToId(s.id)}
              aria-current={i === active ? 'location' : undefined}
              data-flash={i === active && flash ? '' : undefined}
              aria-label={s.label}
              className="dock-btn"
            >
              <span className="dock-cell">{i === active && <span className="dock-fill" />}</span>
              <span className="dock-tip t-label text-[0.6875rem]" aria-hidden>
                <span className="nums opacity-60">{String(i).padStart(2, '0')}</span> {s.label}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <span aria-hidden className="mx-1 h-4 w-px bg-rule md:mx-0 md:my-1 md:h-px md:w-4" />

      <ThemeToggle className="dock-btn" />
    </nav>
  )
}

type Tile = {
  kind: string
  title: string
  note: string
  span?: string
  tone?: 'signal'
  image?: string
  here?: boolean
  external?: string
  run: (e: MouseEvent<HTMLElement>) => void
}

function Index() {
  const route = useRoute()
  const open = useIndexOpen()
  const theme = useTheme()
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const [copied, setCopied] = useState(false)

  const home = (id: string) => () => go('/', id, route)
  const axion = (id: string) => () => go('/work/axionbi', id, route)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${PROFILE.email}`
    }
  }

  const tiles: Tile[] = [
    { kind: 'Start', title: 'Intro', note: PROFILE.role, run: home('top'), here: route === '/' },
    { kind: 'Section', title: 'About', note: 'What I build, in four sentences', run: home('about') },
    {
      kind: 'Case study',
      title: AXION.name,
      note: 'A semantic layer first BI tool, built solo',
      span: 'col-span-2 row-span-2',
      image: AXION.chapters[0].image!.src,
      run: axion('top'),
      here: route === '/work/axionbi',
    },
    { kind: 'Section', title: 'Work', note: 'Six projects', run: home('work') },
    { kind: 'Section', title: 'Experience', note: 'Ten pieces of work at StackPro', run: home('experience') },
    { kind: 'AxionBI · 01', title: 'The problem', note: 'Two revenues, one definition', run: axion('problem') },
    { kind: 'AxionBI · 02', title: 'Pipeline', note: 'Eight stations to a chart', run: axion('pipeline') },
    { kind: 'AxionBI · 03', title: 'Six systems', note: 'What one person built', run: axion('built') },
    { kind: 'AxionBI · 04', title: 'Numbers', note: 'Counted from the repository', run: axion('numbers') },
    { kind: 'Section', title: 'Toolbox', note: 'Languages, frameworks, cloud, AI', run: home('toolbox') },
    { kind: 'Section', title: 'Education', note: 'Degree and certifications', run: home('education') },
    { kind: 'Section', title: 'Contact', note: 'Say hello', span: 'col-span-2', tone: 'signal', run: home('contact') },
    { kind: 'Action', title: copied ? 'Copied' : 'Copy email', note: PROFILE.email, run: copyEmail },
    { kind: 'Link', title: 'GitHub', note: 'SudeepBhandari02', external: PROFILE.github, run: () => {} },
    { kind: 'Link', title: 'LinkedIn', note: 'sudeepbhandari02', external: PROFILE.linkedin, run: () => {} },
    {
      kind: 'Action',
      title: theme === 'light' ? 'Go dark' : 'Go light',
      note: 'Switch the theme',
      run: (e) => toggleTheme({ x: e.clientX, y: e.clientY }),
    },
  ]

  useGSAP(
    () => {
      const fast = reducedMotion()
      // Tiles open outward from the top right, where the Index button is.
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: 'visible' })
        .fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: fast ? 0 : 0.25, ease: 'none' })
        .fromTo(
          '[data-tile]',
          { opacity: 0, scale: 0.9, y: 18 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: fast ? 0 : 0.7,
            ease: 'soft',
            stagger: fast ? 0 : { amount: 0.35, grid: 'auto', from: [1, 0] },
          },
          fast ? 0 : 0.05,
        )
    },
    { scope: root },
  )

  useEffect(() => {
    if (!tl.current) return
    if (open) {
      scroller.lenis?.stop()
      tl.current.timeScale(1).play()
      root.current?.querySelector<HTMLElement>('[data-tile]')?.focus({ preventScroll: true })
      return
    }
    scroller.lenis?.start()
    tl.current.timeScale(2.2).reverse()
    const t = window.setTimeout(() => {
      if (tl.current?.reversed()) gsap.set(root.current, { visibility: 'hidden' })
    }, 450)
    return () => window.clearTimeout(t)
  }, [open])

  // Esc closes. Cmd or Ctrl + K opens from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setIndexOpen(false)
        document.getElementById('index-toggle')?.focus({ preventScroll: true })
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggleIndex()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div
      ref={root}
      id="index"
      role="dialog"
      aria-modal="true"
      aria-label="Index of the site"
      data-lenis-prevent
      className="gutter invisible fixed inset-0 z-[75] flex flex-col overflow-y-auto bg-ink-0 pt-20 pb-5"
    >
      <div className="grid flex-1 auto-rows-[minmax(6.75rem,1fr)] grid-cols-2 border-t border-l border-rule md:grid-cols-4">
        {tiles.map((t, i) => {
          const body = (
            <>
              {t.image && (
                <img
                  src={t.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 -z-10 size-full object-cover object-[55%_30%] opacity-25 transition-[opacity,scale] duration-700 ease-soft group-hover:scale-105 group-hover:opacity-0"
                />
              )}
              <span className="t-label row-dim flex items-center justify-between gap-3 text-[0.6875rem]">
                <span className="flex items-center gap-2">
                  {t.here && <span className="cell" />}
                  {t.here ? 'You are here' : t.kind}
                </span>
                <span className="nums">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className="mt-auto block">
                <span
                  className={`vf row-name block leading-[0.9] uppercase [--wdth:68] [--wght:740] ${
                    t.span?.includes('row-span-2') ? 'text-[clamp(2.5rem,7vw,7rem)]' : 'text-[clamp(1.35rem,2.5vw,2.6rem)]'
                  }`}
                >
                  {t.title}
                </span>
                <span className="row-dim mt-2 flex items-center justify-between gap-3 text-[0.875rem] leading-snug">
                  <span className="truncate">{t.note}</span>
                  {t.external && <Arrow className="shrink-0" />}
                </span>
              </span>
            </>
          )
          const cls = `tile row group flex flex-col p-3 text-left md:p-4 ${t.span ?? ''}`
          return t.external ? (
            <a key={t.kind + i} data-tile href={t.external} target="_blank" rel="noreferrer" className={cls} tabIndex={open ? 0 : -1}>
              {body}
            </a>
          ) : (
            <button key={t.kind + i} data-tile type="button" onClick={t.run} data-tone={t.tone} className={cls} tabIndex={open ? 0 : -1}>
              {body}
            </button>
          )
        })}
      </div>
      <p className="t-label mt-4 flex justify-between gap-6 text-[0.6875rem] text-fg-subtle">
        <span>{tiles.length} places · click any tile</span>
        <span className="hidden md:inline">Esc to close · Ctrl K to open</span>
      </p>
    </div>
  )
}

export function Navigator() {
  return (
    <>
      <Rail />
      <Index />
    </>
  )
}
