import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { NAV_LINKS, PROFILE, STOPS } from '../lib/content'
import { useActiveStop } from '../lib/active-stop'
import { scroller, scrollToId } from '../lib/scroll'
import { BASE_EASE } from './Reveal'

export function Nav() {
  const [open, setOpen] = useState(false)
  const activeIndex = useActiveStop()
  const activeId = STOPS[activeIndex]?.id
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Lock scroll behind the open menu; Escape closes it.
  useEffect(() => {
    if (!open) return
    scroller.lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      scroller.lenis?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // Let the menu cleanup restart Lenis before scrolling.
    requestAnimationFrame(() => scrollToId(id))
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          aria-label="Main"
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-ink-3 bg-ink-1/70 p-2 backdrop-blur-xl"
        >
          <a
            href="#top"
            onClick={go('top')}
            aria-label="Sudeep Bhandari, back to top"
            className="title-4 flex items-center gap-2 rounded-full px-3 py-2 transition-colors duration-300 ease-base hover:bg-ink-3"
          >
            <span aria-hidden className="size-2 bg-signal" />
            Sudeep
          </a>

          <ul className="hidden items-center md:flex">
            {NAV_LINKS.map((link) => {
              const current = link.id === activeId
              return (
                <li key={link.id} className="relative">
                  {current && (
                    <motion.span
                      layoutId="nav-current"
                      className="absolute inset-0 rounded-full bg-ink-3"
                      transition={{ duration: 0.5, ease: BASE_EASE }}
                    />
                  )}
                  <a
                    href={`#${link.id}`}
                    onClick={go(link.id)}
                    aria-current={current ? 'location' : undefined}
                    className={`title-4 relative block rounded-full px-3 py-2 transition-colors duration-300 ease-base hover:text-fg ${
                      current ? 'text-fg' : 'text-fg-muted'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <a
            href={`mailto:${PROFILE.email}`}
            className="button-sm hidden rounded-full bg-fg px-3 py-2 text-ink-0 transition-[scale,background-color] duration-300 ease-base hover:bg-[#e6e6e6] active:scale-[0.98] md:block"
          >
            Email me
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative flex size-10 items-center justify-center rounded-full transition-colors duration-300 ease-base hover:bg-ink-3 active:scale-[0.98] md:hidden"
          >
            {/* Two lines that rotate into an X */}
            <span
              aria-hidden
              className={`absolute h-px w-4 bg-fg transition-transform duration-500 ease-base ${
                open ? 'rotate-45' : '-translate-y-[3px]'
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-px w-4 bg-fg transition-transform duration-500 ease-base ${
                open ? '-rotate-45' : 'translate-y-[3px]'
              }`}
            />
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-0/90 px-6 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: BASE_EASE }}
          >
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.4), ease: BASE_EASE }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={go(link.id)}
                    aria-current={link.id === activeId ? 'location' : undefined}
                    className="heading-3 flex items-baseline gap-4 py-2 text-fg-muted transition-colors duration-300 ease-base hover:text-fg aria-[current]:text-fg"
                  >
                    <span className="caption-4 font-mono text-signal">
                      {String(STOPS.findIndex((s) => s.id === link.id) + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.a
              href={`mailto:${PROFILE.email}`}
              className="button-md mt-8 self-start rounded-full bg-fg px-3 py-2 text-ink-0 active:scale-[0.98]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: BASE_EASE }}
            >
              Email me
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
