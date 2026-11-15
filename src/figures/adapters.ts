// Fig 3 · Adapter bay. "Factory and Adapter patterns pick the right warehouse.
// Adding one means writing an adapter. Nothing else changes."
// The query engine is a sealed block with a selector dial. A bus runs from it to a row of
// sockets. The Snowflake adapter is seated; scrolling drops the next adapter into the open
// socket, its contacts close, its trace lights, and the selector can now turn to it.
// The engine block itself never moves.
import { k, kitFor, easeInOut, easeOut, within, type Point3 } from './shared'

export const W = 600
export const H = 400

const BASE = { x: -104, y: -42, w: 206, d: 84, r: 6 }
const TOP = 10
const ENGINE = { x: -92, y: -28, w: 60, d: 54, r: 4 }
const ENGINE_TOP = 54
const BUS = { x: -32, y: 4, w: 116, d: 11, r: 1.5 }
const BUS_TOP = 17
const SOCKET_TOP = 22
const BAYS = [0, 50]
const CART = { w: 22, d: 6 }
const CART_Y = -13
const CART_H = 44
const SEAT = 8 // how deep a seated cartridge sits in its socket
export const DROP = 46
const DIAL: [number, number] = [-56, 0]
const DIAL_R = 14
const DIAL_TOP = ENGINE_TOP + 4
const DETENT = [0.7, 2.1] // selector angles for bay 1 and bay 2

const P = k.fitProjection(
  [
    ...k.boxCorners(BASE, -2, 0),
    [BAYS[1] + 11, CART_Y, SOCKET_TOP - SEAT + CART_H + DROP],
    [ENGINE.x, ENGINE.y, DIAL_TOP + 2],
  ],
  W,
  H,
  { pad: 28, azimuth: 52 },
)
const K = kitFor(P)
const { L, D, slab, cyl, at, poly, rectY, rectX, screws, basePlate, labelPlate, byDepth } = K

function engine() {
  const out: string[] = []
  out.push(slab(ENGINE, TOP, ENGINE_TOP - TOP, { tone: 'mid' }, 4, 1))
  out.push(L(k.sideSeam(ENGINE, TOP + 6, P, 4) + k.sideSeam(ENGINE, ENGINE_TOP - 4, P, 4), { tone: 'faint' }))
  // Front: vents, three status lamps (the first one on), a label plate.
  const fy = ENGINE.y + ENGINE.d
  for (let i = 0; i < 4; i++) {
    const z = TOP + 12 + i * 4.2
    out.push(
      L(
        poly(
          [
            [ENGINE.x + 6, fy, z],
            [ENGINE.x + 30, fy, z],
            [ENGINE.x + 30, fy, z + 1.8],
            [ENGINE.x + 6, fy, z + 1.8],
          ],
          true,
        ),
        { tone: 'lo' },
      ),
    )
  }
  out.push(
    D([at([ENGINE.x + 40, fy, ENGINE_TOP - 9]), at([ENGINE.x + 45, fy, ENGINE_TOP - 9])], { size: 0.9, tone: 'lo' }),
  )
  out.push(
    `<circle class="iso-signal" cx="${at([ENGINE.x + 50, fy, ENGINE_TOP - 9])[0].toFixed(1)}" cy="${at([ENGINE.x + 50, fy, ENGINE_TOP - 9])[1].toFixed(1)}" r="0.9"/>`,
  )
  out.push(L(rectY(fy, ENGINE.x + 37, ENGINE.x + 54, TOP + 12, TOP + 26), { tone: 'lo' }))
  out.push(
    k.faceTextSvg(k.sideMatrix([ENGINE.x + 45.5, fy], TOP + 18, P, 'left'), 'ENGINE', {
      size: 2.6,
      tone: 'mid',
      anchor: 'middle',
    }),
  )
  out.push(
    screws(
      [
        [ENGINE.x + 38.5, fy, TOP + 13.5],
        [ENGINE.x + 52.5, fy, TOP + 13.5],
        [ENGINE.x + 38.5, fy, TOP + 24.5],
        [ENGINE.x + 52.5, fy, TOP + 24.5],
      ],
      0.4,
    ),
  )
  // Right side: a sealed access panel with four screws. Nobody opens it to add a warehouse.
  const sx = ENGINE.x + ENGINE.w
  out.push(L(rectX(sx, ENGINE.y + 16, ENGINE.y + ENGINE.d - 6, TOP + 10, ENGINE_TOP - 9), { tone: 'lo' }))
  out.push(
    screws(
      [
        [sx, ENGINE.y + 18.5, TOP + 12.5],
        [sx, ENGINE.y + ENGINE.d - 8.5, TOP + 12.5],
        [sx, ENGINE.y + 18.5, ENGINE_TOP - 11.5],
        [sx, ENGINE.y + ENGINE.d - 8.5, ENGINE_TOP - 11.5],
      ],
      0.45,
      'hi',
    ),
  )
  // Top: heat sink fins at the back left, the selector dial on its puck.
  for (let i = 0; i < 6; i++)
    out.push(
      slab({ x: ENGINE.x + 5 + i * 3.4, y: ENGINE.y + 5, w: 1.4, d: 44, r: 0.4 }, ENGINE_TOP, 7, { tone: 'mid' }, 1),
    )
  out.push(cyl(DIAL[0], DIAL[1], DIAL_R + 2, ENGINE_TOP, 1.6, { tone: 'lo' }, 56))
  out.push(
    cyl(DIAL[0], DIAL[1], DIAL_R, ENGINE_TOP + 1.6, DIAL_TOP - ENGINE_TOP - 1.6, { tone: 'hi', crease: 'lo' }, 56, 0.6),
  )
  out.push(L(k.knurl(DIAL[0], DIAL[1], DIAL_R, ENGINE_TOP + 1.6, DIAL_TOP, 60, P, 0.3), { tone: 'lo' }))
  out.push(L(k.ring(DIAL[0], DIAL[1], DIAL_R - 2, DIAL_TOP, P, 56), { tone: 'lo' }))
  const t = k.radialTicks(DIAL[0], DIAL[1], DIAL_R - 2.6, 36, 3, DIAL_TOP, [1, 2.2], P)
  out.push(L(t.minor, { tone: 'lo' }), L(t.major, { tone: 'mid' }))
  // One detent per socket the bus serves.
  out.push(
    D(
      DETENT.map((a) => at([DIAL[0] + Math.sin(a) * (DIAL_R - 6.4), DIAL[1] - Math.cos(a) * (DIAL_R - 6.4), DIAL_TOP])),
      { size: 0.7, tone: 'hi' },
    ),
  )
  out.push(L(k.ring(DIAL[0], DIAL[1], 2, DIAL_TOP, P, 20), { tone: 'mid' }))
  return out.join('')
}

function bus() {
  const out: string[] = []
  out.push(slab(BUS, TOP, BUS_TOP - TOP, { tone: 'mid' }, 2, 0.5))
  // Ticks along the front edge of the bus: one every 4, a major every 5th.
  const t = k.sideTicks(BUS.x + 2, BUS.x + BUS.w - 2, 4, 5, BUS.y + BUS.d, BUS_TOP, [1.2, 2.4], P)
  out.push(L(t.minor, { tone: 'lo' }), L(t.major, { tone: 'mid' }))
  return out.join('')
}

// Three copper traces on the bus top, from the engine face to each socket's riser.
const traceOf = (bay: number) => {
  const x1 = BAYS[bay]
  const lanes = [0, 1, 2].map((i) => {
    const y = bay === 0 ? BUS.y + 2 + i * 1.6 : BUS.y + 7 + i * 1.6
    const x = x1 - 4 + i * 4
    return k.onTop(
      [
        [BUS.x, y],
        [x, y],
        [x, BUS.y],
      ],
      BUS_TOP,
      P,
    )
  })
  return lanes.join('')
}

function socket(bx: number, open: boolean) {
  const out: string[] = []
  const plan = { x: bx - 16, y: BUS.y - 24, w: 32, d: 24, r: 2 }
  out.push(slab(plan, TOP, SOCKET_TOP - TOP, { tone: 'mid' }, 3, 0.6))
  out.push(L(k.sideSeam(plan, TOP + 3, P, 3), { tone: 'faint' }))
  // The slot, its lip, and the contact pads inside it.
  const slot = { x: bx - CART.w / 2 - 0.6, y: CART_Y - 0.6, w: CART.w + 1.2, d: CART.d + 1.2, r: 1.2 }
  out.push(`<path class="iso-void" d="${k.planOutline(slot, SOCKET_TOP, P, 3)}"/>`)
  out.push(L(k.planOutline(slot, SOCKET_TOP, P, 3), { tone: 'lo' }))
  out.push(L(k.planOutline(k.insetPlan(slot, -1.6), SOCKET_TOP, P, 3), { tone: 'faint' }))
  if (open) {
    const pads: Point3[] = []
    for (let i = 0; i < 9; i++) pads.push([bx - 8 + i * 2, CART_Y + CART.d / 2, SOCKET_TOP])
    out.push(screws(pads, 0.45, 'hi'))
  }
  // Riser joining the socket to the bus, with its two screws.
  out.push(
    screws(
      [
        [plan.x + 3, plan.y + plan.d - 3, SOCKET_TOP],
        [plan.x + plan.w - 3, plan.y + plan.d - 3, SOCKET_TOP],
        [plan.x + 3, plan.y + 3, SOCKET_TOP],
        [plan.x + plan.w - 3, plan.y + 3, SOCKET_TOP],
      ],
      0.45,
    ),
  )
  // A label plate and a latch on the right side.
  const sx = plan.x + plan.w
  out.push(L(rectX(sx, plan.y + 11, plan.y + 21, TOP + 3.5, TOP + 9.5), { tone: 'lo' }))
  out.push(
    L(
      poly([
        [sx, plan.y + 13, TOP + 6.5],
        [sx, plan.y + 13 + (open ? 3.5 : 6), TOP + 6.5],
      ]),
      { tone: 'lo', free: true },
    ),
  )
  out.push(slab({ x: sx, y: plan.y + 2.5, w: 2.2, d: 6, r: 0.6 }, TOP + 4, 6, { tone: 'mid' }, 2))
  return out.join('')
}

// Guide posts either side of the slot. The far one goes before the cartridge, the near one after.
const guide = (bx: number, side: -1 | 1) => {
  const x = bx + side * (CART.w / 2 + 3)
  return (
    cyl(x, CART_Y + CART.d / 2, 1.5, SOCKET_TOP, 6, { tone: 'mid' }, 16) +
    D([at([x, CART_Y + CART.d / 2, SOCKET_TOP + 6])], { size: 0.45, tone: 'hi' })
  )
}

// A cartridge with its bottom at `bottom`, drawn only above the socket top.
function cartridge(bx: number, bottom: number, opts: { lit: boolean; on: boolean; mark: 'snow' | 'blank' }) {
  const out: string[] = []
  const low = Math.max(bottom, SOCKET_TOP)
  const top = bottom + CART_H
  const plan = { x: bx - CART.w / 2, y: CART_Y, w: CART.w, d: CART.d, r: 0.8 }
  if (bottom > SOCKET_TOP + 0.5) {
    const gap = bottom - SOCKET_TOP
    out.push(
      `<path class="iso-halo" style="opacity:${Math.max(0, 0.7 - gap / 30).toFixed(2)}" d="${k.haloOf(plan, SOCKET_TOP, 0.1, P)}"/>`,
    )
  }
  out.push(slab(plan, low, top - low, { tone: 'hi', lit: opts.lit, crease: opts.lit ? 'mid' : 'lo' }, 2, 0.4))
  const fy = CART_Y + CART.d
  // Grip ridges across the front, edge to edge, near the top.
  const ridges: string[] = []
  for (let i = 0; i < 4; i++) {
    const z = top - 3 - i * 1.6
    if (z > low)
      ridges.push(
        poly([
          [plan.x, fy, z],
          [plan.x + plan.w, fy, z],
        ]),
      )
  }
  out.push(L(ridges.join(''), { tone: opts.lit ? 'mid' : 'lo' }))
  // Recessed label.
  const lz0 = top - 26
  const lz1 = top - 11
  if (lz0 > low) {
    out.push(L(rectY(fy, plan.x + 3, plan.x + plan.w - 3, lz0, lz1), { tone: opts.lit ? 'mid' : 'lo' }))
    const cx = bx
    const cz = (lz0 + lz1) / 2
    if (opts.mark === 'snow') {
      // A snowflake: three crossing strokes.
      const arms = [0, Math.PI / 3, (2 * Math.PI) / 3].map((a) =>
        poly([
          [cx - Math.cos(a) * 4.4, fy, cz - Math.sin(a) * 4.4],
          [cx + Math.cos(a) * 4.4, fy, cz + Math.sin(a) * 4.4],
        ]),
      )
      out.push(L(arms.join(''), { tone: 'mid', free: true }))
    } else {
      out.push(
        L(
          poly([
            [plan.x + 5.5, fy, cz + 2.4],
            [plan.x + 15, fy, cz + 2.4],
          ]) +
            poly([
              [plan.x + 5.5, fy, cz - 1],
              [plan.x + 12, fy, cz - 1],
            ]),
          { tone: 'mid', free: true },
        ),
      )
    }
  }
  // Status lamp: dark until the contacts close.
  const lamp = at([bx + 7.5, fy, top - 7.5])
  out.push(
    opts.on
      ? `<circle class="iso-glow" cx="${lamp[0].toFixed(1)}" cy="${lamp[1].toFixed(1)}" r="2.6"/><circle class="iso-signal" cx="${lamp[0].toFixed(1)}" cy="${lamp[1].toFixed(1)}" r="1"/>`
      : `<circle class="iso-wire-end" cx="${lamp[0].toFixed(1)}" cy="${lamp[1].toFixed(1)}" r="1"/>`,
  )
  // Finger notch on the top face.
  out.push(L(k.planOutline({ x: bx - 4, y: CART_Y + 1.6, w: 8, d: 2.8, r: 1.4 }, top, P, 3), { tone: 'lo' }))
  return out.join('')
}

export const STATIC = [
  basePlate(BASE, TOP, 8, 2, { feet: 14, groove: 5, screws: 9 }),
  labelPlate({ x: 52, y: 20, w: 36, d: 14, r: 1 }, TOP),
  engine(),
].join('')
export const FRONT = [bus(), L(traceOf(0), { tone: 'mid' })].join('')

// The live trace and the selector needle, drawn over the bus and the dial.
export function overlay(drop: number, selector: number) {
  const seated = drop < 0.05
  const out: string[] = []
  out.push(L(traceOf(1), seated ? { tone: 'lit', flow: true } : { tone: 'lo' }))
  const a = DETENT[0] + (DETENT[1] - DETENT[0]) * selector
  const tip: [number, number] = [DIAL[0] + Math.sin(a) * (DIAL_R - 4.2), DIAL[1] - Math.cos(a) * (DIAL_R - 4.2)]
  const tail: [number, number] = [DIAL[0] - Math.sin(a) * 3, DIAL[1] + Math.cos(a) * 3]
  out.push(
    `<path class="iso-line" data-tone="lit" data-free="start" style="stroke-width:1.2" d="${k.lineOnTop(tail, tip, DIAL_TOP + 0.2, P)}"/>`,
  )
  out.push(D([at([DIAL[0], DIAL[1], DIAL_TOP + 0.2])], { size: 0.9, tone: 'hi' }))
  return out.join('')
}

export function moving(drop: number) {
  const seated = drop < 0.05
  const out: string[] = []
  // Sockets and cartridges, far to near.
  for (const [i, bx] of byDepth(BAYS.map((x, i) => [x, i] as [number, number])).map(([x, i]) => [i, x])) {
    out.push(socket(bx, i === 1 && !seated))
    out.push(guide(bx, -1))
    if (i === 0) out.push(cartridge(bx, SOCKET_TOP - SEAT, { lit: false, on: true, mark: 'snow' }))
    else out.push(cartridge(bx, SOCKET_TOP - SEAT + drop, { lit: true, on: seated, mark: 'blank' }))
    out.push(guide(bx, 1))
  }
  return out.join('')
}

// The pose: the adapter drops and seats, then the selector turns to it, then back.
export function pose(p: number) {
  const drop = DROP * (1 - easeInOut(within(p, 0.05, 0.62)))
  const settle = drop < 0.05 ? 0 : drop
  const selector = easeOut(within(p, 0.7, 0.9))
  return { drop: settle, selector }
}

export function readoutOf(drop: number, selector: number) {
  if (drop > 0.05) return `adapters 1 · ${drop.toFixed(0)} to seat · engine edits 0`
  return selector > 0.5 ? 'routed to adapter 2 · engine edits 0' : 'adapters 2 · engine edits 0'
}

export const spec = {
  W,
  H,
  layout: [STATIC, 0, FRONT, 1],
  frame(p: number) {
    const { drop, selector } = pose(p)
    return {
      key: `${drop.toFixed(2)}|${selector.toFixed(3)}`,
      layers: [moving(drop), overlay(drop, selector)],
      readout: readoutOf(drop, selector),
    }
  },
}
