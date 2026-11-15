// Fig 5 · Letterbox. "SELECT * FROM above LIMIT 1."
// Every row on the page comes down to one: the inbox. A letterbox numbered 1 on a post.
// Scrolling slides one letter into the slot (only the part outside the box is drawn),
// then the side flag swings up from resting to raised.
import { ROW_COUNT } from '../lib/content'
import { k, kitFor, easeInOut, within, type Point3 } from './shared'

export const W = 600
export const H = 420

const PAD = { x: -42, y: -42, w: 84, d: 84, r: 3 }
const PAD_TOP = 6
const POST = { x: -5, y: -5, w: 10, d: 10, r: 1 }
const POST_TOP = 62
const BOX = { x: -22, y: -34, w: 44, d: 68, r: 3 }
const BOX_Z0 = 66
const BOX_Z1 = 104
const FRONT = BOX.y + BOX.d
const SIDE = BOX.x + BOX.w
const SLOT = { x0: -12, x1: 12, z0: 92.4, z1: 95.6 }
const LETTER = { w: 20, d: 30, t: 0.9 }
const LETTER_Z = 93.4
export const RUN = LETTER.d + 18 // how far the letter travels into the box
const PIVOT: Point3 = [SIDE + 1.6, -2, 84]
const ARM = 26

const P = k.fitProjection(
  [
    ...k.boxCorners(PAD, 0, 0),
    ...k.boxCorners(BOX, BOX_Z0, BOX_Z1 + 4),
    [0, FRONT + RUN - 8, LETTER_Z],
    [PIVOT[0], PIVOT[1], PIVOT[2] + ARM + 2],
  ],
  W,
  H,
  { pad: 34, azimuth: 38 },
)
const K = kitFor(P)
const { L, D, slab, at, poly, rectY, rectX, screws, halo, xRound } = K

function ground() {
  const out: string[] = [halo(PAD, 0, PAD_TOP)]
  out.push(slab(PAD, 0, PAD_TOP, { tone: 'lo' }, 3, 1))
  // Paving joints that run edge to edge across the slab top.
  const joints: string[] = []
  for (const x of [-14, 14]) joints.push(k.lineOnTop([x, PAD.y], [x, PAD.y + PAD.d], PAD_TOP, P))
  for (const y of [-14, 14]) joints.push(k.lineOnTop([PAD.x, y], [PAD.x + PAD.w, y], PAD_TOP, P))
  out.push(L(joints.join(''), { tone: 'faint' }))
  // Base flange of the post with four bolts.
  const flange = { x: -12, y: -12, w: 24, d: 24, r: 1.5 }
  out.push(slab(flange, PAD_TOP, 2, { tone: 'mid' }, 2, 0.5))
  out.push(
    screws(
      k.corners(flange, 3.5).map(([x, y]) => [x, y, PAD_TOP + 2] as Point3),
      0.6,
      'hi',
    ),
  )
  return out.join('')
}

function post() {
  const out: string[] = []
  out.push(slab(POST, PAD_TOP + 2, POST_TOP - PAD_TOP - 2, { tone: 'mid' }, 2, 0.4))
  out.push(L(k.sideSeam(POST, 26, P, 2) + k.sideSeam(POST, 46, P, 2), { tone: 'faint' }))
  // Bracket on top, a cleat under the box.
  const bracket = { x: -14, y: -22, w: 28, d: 44, r: 1.2 }
  out.push(slab(bracket, POST_TOP, 2.4, { tone: 'mid' }, 2, 0.5))
  out.push(
    screws(
      [
        [-10, -18, POST_TOP + 2.4],
        [10, -18, POST_TOP + 2.4],
        [-10, 18, POST_TOP + 2.4],
        [10, 18, POST_TOP + 2.4],
      ],
      0.45,
    ),
  )
  out.push(slab({ x: -16, y: -26, w: 32, d: 52, r: 1.2 }, POST_TOP + 2.4, BOX_Z0 - POST_TOP - 2.4, { tone: 'lo' }, 2))
  return out.join('')
}

function box() {
  const out: string[] = []
  out.push(slab(BOX, BOX_Z0, BOX_Z1 - BOX_Z0, { tone: 'mid' }, 4, 0.8))
  // Rain cap with an overhang, and a ridge strip along it.
  out.push(slab({ x: BOX.x - 2.5, y: BOX.y - 2.5, w: BOX.w + 5, d: BOX.d + 5, r: 3 }, BOX_Z1, 3, { tone: 'mid' }, 4, 1))
  out.push(slab({ x: -3, y: BOX.y, w: 6, d: BOX.d, r: 1 }, BOX_Z1 + 3, 1.4, { tone: 'mid' }, 2, 0.3))
  // Side: a panel and rivets along the seam.
  out.push(L(rectX(SIDE, BOX.y + 6, FRONT - 6, BOX_Z0 + 5, BOX_Z1 - 5), { tone: 'lo' }))
  const rivets: Point3[] = []
  for (let y = BOX.y + 4; y <= FRONT - 4; y += 6) rivets.push([SIDE, y, BOX_Z0 + 2.2])
  out.push(screws(rivets, 0.4))
  // Front: the door, its hinge line, the slot with its hood, the lock and the number plate.
  out.push(L(rectY(FRONT, BOX.x + 4, BOX.x + BOX.w - 4, BOX_Z0 + 3, BOX_Z1 - 3), { tone: 'lo' }))
  out.push(
    L(
      poly([
        [BOX.x + 6.4, FRONT, BOX_Z0 + 3],
        [BOX.x + 6.4, FRONT, BOX_Z1 - 3],
      ]),
      { tone: 'faint' },
    ),
  )
  out.push(`<path class="iso-void" d="${rectY(FRONT, SLOT.x0, SLOT.x1, SLOT.z0, SLOT.z1)}"/>`)
  out.push(L(rectY(FRONT, SLOT.x0, SLOT.x1, SLOT.z0, SLOT.z1), { tone: 'mid' }))
  out.push(
    slab(
      { x: SLOT.x0 - 2, y: FRONT, w: SLOT.x1 - SLOT.x0 + 4, d: 2.2, r: 0.4 },
      SLOT.z1 + 0.8,
      1.4,
      { tone: 'mid' },
      1,
      0.3,
    ),
  )
  const lock: Point3 = [11, FRONT, BOX_Z0 + 10]
  out.push(`<path class="iso-fill" d="${k.sideRing(lock, 2.2, 'y', P, 24)}"/>`)
  out.push(L(k.sideRing(lock, 2.2, 'y', P, 24), { tone: 'mid' }))
  out.push(
    L(
      poly([
        [lock[0], FRONT, lock[2] + 0.8],
        [lock[0], FRONT, lock[2] - 1],
      ]),
      { tone: 'hi' },
    ),
  )
  const plate = { x0: -8, x1: 2, z0: BOX_Z0 + 6, z1: BOX_Z0 + 16 }
  out.push(L(rectY(FRONT, plate.x0, plate.x1, plate.z0, plate.z1), { tone: 'mid' }))
  out.push(
    k.faceTextSvg(k.sideMatrix([(plate.x0 + plate.x1) / 2, FRONT], plate.z0 + 2.6, P, 'left'), '1', {
      size: 7.4,
      tone: 'hi',
      anchor: 'middle',
    }),
  )
  out.push(
    screws(
      [
        [plate.x0 + 1.2, FRONT, plate.z1 - 1.2],
        [plate.x1 - 1.2, FRONT, plate.z0 + 1.2],
      ],
      0.35,
    ),
  )
  return out.join('')
}

export const STATIC = [ground(), post(), box()].join('')

// The letter, pushed `run` into the box. Only the part in front of the face shows.
function letter(run: number) {
  const back = FRONT + 6 - run // back edge (the one entering first)
  const front = back + LETTER.d
  if (front <= FRONT + 0.2) return ''
  const y0 = Math.max(back, FRONT)
  const out: string[] = []
  const plan = { x: -LETTER.w / 2, y: y0, w: LETTER.w, d: front - y0, r: 0 }
  out.push(halo(plan, LETTER_Z - 6, 0.1, ' style="opacity:.45"'))
  out.push(slab(plan, LETTER_Z, LETTER.t, { tone: 'hi', lit: true, crease: 'mid' }, 1))
  const top = LETTER_Z + LETTER.t
  // Envelope flap: a V from the two front corners to the middle, and the stamp.
  const mid = Math.max(y0, front - LETTER.d * 0.42)
  out.push(
    L(
      k.onTop(
        [
          [-LETTER.w / 2, front],
          [0, mid],
          [LETTER.w / 2, front],
        ],
        top,
        P,
      ),
      { tone: 'mid' },
    ),
  )
  if (back + 4 > FRONT) {
    const stamp = { x: LETTER.w / 2 - 6, y: back + 1.6, w: 4.4, d: 5, r: 0.3 }
    out.push(L(k.planOutline(stamp, top, P, 1), { tone: 'lit' }))
  }
  return out.join('')
}

// The flag swings from lying back along the box (0) to standing up (1).
function flag(up: number) {
  const a = (up * Math.PI) / 2
  const d: Point3 = [0, -Math.cos(a), Math.sin(a)]
  const n: Point3 = [0, Math.sin(a), Math.cos(a)]
  const x = PIVOT[0] + 0.6
  const pt = (s: number, t: number): Point3 => [x, PIVOT[1] + d[1] * s + n[1] * t, PIVOT[2] + d[2] * s + n[2] * t]
  const shape = [
    pt(-2, -1.4),
    pt(ARM - 9, -1.4),
    pt(ARM - 9, -1.4),
    pt(ARM, -1.4),
    pt(ARM, 7.6),
    pt(ARM - 9, 7.6),
    pt(ARM - 9, 1.4),
    pt(-2, 1.4),
  ]
  const lit = up > 0.98
  const out: string[] = []
  out.push(
    `<g class="iso-solid"${lit ? ' data-lit=""' : ''}><path class="iso-fill" d="${poly(shape, true)}"/><path class="iso-top" d="${poly(shape, true)}"/><path class="iso-line iso-edge" data-tone="${lit ? 'hi' : 'mid'}" d="${poly(shape, true)}"/></g>`,
  )
  out.push(L(poly([pt(ARM - 7.6, 3), pt(ARM - 1.4, 3)]), { tone: lit ? 'lit' : 'lo', free: true }))
  return out.join('')
}

function pivot() {
  return xRound(SIDE, SIDE + 1.6, PIVOT[1], PIVOT[2], 3, { tone: 'mid' })
}

function pin() {
  return (
    xRound(PIVOT[0] + 0.6, PIVOT[0] + 2.4, PIVOT[1], PIVOT[2], 1.4, { tone: 'hi' }) +
    D([at([PIVOT[0] + 2.4, PIVOT[1], PIVOT[2]])], { size: 0.4, tone: 'mid' })
  )
}

export function moving(run: number, up: number) {
  return letter(run) + pivot() + flag(up) + pin()
}

export function pose(p: number) {
  return { run: RUN * easeInOut(within(p, 0.08, 0.6)), up: easeInOut(within(p, 0.64, 0.9)) }
}

export function readoutOf(run: number, up: number) {
  if (up > 0.98) return `1 row left · flag up`
  if (run >= RUN - 0.05) return `delivered · flag rising`
  return `1 of ${ROW_COUNT} rows · ${(RUN - run).toFixed(0)} to the slot`
}

export const spec = {
  W,
  H,
  layout: [STATIC, 0],
  frame(p: number) {
    const { run, up } = pose(p)
    return { key: `${run.toFixed(2)}|${up.toFixed(3)}`, layers: [moving(run, up)], readout: readoutOf(run, up) }
  },
}
