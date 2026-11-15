// Fig 2 · Drill press. "DRILL INTO stackpro."
// A bench drill press over a vise holding four plates, one per row of the career table,
// oldest on top. Scrolling turns the feed handle, the quill comes down, and the bit cuts
// through the rows in order and stops inside the last, thickest one: the one that goes deeper.
import { ROUTE } from '../lib/content'
import { k, kitFor, easeInOut, within, type Point3 } from './shared'

export const W = 600
export const H = 460

const BASE = { x: -46, y: -64, w: 92, d: 110, r: 6 }
const BASE_TOP = 10
const COL: [number, number] = [0, -42]
const COL_R = 6.5
const COL_TOP = 150
const TABLE_C: [number, number] = [0, -2]
const TABLE_R = 26
const TABLE_TOP = 53
const VISE_TOP = 59
const JAW_TOP = 64

// Plates, top to bottom: row 1 is on top. The last row is twice as thick.
const THICK = [3, 3, 3, 6]
export const PLATES = (() => {
  const top = 76
  let z = top
  return THICK.map((t, i) => {
    const plate = { row: i + 1, z1: z, z0: z - t }
    z -= t
    return plate
  })
})()
const STACK_TOP = PLATES[0].z1

const HEAD = { x: -15, y: -54, w: 30, d: 64, r: 5 }
const HEAD_Z0 = 128
const HEAD_Z1 = 158
const BOSS_Z = 124
const Q: [number, number] = [0, 0] // spindle axis
const QUILL_REST = 118 // quill bottom at rest
const NOSE = 12 // quill bottom to chuck nose
const BIT = 22
export const TIP_REST = QUILL_REST - NOSE - BIT // 84
export const TIP_END = PLATES[3].z0 + 2 // a blind hole, 2 short of the last plate's back
export const TRAVEL = TIP_REST - TIP_END
const PINION = 5.2 // feed pinion radius: one radian of handle is 5.2 of travel
const HUB: Point3 = [HEAD.x + HEAD.w, -16, 142]
const SPOKE = 21

const P = k.fitProjection(
  [
    ...k.boxCorners(BASE, -2, 0),
    [0, -72, 178],
    [HUB[0] + 8, HUB[1] - SPOKE - 4, HUB[2]],
    [HUB[0] + 8, HUB[1] + SPOKE + 4, HUB[2]],
    [HUB[0] + 8, HUB[1], HUB[2] - SPOKE - 4],
    [TABLE_C[0] + TABLE_R, TABLE_C[1], TABLE_TOP],
    [0, 42, 70],
  ],
  W,
  H,
  { pad: 30, azimuth: 42 },
)
const K = kitFor(P)
const { L, D, slab, cyl, at, poly, screws, halo, basePlate, xRound, ball, rod } = K

function bench() {
  const out: string[] = [basePlate(BASE, BASE_TOP, 8, 2, { feet: 12, groove: 5, screws: 9 })]
  // Two T-slots in the base, closed so they end on themselves.
  for (const x of [-16, 12]) {
    const slot = { x, y: -14, w: 4, d: 46, r: 2 }
    out.push(L(k.planOutline(slot, BASE_TOP, P, 4), { tone: 'lo' }))
    out.push(L(k.planOutline(k.insetPlan(slot, 1), BASE_TOP, P, 4), { tone: 'faint' }))
  }
  // Ruler strip along the front edge.
  const strip = { x: -34, y: BASE.y + BASE.d - 9, w: 68, d: 5, r: 0.8 }
  out.push(slab(strip, BASE_TOP, 0.5, { tone: 'lo', crease: 'none' }, 2))
  const t = k.topTicks(strip.x + 2, strip.x + strip.w - 2, 2, 5, strip.y + 0.6, BASE_TOP + 0.5, [1.4, 2.6], P)
  out.push(L(t.minor, { tone: 'lo' }), L(t.major, { tone: 'mid' }))
  // Column flange with four bolts, then the collar.
  out.push(cyl(COL[0], COL[1], 13, BASE_TOP, 3, { tone: 'lo' }, 40, 0.6))
  out.push(
    screws(
      [0, 1, 2, 3].map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2
        return [COL[0] + Math.cos(a) * 10, COL[1] + Math.sin(a) * 10, BASE_TOP + 3] as Point3
      }),
      0.6,
      'hi',
    ),
  )
  out.push(cyl(COL[0], COL[1], 9, BASE_TOP + 3, 6, { tone: 'mid' }, 36))
  return out.join('')
}

function motor() {
  const c: [number, number] = [0, -73]
  const out: string[] = []
  out.push(slab({ x: -7, y: -66, w: 14, d: 12, r: 1.5 }, 146, 10, { tone: 'mid' }, 2))
  out.push(cyl(c[0], c[1], 13, 140, 34, { tone: 'mid' }, 48))
  out.push(L(k.knurl(c[0], c[1], 13, 143, 171, 40, P, 0), { tone: 'faint' }))
  out.push(L(k.sideArc(c[0], c[1], 13, 143, P, 30) + k.sideArc(c[0], c[1], 13, 171, P, 30), { tone: 'lo' }))
  out.push(cyl(c[0], c[1], 9.5, 174, 3, { tone: 'mid' }, 40, 0.5))
  out.push(L(k.ring(c[0], c[1], 6, 177, P, 32), { tone: 'faint' }))
  out.push(
    screws(
      [
        [c[0] + 7.6, c[1], 177],
        [c[0] - 7.6, c[1], 177],
        [c[0], c[1] + 7.6, 177],
        [c[0], c[1] - 7.6, 177],
      ],
      0.45,
    ),
  )
  return out.join('')
}

function column() {
  const out: string[] = []
  out.push(cyl(COL[0], COL[1], COL_R, BASE_TOP + 9, COL_TOP - BASE_TOP - 9, { tone: 'mid', crease: 'none' }, 32))
  out.push(L([30, 96, 112].map((z) => k.sideArc(COL[0], COL[1], COL_R, z, P, 20)).join(''), { tone: 'faint' }))
  // Rack on the front of the column: a strip with teeth across its face.
  const ry = COL[1] + COL_R - 0.6
  out.push(slab({ x: -1.6, y: ry, w: 3.2, d: 1.8, r: 0.3 }, 54, 64, { tone: 'mid' }, 1))
  const teeth: string[] = []
  for (let z = 56; z <= 116; z += 2)
    teeth.push(
      poly([
        [-1.6, ry + 1.8, z],
        [1.6, ry + 1.8, z],
      ]),
    )
  out.push(L(teeth.join(''), { tone: 'lo' }))
  return out.join('')
}

function table() {
  const out: string[] = []
  // Bracket collar round the column, the arm, the crank and the clamp handle.
  out.push(cyl(COL[0], COL[1], 10, 38, 13, { tone: 'mid' }, 36, 0.5))
  out.push(L(k.sideArc(COL[0], COL[1], 10, 44.5, P, 24), { tone: 'faint' }))
  out.push(slab({ x: -6, y: COL[1] + 6, w: 12, d: 30, r: 2 }, 41, 6, { tone: 'mid' }, 3, 0.5))
  out.push(xRound(COL[0] + 9.5, COL[0] + 15, COL[1] + 2, 44, 2.4))
  out.push(rod([COL[0] + 15, COL[1] + 2, 44], [COL[0] + 15, COL[1] + 12, 38], 1.4))
  out.push(ball([COL[0] + 15, COL[1] + 12, 38], 2.2))
  out.push(cyl(TABLE_C[0], TABLE_C[1], 8, 40, TABLE_TOP - 5 - 40, { tone: 'mid' }, 32))
  out.push(
    halo(
      { x: TABLE_C[0] - TABLE_R, y: TABLE_C[1] - TABLE_R, w: TABLE_R * 2, d: TABLE_R * 2, r: TABLE_R },
      TABLE_TOP - 5,
      0.1,
      ' style="opacity:.5"',
    ),
  )
  out.push(cyl(TABLE_C[0], TABLE_C[1], TABLE_R, TABLE_TOP - 5, 5, { tone: 'mid' }, 72, 0.8))
  out.push(L(k.sideArc(TABLE_C[0], TABLE_C[1], TABLE_R, TABLE_TOP - 2.4, P, 48), { tone: 'faint' }))
  // Radial slots in the table, closed.
  for (const a of [0.35, 1.92, 3.49, 5.06]) {
    const pts: [number, number][] = []
    const r0 = 12
    const r1 = 22
    const w = 1.6
    const ux = Math.cos(a)
    const uy = Math.sin(a)
    pts.push([TABLE_C[0] + ux * r0 - uy * w, TABLE_C[1] + uy * r0 + ux * w])
    pts.push([TABLE_C[0] + ux * r1 - uy * w, TABLE_C[1] + uy * r1 + ux * w])
    pts.push([TABLE_C[0] + ux * r1 + uy * w, TABLE_C[1] + uy * r1 - ux * w])
    pts.push([TABLE_C[0] + ux * r0 + uy * w, TABLE_C[1] + uy * r0 - ux * w])
    out.push(L(k.onTop(pts, TABLE_TOP, P, true), { tone: 'lo' }))
  }
  return out.join('')
}

function vise() {
  const out: string[] = []
  const base = { x: -21, y: -12, w: 42, d: 26, r: 1.5 }
  out.push(slab(base, TABLE_TOP, VISE_TOP - TABLE_TOP, { tone: 'mid' }, 3, 0.6))
  out.push(
    screws(
      [
        [base.x + 3, base.y + 3, VISE_TOP],
        [base.x + base.w - 3, base.y + 3, VISE_TOP],
      ],
      0.45,
    ),
  )
  // Fixed jaw at the back.
  out.push(slab({ x: -20, y: -12, w: 40, d: 6, r: 1 }, VISE_TOP, JAW_TOP + 3 - VISE_TOP, { tone: 'mid' }, 2, 0.5))
  // Parallels under the work.
  for (const y of [-5, 4]) out.push(slab({ x: -17, y, w: 34, d: 2, r: 0.3 }, VISE_TOP, 2, { tone: 'lo' }, 1))
  // The four plates, bottom to top.
  for (const plate of [...PLATES].reverse()) {
    const plan = { x: -16, y: -6, w: 32, d: 12, r: 0.6 }
    out.push(slab(plan, plate.z0, plate.z1 - plate.z0 - 0.15, { tone: 'hi', crease: 'lo' }, 2))
    // A stamped row number on each plate's side: short rules, one per row.
    const face = plan.x + plan.w
    for (let n = 0; n < plate.row; n++) {
      const y = 3.4 - n * 1.6
      out.push(
        L(
          poly([
            [face, y, plate.z0 + 0.7],
            [face, y, plate.z1 - 0.85],
          ]),
          { tone: 'mid', free: true },
        ),
      )
    }
  }
  // Moving jaw, screw and the T handle.
  out.push(slab({ x: -20, y: 6, w: 40, d: 6, r: 1 }, VISE_TOP, JAW_TOP - VISE_TOP, { tone: 'mid' }, 2, 0.5))
  out.push(slab({ x: -1.3, y: 12, w: 2.6, d: 18, r: 1.2 }, 60.2, 2.6, { tone: 'mid' }, 3))
  out.push(slab({ x: -4, y: 12, w: 8, d: 3, r: 1 }, 59, 5, { tone: 'mid' }, 2))
  out.push(slab({ x: -11, y: 30, w: 22, d: 2.2, r: 1 }, 60.4, 2.2, { tone: 'mid' }, 3))
  out.push(ball([-12.4, 31.1, 61.5], 1.9), ball([12.4, 31.1, 61.5], 1.9))
  return out.join('')
}

function head() {
  const out: string[] = []
  out.push(cyl(Q[0], Q[1], 7, BOSS_Z, HEAD_Z0 - BOSS_Z, { tone: 'mid' }, 32))
  out.push(slab(HEAD, HEAD_Z0, HEAD_Z1 - HEAD_Z0, { tone: 'mid' }, 6, 1))
  out.push(L(k.sideSeam(HEAD, HEAD_Z0 + 4, P, 6), { tone: 'faint' }))
  // Belt guard with a vent of closed slots and a latch knob.
  const guard = { x: -17, y: -62, w: 34, d: 74, r: 10 }
  out.push(slab(guard, HEAD_Z1, 14, { tone: 'mid' }, 8, 1.2))
  out.push(L(k.sideSeam(guard, HEAD_Z1 + 3, P, 8), { tone: 'faint' }))
  for (let i = 0; i < 5; i++)
    out.push(L(k.planOutline({ x: -9, y: -40 + i * 6, w: 18, d: 2.2, r: 1.1 }, HEAD_Z1 + 14, P, 3), { tone: 'lo' }))
  out.push(cyl(0, 4, 3, HEAD_Z1 + 14, 2.5, { tone: 'mid' }, 20))
  // Depth scale on the head front: ticks hang from the plate's left edge, every 2, major every 10.
  const face = HEAD.y + HEAD.d
  const sx0 = 6
  const sx1 = 11.5
  out.push(slab({ x: sx0, y: face, w: sx1 - sx0, d: 0.6, r: 0.2 }, HEAD_Z0 + 3, 24, { tone: 'lo', crease: 'none' }, 1))
  const ticks: string[] = []
  const majors: string[] = []
  for (let i = 0; i <= 11; i++) {
    const z = HEAD_Z0 + 4 + i * 2
    const big = i % 5 === 0
    ;(big ? majors : ticks).push(
      poly([
        [sx0, face + 0.6, z],
        [sx0 + (big ? 3.2 : 1.8), face + 0.6, z],
      ]),
    )
  }
  out.push(L(ticks.join(''), { tone: 'lo' }), L(majors.join(''), { tone: 'mid' }))
  // Switch box with a toggle, and the one engraved word.
  out.push(slab({ x: -13, y: face, w: 9, d: 3, r: 0.8 }, HEAD_Z0 + 12, 11, { tone: 'mid' }, 2, 0.4))
  out.push(slab({ x: -9.7, y: face + 3, w: 2.4, d: 2.6, r: 0.6 }, HEAD_Z0 + 17, 2, { tone: 'hi' }, 2))
  out.push(
    screws(
      [
        [-11.5, face + 3, HEAD_Z0 + 14],
        [-5.5, face + 3, HEAD_Z0 + 14],
      ],
      0.4,
    ),
  )
  out.push(
    k.faceTextSvg(k.sideMatrix([-5, face], HEAD_Z0 + 7.4, P, 'left'), 'SP·DRILL', {
      size: 2.4,
      tone: 'lo',
      anchor: 'middle',
    }),
  )
  return out.join('')
}

export const STATIC_BACK = [bench(), motor(), column(), table(), vise()].join('')
export const STATIC_HEAD = head()

// The cut: a hole in the top plate and a ring of swarf, growing with depth.
function cut(tip: number) {
  if (tip >= STACK_TOP) return ''
  const out: string[] = []
  const depth = STACK_TOP - tip
  out.push(
    `<path class="iso-void" d="${k.planOutline({ x: Q[0] - 1.9, y: Q[1] - 1.9, w: 3.8, d: 3.8, r: 1.9 }, STACK_TOP, P, 8)}"/>`,
  )
  out.push(L(k.planOutline({ x: Q[0] - 1.9, y: Q[1] - 1.9, w: 3.8, d: 3.8, r: 1.9 }, STACK_TOP, P, 8), { tone: 'lo' }))
  const n = Math.min(18, Math.round(depth * 1.4))
  const chips: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = i * 2.39996
    const r = 3.2 + ((i * 37) % 11) * 0.38
    chips.push(at([Q[0] + Math.cos(a) * r, Q[1] + Math.sin(a) * r, STACK_TOP]))
  }
  out.push(D(chips, { size: 0.55, tone: 'hi' }))
  return out.join('')
}

// Quill, chuck and bit for a given travel. The bit is drawn only above the work surface.
function spindle(travel: number) {
  const out: string[] = []
  const qz = QUILL_REST - travel
  const tip = TIP_REST - travel
  const nose = qz - NOSE
  out.push(cyl(Q[0], Q[1], 4.2, qz, BOSS_Z - qz, { tone: 'hi', crease: 'none' }, 28))
  out.push(L(k.sideArc(Q[0], Q[1], 4.2, qz + 3.6, P, 20), { tone: 'faint' }))
  // Bit, from the work surface (or its tip) up into the chuck nose.
  const low = Math.max(tip, STACK_TOP)
  if (nose > low) {
    out.push(cyl(Q[0], Q[1], 1.5, low, nose - low, { tone: 'hi', lit: true, crease: 'none' }, 16))
    // Flutes: short helical marks that turn as the handle turns.
    const turn = travel / PINION
    const marks: string[] = []
    for (let z = low + 1; z < nose - 1; z += 2.2) {
      const a = turn * 3 + z * 0.9
      const facing = Math.cos(a - (42 * Math.PI) / 180)
      if (facing < 0.1) continue
      marks.push(
        poly([
          [Q[0] + Math.cos(a) * 1.5, Q[1] + Math.sin(a) * 1.5, z],
          [Q[0] + Math.cos(a + 0.9) * 1.5, Q[1] + Math.sin(a + 0.9) * 1.5, z + 1.1],
        ]),
      )
    }
    out.push(L(marks.join(''), { tone: 'lit' }))
  }
  // Chuck: nose, body with a knurled sleeve, and the key holes.
  out.push(cyl(Q[0], Q[1], 3.6, nose, 2.5, { tone: 'mid' }, 24))
  out.push(cyl(Q[0], Q[1], 6, nose + 2.5, 7, { tone: 'mid' }, 36, 0.4))
  out.push(L(k.knurl(Q[0], Q[1], 6, nose + 4.2, nose + 9.5, 34, P, 0), { tone: 'lo' }))
  out.push(L(k.sideArc(Q[0], Q[1], 6, nose + 4.2, P, 24), { tone: 'faint' }))
  out.push(cyl(Q[0], Q[1], 4.8, nose + 9.5, 2.5, { tone: 'mid' }, 28))
  out.push(D([at([Q[0] + 4.3, Q[1] + 4.3, nose + 3.4])], { size: 0.6, tone: 'hi' }))
  return out.join('')
}

// Feed handle: three spokes with ball knobs on a hub on the head's right side.
function handle(travel: number) {
  const turn = travel / PINION
  const out: string[] = []
  out.push(xRound(HUB[0], HUB[0] + 4, HUB[1], HUB[2], 5.4))
  out.push(xRound(HUB[0] + 4, HUB[0] + 7.5, HUB[1], HUB[2], 3.6, { tone: 'mid' }))
  const spokes = [0, 1, 2].map((i) => {
    const a = turn + (i * Math.PI * 2) / 3 + 0.5
    const end: Point3 = [HUB[0] + 6, HUB[1] + Math.cos(a) * SPOKE, HUB[2] + Math.sin(a) * SPOKE]
    return { end, depth: K.depth(end) }
  })
  spokes.sort((a, b) => a.depth - b.depth)
  // Spokes behind the hub face first; the rest after the cap.
  const cap = xRound(HUB[0] + 7.5, HUB[0] + 9, HUB[1], HUB[2], 2.4, { tone: 'hi' })
  for (const s of spokes) {
    out.push(rod([HUB[0] + 6, HUB[1], HUB[2]], s.end, 1.5))
    out.push(ball(s.end, 3, 'hi'))
  }
  out.push(cap)
  out.push(D([at([HUB[0] + 9, HUB[1], HUB[2]])], { size: 0.5, tone: 'mid' }))
  return out.join('')
}

// Pointer on the depth scale: it rides down with the quill, one tick per 2 of travel.
function pointer(travel: number) {
  const face = HEAD.y + HEAD.d + 0.6
  const z1 = HEAD_Z0 + 26 - Math.min(22, travel)
  return L(
    poly([
      [5, face, z1],
      [11.5, face, z1],
    ]),
    { tone: 'lit' },
  )
}

export function moving(travel: number) {
  return { low: cut(TIP_REST - travel) + spindle(travel), high: pointer(travel) + handle(travel) }
}

export const rowAt = (tip: number) => PLATES.find((p) => tip < p.z1 && tip >= p.z0)

export function pose(p: number) {
  return TRAVEL * easeInOut(within(p, 0.04, 0.96))
}

export function readoutOf(travel: number) {
  const tip = TIP_REST - travel
  const row = rowAt(tip)
  if (!row) return tip >= STACK_TOP ? `bit ${(tip - STACK_TOP).toFixed(1)} above row 1` : 'through'
  const r = ROUTE[row.row - 1]
  return `row ${row.row} · ${r.year} · ${(STACK_TOP - tip).toFixed(1)} deep`
}

export const spec = {
  W,
  H,
  layout: [STATIC_BACK, 0, STATIC_HEAD, 1],
  frame(p: number) {
    const t = pose(p)
    const m = moving(t)
    return { key: t.toFixed(2), layers: [m.low, m.high], readout: readoutOf(t) }
  },
}
