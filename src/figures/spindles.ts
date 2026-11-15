// Fig 4 · Sorting gantry. "GROUP BY category."
// Six spindles on a bench, one per toolbox line, each with a pip plate (L1 has one pip, L6 six).
// Every tool is a washer waiting in a feed magazine. Scrolling runs a pick and place gantry:
// the carriage takes the next washer off the magazine, carries it to the spindle of its group
// and lets it drop down the rod. The stacks grow to the real counts: 4, 8, 7, 10, 6, 7.
import { TOOLBOX } from '../lib/content'
import { rng } from '../lib/field'
import { k, kitFor, easeInOut, within, type Point3 } from './shared'

export const W = 600
export const H = 380

const COUNTS = TOOLBOX.map((g) => g.tools.length)
export const TOTAL = COUNTS.reduce((a, b) => a + b, 0)
const BASE = { x: -164, y: -30, w: 300, d: 54, r: 5 }
const TOP = 10
const SPACING = 40
const XS = COUNTS.map((_, i) => (i - (COUNTS.length - 1) / 2) * SPACING)
const SY = -6
const COLLAR_TOP = 15
const WASHER_H = 2.4
const WASHER_R = 6
const HOLE_R = 1.9
const ROD_R = 1.5
const ROD_TOP = COLLAR_TOP + Math.max(...COUNTS) * WASHER_H + 14
const START = ROD_TOP + 6 // carry height: the washer's bottom, clear of every rod tip
const FEED_X = -136
const BEAM = { x: -160, y: SY - 17, w: 292, d: 5, r: 1 }
const BEAM_Z = START + WASHER_H + 5
const POSTS = [-154, 126]
const CARRIAGE_Z = BEAM_Z - 1.5

// A fixed shuffle of every tool: the order the washers arrive in.
export const ARRIVALS = (() => {
  const list: { group: number; index: number; name: string }[] = []
  TOOLBOX.forEach((g, gi) => g.tools.forEach((t, ti) => list.push({ group: gi, index: ti, name: t })))
  const rand = rng(7)
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  // Re-number each washer by its place in its own stack.
  const seen = COUNTS.map(() => 0)
  return list.map((a) => ({ ...a, slot: seen[a.group]++ }))
})()

const P = k.fitProjection([...k.boxCorners(BASE, -2, 0), ...k.boxCorners(BEAM, BEAM_Z, BEAM_Z + 12)], W, H, {
  pad: 24,
  azimuth: 64,
})
const K = kitFor(P)
const { L, D, slab, cyl, at, poly, rectY, screws, basePlate } = K

function bench() {
  const out: string[] = [basePlate(BASE, TOP, 7, 2, { feet: 16, groove: 4.5, screws: 8 })]
  // Ruler strip along the front.
  const strip = { x: BASE.x + 14, y: BASE.y + BASE.d - 9, w: BASE.w - 28, d: 5, r: 0.8 }
  out.push(slab(strip, TOP, 0.5, { tone: 'lo', crease: 'none' }, 2))
  const t = k.topTicks(strip.x + 2, strip.x + strip.w - 2, 4, 5, strip.y + 0.6, TOP + 0.5, [1.4, 2.6], P)
  out.push(L(t.minor, { tone: 'lo' }), L(t.major, { tone: 'mid' }))
  // Pip plates: one pip per line number.
  XS.forEach((x, i) => {
    const plan = { x: x - 9, y: SY + 9, w: 18, d: 6.5, r: 1 }
    out.push(slab(plan, TOP, 0.8, { tone: 'lo' }, 2))
    out.push(L(k.planOutline(k.insetPlan(plan, 1.2), TOP + 0.8, P, 2), { tone: 'faint' }))
    const n = i + 1
    const pips: [number, number][] = []
    for (let p = 0; p < n; p++) pips.push(at([x - ((n - 1) * 2.2) / 2 + p * 2.2, plan.y + plan.d / 2, TOP + 0.8]))
    out.push(D(pips, { size: 0.65, tone: 'hi' }))
  })
  return out.join('')
}

function washer(x: number, z: number, lit: boolean) {
  const out: string[] = []
  out.push(cyl(x, SY, WASHER_R, z, WASHER_H, { tone: 'hi', lit, crease: lit ? 'mid' : 'lo' }, 40, 0.5))
  const hole = k.ring(x, SY, HOLE_R, z + WASHER_H, P, 24)
  out.push(`<path class="iso-void" d="${hole}Z"/>`)
  out.push(L(hole, { tone: lit ? 'lit' : 'lo' }))
  return out.join('')
}

const rodPiece = (x: number, z0: number, z1: number) =>
  z1 - z0 > 0.05 ? cyl(x, SY, ROD_R, z0, z1 - z0, { tone: 'mid', crease: 'none' }, 16) : ''

// One spindle with `n` washers seated and, optionally, one falling at height `fz`.
function spindle(i: number, n: number, fz: number | null) {
  const x = XS[i]
  const out: string[] = []
  out.push(cyl(x, SY, 8, TOP, 1.4, { tone: 'lo' }, 36))
  out.push(
    screws(
      [0, 1, 2].map((s) => {
        const a = 0.5 + (s * Math.PI * 2) / 3
        return [x + Math.cos(a) * 6.6, SY + Math.sin(a) * 6.6, TOP + 1.4] as Point3
      }),
      0.45,
    ),
  )
  out.push(cyl(x, SY, 4.2, TOP + 1.4, COLLAR_TOP - TOP - 1.4, { tone: 'mid' }, 28))
  out.push(L(k.knurl(x, SY, 4.2, TOP + 1.4, COLLAR_TOP, 20, P, 0.3), { tone: 'lo' }))
  let z = COLLAR_TOP
  for (let w = 0; w < n; w++) {
    out.push(washer(x, z, false))
    z += WASHER_H
  }
  if (fz !== null && fz > z + 0.02) {
    out.push(rodPiece(x, z, Math.min(fz, ROD_TOP)))
    out.push(washer(x, fz, true))
    if (fz + WASHER_H < ROD_TOP) out.push(rodPiece(x, fz + WASHER_H, ROD_TOP))
  } else {
    out.push(rodPiece(x, z, ROD_TOP))
  }
  // Chamfered tip, drawn only when no washer hangs over it.
  if (fz === null || fz + WASHER_H < ROD_TOP || fz > ROD_TOP) out.push(cyl(x, SY, 1, ROD_TOP, 1, { tone: 'mid' }, 12))
  return out.join('')
}

function post(x: number) {
  const out: string[] = []
  const y = BEAM.y + BEAM.d / 2
  out.push(slab({ x: x - 6, y: y - 6, w: 12, d: 12, r: 1 }, TOP, 2, { tone: 'lo' }, 2, 0.4))
  out.push(
    screws(
      [
        [x - 4, y - 4, TOP + 2],
        [x + 4, y + 4, TOP + 2],
      ],
      0.45,
    ),
  )
  out.push(slab({ x: x - 3, y: y - 3, w: 6, d: 6, r: 0.8 }, TOP + 2, BEAM_Z - TOP - 2, { tone: 'mid' }, 2, 0.4))
  out.push(L(k.sideSeam({ x: x - 3, y: y - 3, w: 6, d: 6, r: 0.8 }, BEAM_Z - 8, P, 2), { tone: 'faint' }))
  return out.join('')
}

function beam() {
  const out: string[] = []
  out.push(slab(BEAM, BEAM_Z, 5, { tone: 'mid' }, 2, 0.5))
  // The toothed belt along the beam front, between two pulley caps.
  const fy = BEAM.y + BEAM.d
  out.push(
    L(
      poly([
        [BEAM.x, fy, BEAM_Z + 1.6],
        [BEAM.x + BEAM.w, fy, BEAM_Z + 1.6],
      ]) +
        poly([
          [BEAM.x, fy, BEAM_Z + 3.4],
          [BEAM.x + BEAM.w, fy, BEAM_Z + 3.4],
        ]),
      { tone: 'lo' },
    ),
  )
  for (const x of [BEAM.x + 6, BEAM.x + BEAM.w - 6]) {
    out.push(cyl(x, BEAM.y + BEAM.d / 2, 3.4, BEAM_Z + 5, 2, { tone: 'mid' }, 24))
    out.push(D([at([x, BEAM.y + BEAM.d / 2, BEAM_Z + 7])], { size: 0.5, tone: 'hi' }))
  }
  // Motor on the right end of the beam.
  out.push(slab({ x: BEAM.x + BEAM.w - 20, y: BEAM.y - 8, w: 12, d: 8, r: 1 }, BEAM_Z, 10, { tone: 'mid' }, 2, 0.4))
  out.push(
    L(k.sideSeam({ x: BEAM.x + BEAM.w - 20, y: BEAM.y - 8, w: 12, d: 8, r: 1 }, BEAM_Z + 7, P, 2), { tone: 'faint' }),
  )
  return out.join('')
}

// Feed magazine: the unsorted washers, with a sight slot whose level falls as they are used.
const MAG = { x: FEED_X - 9, y: SY - 9, w: 18, d: 18, r: 1.5 }
function magazine(remaining: number, presented: boolean) {
  const out: string[] = []
  out.push(slab(MAG, TOP, START - TOP, { tone: 'mid' }, 3, 0.6))
  const fy = MAG.y + MAG.d
  const z0 = TOP + 6
  const z1 = START - 6
  out.push(`<path class="iso-void" d="${rectY(fy, FEED_X - 2, FEED_X + 2, z0, z1)}"/>`)
  out.push(L(rectY(fy, FEED_X - 2, FEED_X + 2, z0, z1), { tone: 'lo' }))
  const level = z0 + (z1 - z0) * (remaining / TOTAL)
  if (remaining > 0)
    out.push(
      L(
        poly([
          [FEED_X - 2, fy, level],
          [FEED_X + 2, fy, level],
        ]),
        { tone: 'lit' },
      ),
    )
  // Scale ticks hang from the right edge of the slot.
  const ticks: string[] = []
  for (let i = 0; i <= 6; i++) {
    const z = z0 + ((z1 - z0) * i) / 6
    ticks.push(
      poly([
        [FEED_X + 2, fy, z],
        [FEED_X + (i % 3 === 0 ? 5 : 3.6), fy, z],
      ]),
    )
  }
  out.push(L(ticks.join(''), { tone: 'lo' }))
  out.push(
    screws(
      [
        [MAG.x + 2.5, fy, START - 2.5],
        [MAG.x + MAG.w - 2.5, fy, START - 2.5],
      ],
      0.4,
    ),
  )
  out.push(L(k.ring(FEED_X, SY, WASHER_R + 0.8, START, P, 32), { tone: 'faint' }))
  if (presented) out.push(washer(FEED_X, START, false))
  return out.join('')
}

// The carriage on the beam, with its gripper, carrying a washer or not.
function carriage(x: number, carrying: boolean) {
  const out: string[] = []
  const plan = { x: x - 8, y: BEAM.y + BEAM.d, w: 16, d: 14, r: 1.4 }
  out.push(slab(plan, CARRIAGE_Z, 9, { tone: 'mid' }, 2, 0.5))
  out.push(
    screws(
      [
        [plan.x + 2.5, plan.y + 2.5, CARRIAGE_Z + 9],
        [plan.x + plan.w - 2.5, plan.y + 2.5, CARRIAGE_Z + 9],
        [plan.x + 2.5, plan.y + plan.d - 2.5, CARRIAGE_Z + 9],
        [plan.x + plan.w - 2.5, plan.y + plan.d - 2.5, CARRIAGE_Z + 9],
      ],
      0.45,
    ),
  )
  out.push(L(k.sideSeam(plan, CARRIAGE_Z + 3, P, 2), { tone: 'faint' }))
  // Gripper tube down to the washer's hole.
  out.push(cyl(x, SY, 2.4, START + WASHER_H + 0.6, CARRIAGE_Z - START - WASHER_H - 0.6, { tone: 'mid' }, 20))
  out.push(L(k.sideArc(x, SY, 2.4, CARRIAGE_Z - 1.4, P, 16), { tone: 'faint' }))
  if (carrying) out.push(washer(x, START, true))
  out.push(cyl(x, SY, 1.4, START + WASHER_H - 0.4, 1, { tone: carrying ? 'hi' : 'mid' }, 14))
  return out.join('')
}

export const STATIC = bench() + post(POSTS[0]) + beam()

// State at a number of arrivals done (fractional: the next washer is part way down).
export function stateAt(done: number) {
  const whole = Math.floor(done)
  const share = done - whole
  const seated = COUNTS.map(() => 0)
  for (let a = 0; a < Math.min(whole, TOTAL); a++) seated[ARRIVALS[a].group]++
  const falling = whole < TOTAL && share > 0.001 ? ARRIVALS[whole] : null
  return { seated, falling, share, whole }
}

// Each washer's cycle: the carriage returns to the magazine (0 to .3), carries the washer to its
// spindle (.3 to .62), then the washer drops down the rod (.62 to 1).
export function cycleOf(done: number) {
  const { seated, falling, share, whole } = stateAt(done)
  const prevX = whole > 0 ? XS[ARRIVALS[Math.min(whole, TOTAL) - 1].group] : FEED_X
  if (!falling)
    return { seated, cx: prevX, carrying: false, drop: null as null | { group: number; z: number }, picked: whole }
  const target = XS[falling.group]
  let cx = prevX
  let carrying = false
  let drop: null | { group: number; z: number } = null
  if (share < 0.3) cx = prevX + (FEED_X - prevX) * easeInOut(share / 0.3)
  else if (share < 0.62) {
    cx = FEED_X + (target - FEED_X) * easeInOut((share - 0.3) / 0.32)
    carrying = true
  } else {
    cx = target
    const z = COLLAR_TOP + seated[falling.group] * WASHER_H
    drop = { group: falling.group, z: START + (z - START) * easeInOut((share - 0.62) / 0.38) }
  }
  return { seated, cx, carrying, drop, picked: whole + (share >= 0.3 ? 1 : 0) }
}

export function moving(done: number) {
  const { seated, cx, carrying, drop, picked } = cycleOf(done)
  const remaining = TOTAL - picked
  const out = [magazine(remaining, remaining > 0)]
  XS.forEach((_, i) => out.push(spindle(i, seated[i], drop && drop.group === i ? drop.z : null)))
  out.push(post(POSTS[1]))
  out.push(carriage(cx, carrying))
  return out.join('')
}

// The drop runs from just after the section heading enters to just before it leaves.
export const pose = (p: number) => TOTAL * within(p, 0.03, 0.95)

export function readoutOf(done: number) {
  const { seated, falling, whole } = stateAt(done)
  if (whole >= TOTAL) return `${TOTAL} tools · ${COUNTS.length} groups`
  if (!falling) return `0 of ${TOTAL} sorted`
  const g = TOOLBOX[falling.group]
  return `${whole} of ${TOTAL} · ${falling.name} → ${g.line} (${seated[falling.group] + 1})`
}

export const spec = {
  W,
  H,
  layout: [STATIC, 0],
  frame(p: number) {
    const d = pose(p)
    return { key: d.toFixed(3), layers: [moving(d)], readout: readoutOf(d) }
  },
}
