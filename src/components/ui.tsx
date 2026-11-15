import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { gsap, reducedMotion } from '../lib/gsap'
import { navigate, type Route } from '../lib/router'

export function Arrow({ className = '', dir = 'ne' }: { className?: string; dir?: 'ne' | 'e' | 'w' | 's' }) {
  const rot = { ne: -45, e: 0, w: 180, s: 90 }[dir]
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`btn-arrow size-[1em] shrink-0 ${className}`}
      style={{ rotate: `${rot}deg` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" />
    </svg>
  )
}

// "01 — Selected work": the small mono line that opens a section.
export function Label({ index, children, className = '' }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`t-label flex items-center gap-3 ${className}`}>
      <span className="cell" />
      {index && <span className="nums">{index}</span>}
      <span>{children}</span>
    </p>
  )
}

// Link to another page. Real href for middle click and no-JS; the click runs the page transition.
export function RouteLink({
  to,
  scrollTo,
  children,
  ...rest
}: {
  to: Route
  scrollTo?: string
  children: ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    navigate(to, { scrollTo })
  }
  return (
    <a href={`#${to}`} onClick={onClick} {...rest}>
      {children}
    </a>
  )
}

// Pulls its child toward the pointer. Desktop pointers only.
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = el.current!
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion()) return
    const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'power3' })
    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    node.addEventListener('pointermove', move)
    node.addEventListener('pointerleave', leave)
    return () => {
      node.removeEventListener('pointermove', move)
      node.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return (
    <span ref={el} className={`inline-block ${className}`}>
      {children}
    </span>
  )
}

const timeFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })

// Local time in Bengaluru, with a blinking separator.
export function Clock() {
  const [now, setNow] = useState(() => timeFmt.format(new Date()))
  useEffect(() => {
    const id = window.setInterval(() => setNow(timeFmt.format(new Date())), 15_000)
    return () => window.clearInterval(id)
  }, [])
  const [h, m] = now.split(':')
  return (
    <span className="nums">
      {h}
      <span className="animate-blink">:</span>
      {m} IST
    </span>
  )
}
