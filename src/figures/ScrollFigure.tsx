import { useMemo, useRef, type RefObject } from 'react'
import { Art, Plate, useScrub, type KeyMark } from './Plate'

// A figure is static markup interleaved with numbered live layers, in painter's order.
// frame(p) rebuilds only the live layers for a scroll progress p in [0, 1].
export interface FigureSpec {
  W: number
  H: number
  layout: (string | number)[]
  frame: (p: number) => { key: string; layers: string[]; readout: string }
}

export function ScrollFigure({
  spec,
  fig,
  title,
  hint,
  label,
  keys,
  caption,
  surface,
  start = 'top 85%',
  end = 'bottom 30%',
  trigger,
  className,
}: {
  spec: FigureSpec
  fig: string
  title: string
  hint: string
  label: string
  keys?: { mark: KeyMark; label: string }[]
  caption?: string
  surface?: 'raised'
  start?: string
  end?: string
  // Drive from another element (a pinned section) instead of the figure itself.
  trigger?: RefObject<Element | null>
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLSpanElement>(null)
  const live = useRef<(SVGGElement | null)[]>([])
  const last = useRef('')
  const rest = useMemo(() => spec.frame(0), [spec])

  useScrub(
    trigger ?? root,
    (p) => {
      const f = spec.frame(p)
      if (f.key === last.current) return
      last.current = f.key
      f.layers.forEach((html, i) => {
        const g = live.current[i]
        if (g) g.innerHTML = html
      })
      if (readout.current) readout.current.textContent = f.readout
    },
    { start, end },
  )

  return (
    <div ref={root} className={className}>
      <Plate
        fig={fig}
        title={title}
        hint={hint}
        readout={rest.readout}
        readoutRef={readout}
        keys={keys}
        caption={caption}
        surface={surface}
      >
        <svg className="iso-svg" viewBox={`0 0 ${spec.W} ${spec.H}`} role="img" aria-label={label}>
          {spec.layout.map((part, i) =>
            typeof part === 'number' ? (
              <g
                key={i}
                ref={(el) => {
                  live.current[part] = el
                }}
                dangerouslySetInnerHTML={{ __html: rest.layers[part] }}
              />
            ) : (
              <Art key={i} html={part} />
            ),
          )}
        </svg>
      </Plate>
    </div>
  )
}
