import { gsap } from './gsap'

// The hero's cell field. A raw table of a few thousand cells that, as progress goes 0 to 1,
// filters out its weakest values and sorts the rest into a bar chart.
// The orange cells hidden in the noise all end up in the tallest bar: the answer.
// Drawn on canvas, batched by color, and only redrawn when something changed.

// Grey value levels 0 to 5, then the signal color.
const LEVELS = ['#1f1f1f', '#272727', '#313131', '#3e3e3e', '#5c5c5c', '#9b9b9b', '#ff6b2c']
const SIGNAL = 6
const ALPHA_STEPS = 9

// Bar heights left to right, as a share of the field height. An abstract shape, not data.
const SHAPE = [0.16, 0.22, 0.19, 0.3, 0.27, 0.38, 0.34, 0.47, 0.44, 0.58, 0.55, 0.7, 0.66, 0.84, 1]
const shapeAt = (u: number) => {
  const x = u * (SHAPE.length - 1)
  const i = Math.floor(x)
  const j = Math.min(i + 1, SHAPE.length - 1)
  return SHAPE[i] + (SHAPE[j] - SHAPE[i]) * (x - i)
}

// Seeded so the field looks the same on every visit.
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

const BAR = 4 // columns per bar; one empty column between bars
const KEEP_SPAN = 0.38
const DROP_SPAN = 0.28

export type Field = {
  layout: () => void
  setProgress: (p: number) => void
  start: () => void
  stop: () => void
}

export function createField(
  canvas: HTMLCanvasElement,
  region: HTMLElement,
  onLayout?: (cells: number, bars: number) => void,
): Field {
  const ctx = canvas.getContext('2d')!
  const ease = gsap.parseEase('base') as (t: number) => number

  let n = 0
  let size = 8
  let rx = new Float32Array(0)
  let ry = new Float32Array(0)
  let tx = new Float32Array(0)
  let ty = new Float32Array(0)
  let delay = new Float32Array(0)
  let arc = new Float32Array(0)
  let lvl = new Uint8Array(0)
  let kept = new Uint8Array(0)
  let flash = new Float64Array(0)
  const axis = { x: 0, y: 0, w: 0 }

  let p = 0
  let dirty = true
  let running = false
  let lastFlash = 0
  const flashRand = rng(99)
  const buckets: number[][] = Array.from({ length: LEVELS.length * ALPHA_STEPS }, () => [])

  function layout() {
    const c = canvas.getBoundingClientRect()
    const r = region.getBoundingClientRect()
    if (!c.width || !r.width || !r.height) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(c.width * dpr)
    canvas.height = Math.round(c.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const ox = Math.round(r.left - c.left)
    const oy = Math.round(r.top - c.top)
    const pitch = r.width >= 520 ? 10 : 8
    size = pitch - 2
    const cols = Math.floor((r.width + 2) / pitch)
    const rows = Math.floor((r.height + 2) / pitch)
    if (cols < 10 || rows < 6) return
    const gx = ox + Math.floor((r.width - (cols * pitch - 2)) / 2)
    const gy = oy + Math.floor(r.height - (rows * pitch - 2))

    n = cols * rows
    rx = new Float32Array(n)
    ry = new Float32Array(n)
    tx = new Float32Array(n)
    ty = new Float32Array(n)
    delay = new Float32Array(n)
    arc = new Float32Array(n)
    lvl = new Uint8Array(n)
    kept = new Uint8Array(n)
    flash = new Float64Array(n)
    const rand = rng(7)

    // Raw values: a slow wave plus grain, so it reads like data, not static.
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col
        rx[i] = gx + col * pitch
        ry[i] = gy + row * pitch
        const wave = Math.sin(col * 0.19 + row * 0.05) * Math.cos(row * 0.13 - col * 0.07)
        const v = clamp01(0.5 + wave * 0.32 + (rand() - 0.5) * 0.5)
        lvl[i] = Math.min(5, Math.floor(v * 6))
      }
    }

    // Bars, bottom aligned to the field.
    const bars = Math.max(3, Math.floor((cols + 1) / (BAR + 1)))
    const barCols = bars * (BAR + 1) - 1
    const bx = gx + Math.floor((cols - barCols) / 2) * pitch
    let heights = Array.from({ length: bars }, (_, k) => Math.max(2, Math.round(shapeAt(k / (bars - 1)) * rows * 0.92)))
    const cap = heights.reduce((a, h) => a + h, 0) * BAR
    if (cap > n * 0.55) heights = heights.map((h) => Math.max(2, Math.floor((h * n * 0.55) / cap)))

    // The signal cells: exactly enough to fill the last bar, scattered through the noise.
    const order = Array.from({ length: n }, (_, i) => i)
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    const last = bars - 1
    const signalCount = heights[last] * BAR
    for (let j = 0; j < signalCount; j++) lvl[order[j]] = SIGNAL

    const place = (cells: number[], k: number) => {
      // Lower cells in the raw table go to lower slots, which keeps paths readable.
      cells.sort((a, b) => ry[b] - ry[a] || rx[a] - rx[b])
      cells.forEach((i, slot) => {
        const c = slot % BAR
        const rr = Math.floor(slot / BAR)
        tx[i] = bx + (k * (BAR + 1) + c) * pitch
        ty[i] = gy + (rows - 1 - rr) * pitch
        kept[i] = 1
      })
    }

    place(order.slice(0, signalCount), last)

    // Everything else sorted by value: brightest to the tall bars on the right.
    const rest = order.slice(signalCount).sort((a, b) => lvl[b] - lvl[a])
    let cursor = 0
    for (let k = last - 1; k >= 0; k--) {
      const take = heights[k] * BAR
      place(rest.slice(cursor, cursor + take), k)
      cursor += take
    }

    // Timing: a left to right scan for kept cells; filtered cells fall away first.
    const gw = cols * pitch
    for (let i = 0; i < n; i++) {
      if (kept[i]) {
        delay[i] = 0.12 + 0.38 * ((rx[i] - gx) / gw) + rand() * 0.12
        arc[i] = 20 + rand() * 70
      } else {
        delay[i] = rand() * 0.22
      }
    }

    axis.x = bx
    axis.y = gy + rows * pitch
    axis.w = barCols * pitch - 2
    dirty = true
    onLayout?.(n, bars)
    draw(performance.now())
  }

  function draw(now: number) {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    for (const b of buckets) b.length = 0

    const live = p < 0.02
    for (let i = 0; i < n; i++) {
      let x = rx[i]
      let y = ry[i]
      let a = 1
      let L = lvl[i]
      if (kept[i]) {
        const t = clamp01((p - delay[i]) / KEEP_SPAN)
        if (t > 0) {
          const e = ease(t)
          x += (tx[i] - x) * e
          y += (ty[i] - y) * e - Math.sin(Math.PI * t) * arc[i]
        }
      } else {
        const t = clamp01((p - delay[i]) / DROP_SPAN)
        if (t > 0) {
          const e = ease(t)
          y += e * 16
          a = 1 - e
          if (a < 0.06) continue
        }
      }
      if (live && L !== SIGNAL && flash[i] > now) L = Math.min(5, L + 2)
      buckets[L * ALPHA_STEPS + Math.round(a * (ALPHA_STEPS - 1))].push(x, y)
    }

    for (let b = 0; b < buckets.length; b++) {
      const list = buckets[b]
      if (!list.length) continue
      ctx.globalAlpha = (b % ALPHA_STEPS) / (ALPHA_STEPS - 1)
      ctx.fillStyle = LEVELS[Math.floor(b / ALPHA_STEPS)]
      ctx.beginPath()
      for (let j = 0; j < list.length; j += 2) ctx.rect(list[j], list[j + 1], size, size)
      ctx.fill()
    }

    // Chart baseline, once the bars have formed.
    if (p > 0.6) {
      ctx.globalAlpha = clamp01((p - 0.6) / 0.3)
      ctx.fillStyle = '#5c5c5c'
      ctx.fillRect(axis.x, axis.y, axis.w, 1)
    }
    ctx.globalAlpha = 1
    dirty = false
  }

  const tick = () => {
    const now = performance.now()
    // While untouched, a few cells tick over: the table is live.
    if (p < 0.02 && now - lastFlash > 80 && n) {
      lastFlash = now
      const count = Math.ceil(n * 0.006)
      for (let k = 0; k < count; k++) flash[Math.floor(flashRand() * n)] = now + 260
      dirty = true
    }
    if (dirty) draw(now)
  }

  return {
    layout,
    setProgress(v) {
      if (v === p) return
      p = v
      dirty = true
      if (!running) draw(performance.now())
    },
    start() {
      if (running) return
      running = true
      gsap.ticker.add(tick)
    },
    stop() {
      running = false
      gsap.ticker.remove(tick)
    },
  }
}
