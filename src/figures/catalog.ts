// Fig 1 · Card catalog. "Your data already has the answers. You shouldn't need an engineer to ask."
// A library card catalog: twelve drawers indexing the stacks. One drawer slides out on its runners,
// the cards come into view as they clear the case front, and the answer card lifts out of the drawer.
import { k, kitFor, easeInOut, easeOut, within, type Plan, type Point3 } from './shared'

export const W = 600
export const H = 440

const CASE = { x: -60, y: -40, w: 120, d: 80, r: 1.5 }
const Z0 = 12
const Z1 = 112
const FRONT = CASE.y + CASE.d // y of the case front face
const FRONT_D = 1.8 // drawer fronts stand this proud of the case
const PLINTH = { x: -62.5, y: -42.5, w: 125, d: 85, r: 2 }
const CAP = { x: -64, y: -44, w: 128, d: 88, r: 2.5 }
const CROWN = { x: -62, y: -42, w: 124, d: 84, r: 2 }

// The drawer grid: 3 columns by 4 rows inside a 5 unit margin, 3 unit stiles.
const COLS = 3
const ROWS = 4
const GAP = 3
const MARGIN = 5
const DW = (CASE.w - MARGIN * 2 - GAP * (COLS - 1)) / COLS
const DH = (Z1 - Z0 - MARGIN * 2 - GAP * (ROWS - 1)) / ROWS
const colX = (c: number) => CASE.x + MARGIN + c * (DW + GAP)
const rowZ = (r: number) => Z1 - MARGIN - DH - r * (DH + GAP) // row 0 is the top row

// The drawer that moves, and how far it travels.
const PICK = { col: 1, row: 1 }
export const TRAVEL = 52
const DEPTH = 70 // drawer box, front to back
const CARD_PITCH = 3.6
export const CARDS = 18
const ANSWER = 9 // index of the answer card, counted from the back
export const LIFT = 15

const fitPoints: Point3[] = [
  ...k.boxCorners(CAP, 0, 118),
  ...k.boxCorners({ x: colX(1), y: FRONT, w: DW, d: TRAVEL + FRONT_D + 6, r: 0 }, rowZ(1), rowZ(1) + DH),
]
const P = k.fitProjection(fitPoints, W, H, { pad: 34, azimuth: 56 })
const K = kitFor(P)
const { L, D, slab, cyl, at, rectY, rectX, poly, screws, halo, labelPlate, byDepth } = K

// Little rule-line lengths for the label cards, so each drawer reads as its own label.
const LABELS = [0.62, 0.8, 0.5, 0.72, 0.58, 0.86, 0.66, 0.54, 0.78, 0.6, 0.7, 0.48]

// A drawer front at its home position, pushed out by `out` along +y.
function drawerFront(c: number, r: number, out: number, lit: boolean, index: number) {
  const x0 = colX(c)
  const z0 = rowZ(r)
  const y = FRONT + out
  const face = y + FRONT_D
  const cx = x0 + DW / 2
  const parts: string[] = []
  parts.push(slab({ x: x0, y, w: DW, d: FRONT_D, r: 0.5 }, z0, DH, { tone: lit ? 'hi' : 'mid' }, 2, 0.4))
  // Brass label holder: a frame with the card in it, two rivets.
  const hz0 = z0 + 12.2
  const hz1 = z0 + 17.4
  parts.push(L(rectY(face, cx - 7.5, cx + 7.5, hz0, hz1), { tone: lit ? 'mid' : 'lo' }))
  parts.push(L(rectY(face, cx - 6.4, cx + 6.4, hz0 + 0.9, hz1 - 0.9), { tone: 'faint' }))
  const rule = LABELS[index % LABELS.length]
  parts.push(
    L(
      poly([
        [cx - 4.8, face, (hz0 + hz1) / 2],
        [cx - 4.8 + 9.6 * rule, face, (hz0 + hz1) / 2],
      ]),
      { tone: lit ? 'mid' : 'lo', free: true },
    ),
  )
  parts.push(
    screws(
      [
        [cx - 8.6, face, (hz0 + hz1) / 2],
        [cx + 8.6, face, (hz0 + hz1) / 2],
      ],
      0.42,
    ),
  )
  // Bar pull on two posts.
  const pz = z0 + 7.2
  for (const px of [cx - 5.6, cx + 5.6])
    parts.push(slab({ x: px - 0.8, y: face, w: 1.6, d: 2.4, r: 0.4 }, pz, 1.7, { tone: 'mid', crease: 'none' }, 2))
  parts.push(
    slab({ x: cx - 7, y: face + 2.4, w: 14, d: 1.5, r: 0.6 }, pz - 0.2, 2.1, { tone: lit ? 'hi' : 'mid' }, 2, 0.3),
  )
  // The end of the card rod, under the pull.
  const rod: Point3 = [cx, face, z0 + 2.4]
  parts.push(`<path class="iso-fill" d="${k.sideRing(rod, 1.2, 'y', P, 20)}"/>`)
  parts.push(L(k.sideRing(rod, 1.2, 'y', P, 20), { tone: 'lo' }))
  parts.push(D([at(rod)], { size: 0.4, tone: 'mid' }))
  return parts.join('')
}

function base() {
  const out: string[] = [halo(PLINTH, 0, 12)]
  for (const [x, y] of byDepth(k.corners(PLINTH, 7))) {
    out.push(cyl(x, y, 5, 0, 1.2, { tone: 'lo' }, 24))
    out.push(cyl(x, y, 3.8, 1.2, 3.8, { tone: 'mid' }, 24))
  }
  out.push(slab(PLINTH, 5, 7, { tone: 'mid' }, 3, 0.8))
  // Kick plate seam round the plinth, and the one engraved word.
  out.push(L(k.sideSeam(k.insetPlan(PLINTH, 0), 8.2, P, 3), { tone: 'faint' }))
  out.push(
    k.faceTextSvg(k.sideMatrix([-6, PLINTH.y + PLINTH.d], 9.6, P, 'left'), 'INDEX', {
      size: 2.6,
      tone: 'lo',
      anchor: 'middle',
    }),
  )
  return out.join('')
}

function caseBody() {
  const out: string[] = []
  out.push(slab(CASE, Z0, Z1 - Z0, { tone: 'mid' }, 2))
  // Side panel: frame and panel on the right side, two screws top and bottom.
  const sx = CASE.x + CASE.w
  out.push(L(rectX(sx, CASE.y + 7, FRONT - 7, Z0 + 8, Z1 - 8), { tone: 'lo' }))
  out.push(L(rectX(sx, CASE.y + 9, FRONT - 9, Z0 + 10, Z1 - 10), { tone: 'faint' }))
  out.push(
    screws(
      [
        [sx, CASE.y + 3.5, Z0 + 4],
        [sx, FRONT - 3.5, Z0 + 4],
        [sx, CASE.y + 3.5, Z1 - 4],
        [sx, FRONT - 3.5, Z1 - 4],
      ],
      0.42,
    ),
  )
  // Stile screws where the rails cross the stiles on the front.
  const pts: Point3[] = []
  for (let c = 1; c < COLS; c++)
    for (let r = 1; r < ROWS; r++) pts.push([colX(c) - GAP / 2, FRONT, rowZ(r - 1) - GAP / 2])
  out.push(screws(pts, 0.4))
  return out.join('')
}

function crown() {
  const out: string[] = []
  out.push(slab(CAP, Z1, 4, { tone: 'mid' }, 3, 1))
  out.push(slab(CROWN, Z1 + 4, 2.2, { tone: 'mid' }, 3, 0.6))
  const top = Z1 + 6.2
  // A brass plate on the crown and a tray of loose request slips.
  out.push(labelPlate({ x: 10, y: -16, w: 38, d: 15, r: 1 }, top))
  const tray: Plan = { x: -48, y: -24, w: 34, d: 26, r: 1.5 }
  out.push(halo(tray, top, 1))
  out.push(slab(tray, top, 1.2, { tone: 'lo' }, 3))
  // Tray walls: far ones first, slips, then the near walls.
  out.push(slab({ x: tray.x, y: tray.y, w: tray.w, d: 1.2, r: 0.4 }, top + 1.2, 4, { tone: 'mid' }, 2))
  out.push(slab({ x: tray.x, y: tray.y, w: 1.2, d: tray.d, r: 0.4 }, top + 1.2, 4, { tone: 'mid' }, 2))
  for (let i = 0; i < 7; i++) {
    const y = tray.y + 4 + i * 2.9
    out.push(
      slab(
        { x: tray.x + 3, y, w: tray.w - 6, d: 0.5, r: 0 },
        top + 1.2,
        6 + (i % 3) * 0.6,
        { tone: 'hi', crease: 'none' },
        1,
      ),
    )
  }
  out.push(slab({ x: tray.x + tray.w - 1.2, y: tray.y, w: 1.2, d: tray.d, r: 0.4 }, top + 1.2, 4, { tone: 'mid' }, 2))
  out.push(slab({ x: tray.x, y: tray.y + tray.d - 1.2, w: tray.w, d: 1.2, r: 0.4 }, top + 1.2, 4, { tone: 'mid' }, 2))
  return out.join('')
}

// Everything that stays put. The picked drawer's slot holds its dark opening instead of a front.
export const STATIC = [
  base(),
  caseBody(),
  ...Array.from({ length: COLS * ROWS }, (_, i) => {
    const c = i % COLS
    const r = Math.floor(i / COLS)
    if (c === PICK.col && r === PICK.row) return ''
    return drawerFront(c, r, 0, false, i)
  }),
  crown(),
].join('')

// The picked drawer, pulled out by `out` with the answer card lifted by `lift`.
// Only the part of the box in front of the case face is drawn: the rest is inside the case.
export function drawer(out: number, lift: number) {
  const x0 = colX(PICK.col)
  const z0 = rowZ(PICK.row)
  const bx0 = x0 + 1.4
  const bx1 = x0 + DW - 1.4
  const floor = z0 + 1.6
  const wall = 13.6
  const parts: string[] = []
  if (out > 0.4) {
    // The opening in the case front, dark inside.
    parts.push(`<path class="iso-void" d="${rectY(FRONT, x0 + 0.5, x0 + DW - 0.5, z0 + 0.5, z0 + DH - 0.5)}"/>`)
    parts.push(L(rectY(FRONT, x0 + 0.5, x0 + DW - 0.5, z0 + 0.5, z0 + DH - 0.5), { tone: 'lo' }))
    // Shadow of the drawer on the fronts below it.
    parts.push(halo({ x: x0 + 2, y: FRONT, w: DW - 4, d: out, r: 0 }, z0 - 2, 0.1, ' style="opacity:.55"'))
    const run = out
    parts.push(slab({ x: bx0, y: FRONT, w: bx1 - bx0, d: run, r: 0 }, floor - 1.2, 1.2, { tone: 'lo' }, 1))
    parts.push(slab({ x: bx0, y: FRONT, w: 1, d: run, r: 0 }, floor, wall, { tone: 'mid' }, 1))
    // The rod the cards are threaded on.
    const cx = x0 + DW / 2
    parts.push(
      slab({ x: cx - 0.7, y: FRONT, w: 1.4, d: run, r: 0.5 }, floor + 1.6, 1.4, { tone: 'lo', crease: 'none' }, 2),
    )
    // Cards from the back of the drawer to the front; a card shows once it clears the case face.
    for (let i = 0; i < CARDS; i++) {
      const local = -DEPTH + 2 + i * CARD_PITCH
      const y = FRONT + out + local
      if (y < FRONT + 0.3) continue
      const answer = i === ANSWER
      const guide = i % 6 === 2
      const dz = answer ? lift : 0
      const plan = { x: bx0 + 1.4, y, w: bx1 - bx0 - 2.8, d: 0.55, r: 0 }
      const h = 15.6
      if (answer && lift > 0.2)
        parts.push(halo({ ...plan, y: y - 1, d: 2.6 }, floor + dz * 0.4, 0.1, ' style="opacity:.6"'))
      parts.push(
        slab(plan, floor + dz, h, { tone: answer ? 'hi' : guide ? 'mid' : 'hi', lit: answer, crease: 'none' }, 1),
      )
      if (guide || answer) {
        const tabX = answer ? plan.x + plan.w - 10 : plan.x + 3 + (i % 4) * 4
        parts.push(
          slab(
            { x: tabX, y, w: 7, d: 0.55, r: 0 },
            floor + dz + h,
            2.2,
            { tone: answer ? 'hi' : 'mid', lit: answer, crease: 'none' },
            1,
          ),
        )
      }
      if (answer) {
        // Typed lines on the lifted card, and the punched hole the rod ran through.
        const face = y + 0.55
        const tz = floor + dz + h
        for (const [dzRule, share] of [
          [-3, 0.7],
          [-5.2, 0.5],
          [-7.4, 0.62],
        ] as const) {
          parts.push(
            L(
              poly([
                [plan.x + 3, face, tz + dzRule],
                [plan.x + 3 + (plan.w - 6) * share, face, tz + dzRule],
              ]),
              { tone: 'mid', free: true },
            ),
          )
        }
        if (dz > 2.6) {
          const hole: Point3 = [cx, face, floor + dz + 2.3]
          parts.push(`<path class="iso-void" d="${k.sideRing(hole, 0.9, 'y', P, 16)}"/>`)
          parts.push(L(k.sideRing(hole, 0.9, 'y', P, 16), { tone: 'lit' }))
        }
      }
    }
    parts.push(slab({ x: bx1 - 1, y: FRONT, w: 1, d: run, r: 0 }, floor, wall, { tone: 'mid' }, 1))
  }
  parts.push(drawerFront(PICK.col, PICK.row, out, true, PICK.col + PICK.row * COLS))
  return parts.join('')
}

export const cardsInView = (out: number) => {
  let n = 0
  for (let i = 0; i < CARDS; i++) if (FRONT + out + (-DEPTH + 2 + i * CARD_PITCH) >= FRONT + 0.3) n++
  return n
}

// The scroll pose: the drawer runs out first, then the answer card lifts.
export function pose(p: number) {
  const out = TRAVEL * easeInOut(within(p, 0.05, 0.62))
  const lift = LIFT * easeOut(within(p, 0.66, 0.95))
  return { out, lift }
}

export const readoutOf = (out: number, lift: number) =>
  lift > 0.5
    ? `answer lifted · card ${ANSWER + 1} of ${CARDS}`
    : out < 0.5
      ? `drawer 05 · closed`
      : `drawer 05 · ${cardsInView(out)} of ${CARDS} cards in view`

export const spec = {
  W,
  H,
  layout: [STATIC, 0],
  frame(p: number) {
    const { out, lift } = pose(p)
    return { key: `${out.toFixed(2)}|${lift.toFixed(2)}`, layers: [drawer(out, lift)], readout: readoutOf(out, lift) }
  },
}
