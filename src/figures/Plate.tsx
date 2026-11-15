import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { gsap, MOTION_OK, MOTION_REDUCED } from '../lib/gsap'

export type KeyMark = 'raised' | 'flat' | 'lit' | 'dim' | 'dashed'

function Swatch({ mark }: { mark: KeyMark }) {
  if (mark === 'raised' || mark === 'flat' || mark === 'lit') {
    return (
      <svg className="iso-swatch" data-mark={mark} viewBox="0 0 16 10" aria-hidden focusable="false">
        <path d={mark === 'flat' ? 'M2 6.5 8 3.5 14 6.5 8 9.5Z' : 'M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z'} />
        {mark === 'flat' ? null : <path className="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5" />}
      </svg>
    )
  }
  return (
    <svg className="iso-swatch" data-mark={mark} viewBox="0 0 16 10" aria-hidden focusable="false">
      <path d="M1.5 5h13" />
    </svg>
  )
}

// The figure card: Fig n top left, title top right, hint bottom left, live readout bottom right.
// Legend keys and a true caption sit under the card.
export function Plate({
  fig,
  title,
  hint,
  readout,
  readoutRef,
  keys = [],
  caption,
  surface,
  className = '',
  children,
}: {
  fig: string
  title: string
  hint: string
  readout: string
  readoutRef: RefObject<HTMLSpanElement | null>
  keys?: { mark: KeyMark; label: string }[]
  caption?: ReactNode
  surface?: 'raised'
  className?: string
  children: ReactNode
}) {
  return (
    <figure className={`iso iso-figure ${className}`} data-surface={surface}>
      <div className="iso-plate">
        <div className="iso-plate-corners" aria-hidden>
          <span className="iso-plate-corner" data-corner="fig">
            {fig}
          </span>
          <span className="iso-plate-corner" data-corner="title">
            {title}
          </span>
          <span className="iso-plate-corner" data-corner="hint">
            {hint}
          </span>
          <span ref={readoutRef} className="iso-plate-corner" data-corner="readout" aria-live="off">
            {readout}
          </span>
        </div>
        {children}
      </div>
      {keys.length || caption ? (
        <figcaption className="iso-legend">
          {keys.length ? (
            <span className="iso-keys">
              {keys.map((key) => (
                <span className="iso-key" key={key.label}>
                  <Swatch mark={key.mark} />
                  {key.label}
                </span>
              ))}
            </span>
          ) : null}
          {caption ? <span className="iso-caption">{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

// Raw SVG markup from the geometry modules, placed as one group.
export function Art({
  html,
  gref,
  className,
}: {
  html: string
  gref?: RefObject<SVGGElement | null>
  className?: string
}) {
  return <g ref={gref} className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

// Drives a figure from scroll. The progress is scrubbed (eased behind the scroll), and the
// draw function writes attributes on refs, so nothing re-renders per frame.
// Reduced motion: the figure is drawn once, in its finished pose.
export function useScrub(
  trigger: RefObject<Element | null>,
  draw: (p: number) => void,
  { start = 'top 85%', end = 'bottom 25%', scrub = 0.8 }: { start?: string; end?: string; scrub?: number } = {},
) {
  const latest = useRef(draw)
  latest.current = draw
  // A passive effect, not a layout one: it runs after every ref in the tree is attached (the
  // trigger may be a parent, such as a pinned section) and after every pin is created.
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const proxy = { p: 0 }
      latest.current(0)
      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        onUpdate: () => latest.current(proxy.p),
        scrollTrigger: { trigger: trigger.current, start, end, scrub },
      })
      return () => tween.kill()
    })
    mm.add(MOTION_REDUCED, () => latest.current(1))
    return () => mm.revert()
  }, [trigger, start, end, scrub])
}
