// Small helpers shared by every isometric figure. Each figure binds them to its own projection.
import * as k from '../components/iso/iso-kit'
import type { Flat, Plan, Point3, Projection, SolidPaths, SolidStyle, LineStyle, Tone } from '../components/iso/iso-kit'

export { k }
export type { Flat, Plan, Point3, Projection }

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
// The site's base curve (0.22, 1, 0.36, 1) is close to this; plain cubic out keeps it cheap per frame.
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)
export const easeInOut = (t: number) => {
  const x = clamp01(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
// Share of a progress window [a, b].
export const within = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))

export function hull(points: Flat[]): Flat[] {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  if (pts.length < 3) return pts
  const cross = (o: Flat, a: Flat, b: Flat) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower: Flat[] = []
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop()
    lower.push(p)
  }
  const upper: Flat[] = []
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop()
    upper.push(p)
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

export function kitFor(P: Projection) {
  const at = (p: Point3) => k.iso(p, P)
  const S = (paths: SolidPaths, style?: SolidStyle) => k.solidSvg(paths, style)
  const L = (d: string, style?: LineStyle) => k.lineSvg(d, style)
  const D = (points: Array<Flat | [number, number, number]>, style?: { size?: number; tone?: Tone; pulse?: boolean }) =>
    k.dotsSvg(points, style)
  const slab = (plan: Plan, z: number, h: number, style?: SolidStyle, steps = 3, bevel = 0) =>
    S(k.slabOf(plan, z, h, P, steps, bevel), style)
  const cyl = (cx: number, cy: number, r: number, z: number, h: number, style?: SolidStyle, steps = 28, bevel = 0) =>
    S(k.cylinder(cx, cy, r, z, h, P, steps, bevel), style)
  const depth = (p: Point3) => k.depthOf(p, P)
  const byDepth = <T extends number[]>(points: T[]) =>
    [...points].sort((a, b) => k.depthOf([a[0], a[1], a[2] ?? 0], P) - k.depthOf([b[0], b[1], b[2] ?? 0], P))
  const poly = (points: Point3[], closed = false) => k.pathOf(points.map(at), closed)
  // Rectangles in vertical planes: y = const (a front face) and x = const (a side face).
  const rectY = (y: number, x0: number, x1: number, z0: number, z1: number) =>
    poly(
      [
        [x0, y, z0],
        [x1, y, z0],
        [x1, y, z1],
        [x0, y, z1],
      ],
      true,
    )
  const rectX = (x: number, y0: number, y1: number, z0: number, z1: number) =>
    poly(
      [
        [x, y0, z0],
        [x, y1, z0],
        [x, y1, z1],
        [x, y0, z1],
      ],
      true,
    )
  const halo = (plan: Plan, z: number, h: number, extra = '') =>
    `<path class="iso-halo"${extra} d="${k.haloOf(plan, z, h, P)}"/>`
  const screws = (points: Point3[], size = 0.45, tone: Tone = 'mid') => D(points.map(at), { size, tone })

  // A base plate on four turned feet, with a groove inset from its edge and corner screws.
  function basePlate(
    plan: Plan,
    top: number,
    h: number,
    footH: number,
    opts: { feet?: number; groove?: number; screws?: number } = {},
  ) {
    const out = [halo(plan, top - h - footH, h)]
    const footInset = opts.feet ?? 14
    for (const [x, y] of byDepth(k.corners(plan, footInset))) {
      out.push(cyl(x, y, 6, top - h - footH, 1.4, { tone: 'lo' }, 24))
      out.push(cyl(x, y, 4.6, top - h - footH + 1.4, footH - 1.4, { tone: 'mid' }, 24))
    }
    out.push(slab(plan, top - h, h, { tone: 'mid' }, 8, 1.4))
    out.push(L(k.planOutline(k.insetPlan(plan, opts.groove ?? 5), top, P), { tone: 'lo' }))
    const sc = k.corners(plan, opts.screws ?? 10)
    out.push(L(sc.map(([x, y]) => k.ring(x, y, 2, top, P, 16)).join(''), { tone: 'lo' }))
    out.push(
      screws(
        sc.map(([x, y]) => [x, y, top] as Point3),
        0.5,
      ),
    )
    return out.join('')
  }

  // A small label plate on a top face: three rule lines that stand for printed text, two screws.
  function labelPlate(plan: Plan, z: number, rules = [0.8, 0.55, 0.65]) {
    const out = [slab(plan, z, 0.7, { tone: 'lo' }, 3)]
    const top = z + 0.7
    out.push(L(k.planOutline(k.insetPlan(plan, 1.4), top, P, 3), { tone: 'faint' }))
    const x0 = plan.x + 4.5
    const span = plan.w - 9
    rules.forEach((share, i) => {
      const y = plan.y + 3.4 + (i * (plan.d - 6.8)) / Math.max(1, rules.length - 1)
      out.push(L(k.lineOnTop([x0, y], [x0 + span * share, y], top, P), { tone: 'lo', free: true }))
    })
    out.push(
      screws(
        [
          [plan.x + 2.4, plan.y + plan.d / 2, top],
          [plan.x + plan.w - 2.4, plan.y + plan.d / 2, top],
        ],
        0.42,
      ),
    )
    return out.join('')
  }

  // A round part lying along x (a hub, a shaft end, a knob), seen from the +x side.
  // Drawn as the hull of its two end circles with the near end face shaded as a top.
  function xRound(
    x0: number,
    x1: number,
    cy: number,
    cz: number,
    r: number,
    style: { tone?: Tone; lit?: boolean; face?: boolean } = {},
  ) {
    const ringAt = (x: number) =>
      Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2
        return at([x, cy + r * Math.cos(a), cz + r * Math.sin(a)])
      })
    const near = ringAt(Math.max(x0, x1))
    const all = hull([...ringAt(Math.min(x0, x1)), ...near])
    const d = k.pathOf(all, true)
    const face = k.pathOf(near, true)
    const tone = style.tone ?? 'mid'
    return `<g class="iso-solid"${style.lit ? ' data-lit=""' : ''}><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="1" d="${d}"/>${
      style.face === false
        ? ''
        : `<path class="iso-top" d="${face}"/><path class="iso-line" data-tone="faint" d="${face}"/>`
    }<path class="iso-line iso-edge" data-tone="${tone}" d="${d}"/></g>`
  }

  // A ball (knob, ball end): a sphere projects to a circle of radius r times the screen scale.
  function ball(c: Point3, r: number, tone: Tone = 'mid') {
    const [x, y] = at(c)
    const R = r * P.scale * Math.sqrt(1.6)
    const f = (v: number) => Math.round(v * 10) / 10
    return `<g class="iso-solid"><circle class="iso-fill" cx="${f(x)}" cy="${f(y)}" r="${f(R)}"/><circle class="iso-top" cx="${f(x - R * 0.28)}" cy="${f(y - R * 0.32)}" r="${f(R * 0.5)}" style="opacity:.7"/><circle class="iso-line iso-edge" data-tone="${tone}" cx="${f(x)}" cy="${f(y)}" r="${f(R)}"/></g>`
  }

  // A rod between two world points, drawn as a strip of screen width w (world units).
  function rod(a: Point3, b: Point3, w: number, tone: Tone = 'mid') {
    const A = at(a)
    const B = at(b)
    const dx = B[0] - A[0]
    const dy = B[1] - A[1]
    const len = Math.hypot(dx, dy) || 1
    const h = (w * P.scale * Math.sqrt(1.6)) / 2
    const nx = (-dy / len) * h
    const ny = (dx / len) * h
    const q: Flat[] = [
      [A[0] + nx, A[1] + ny],
      [B[0] + nx, B[1] + ny],
      [B[0] - nx, B[1] - ny],
      [A[0] - nx, A[1] - ny],
    ]
    return `<g class="iso-solid"><path class="iso-fill" d="${k.pathOf(q, true)}"/><path class="iso-shade" data-shade="2" d="${k.pathOf(q, true)}"/><path class="iso-line" data-tone="faint" d="${k.pathOf(
      [
        [A[0] + nx * 0.2, A[1] + ny * 0.2],
        [B[0] + nx * 0.2, B[1] + ny * 0.2],
      ],
    )}"/><path class="iso-line iso-edge" data-tone="${tone}" d="${k.pathOf([q[0], q[1]])}${k.pathOf([q[3], q[2]])}"/></g>`
  }

  return {
    xRound,
    ball,
    rod,
    P,
    at,
    S,
    L,
    D,
    slab,
    cyl,
    depth,
    byDepth,
    poly,
    rectY,
    rectX,
    halo,
    screws,
    basePlate,
    labelPlate,
  }
}

export type FigKit = ReturnType<typeof kitFor>
