import type { ReactNode } from 'react'
import { EnvelopeSimpleIcon } from '@phosphor-icons/react'
import { PROFILE, STOPS, type StopId } from '../lib/content'

// Horizontal page gutter.
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 md:px-12 lg:px-24 ${className}`}>{children}</div>
}

export function stopNumber(id: StopId) {
  const i = STOPS.findIndex((s) => s.id === id)
  return String(i + 1).padStart(2, '0')
}

// The site's one recurring shape: a single square data cell.
export function Cell({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`inline-block size-2 shrink-0 bg-signal ${className}`} />
}

// SQL keywords in full white, identifiers muted. Used by the query bar and section labels.
export function QueryText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((tok, i) =>
        /^[A-Z*()0-9]+$/.test(tok) ? (
          <span key={i} className="text-fg">
            {tok}
          </span>
        ) : (
          <span key={i}>{tok}</span>
        ),
      )}
    </>
  )
}

// "03  DRILL INTO stackpro": which operation this section performs.
export function OpLabel({ id }: { id: StopId }) {
  const stop = STOPS.find((s) => s.id === id)!
  return (
    <p className="caption-4 flex items-center gap-3 font-mono text-fg-subtle">
      <Cell />
      <span className="text-signal">{stopNumber(id)}</span>
      <span>
        <QueryText text={stop.query} />
      </span>
    </p>
  )
}

export function SectionHeader({ id, title, children }: { id: StopId; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="max-w-[680px]">
      <OpLabel id={id} />
      <h2 className="heading-4 md:heading-2 mt-6">{title}</h2>
      {children && <p className="body-3 mt-4 text-fg-muted">{children}</p>}
    </header>
  )
}

// Primary action. Same everywhere it appears (A2: final CTA identical to the top).
export function EmailButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={`mailto:${PROFILE.email}`}
      className={`button-md inline-flex items-center gap-2 rounded-full bg-fg px-3 py-2 text-ink-0 transition-[translate,scale,background-color] duration-300 ease-base hover:-translate-y-0.5 hover:bg-[#e6e6e6] active:translate-y-0 active:scale-[0.98] ${className}`}
    >
      <EnvelopeSimpleIcon size={18} weight="bold" aria-hidden />
      Email me
    </a>
  )
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <span className="caption-3 inline-flex items-center gap-2 rounded-full bg-ink-3 px-2 py-0.5 text-fg">
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inset-0 animate-signal bg-signal motion-reduce:animate-none" />
        <span className="relative size-2 bg-signal" />
      </span>
      {children}
    </span>
  )
}
