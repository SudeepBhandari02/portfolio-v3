// The hero's surface: a sheet of small square cells that behaves like water.
// A slow swell moves through it on its own, the pointer raises the cells around it, and a click
// (or the orange cell landing) drops a stone: rings of lit cells travel outward and die away.
// Drawn on one 2D canvas; a few thousand tiny rects per frame.

const SIGNAL = '#ff6b2c'
const RING_SPEED = 560 // px per second
const RING_LIFE = 2.8 // seconds
const RING_WIDTH = 44
const POINTER_REACH = 130

type Ripple = { x: number; y: number; born: number }

export type CellField = ReturnType<typeof createCellField>

export function createCellField(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  let w = 0
  let h = 0
  let gap = 28
  let fg = '#ffffff'
  let raf = 0
  let running = false
  let now = 0
  let last = 0
  const ripples: Ripple[] = []
  const pointer = { x: 0, y: 0, on: false, strength: 0 }

  const readTheme = () => {
    fg = getComputedStyle(document.documentElement).getPropertyValue('--color-fg').trim() || '#ffffff'
  }
  const themeWatch = new MutationObserver(() => {
    readTheme()
    if (!running) draw()
  })
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.clientWidth
    h = canvas.clientHeight
    gap = w < 768 ? 22 : 28
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (!running) draw()
  }

  function draw() {
    ctx.clearRect(0, 0, w, h)
    const cols = Math.ceil(w / gap) + 1
    const rows = Math.ceil(h / gap) + 1
    const ox = (w - (cols - 1) * gap) / 2
    const oy = (h - (rows - 1) * gap) / 2
    const reach2 = 2 * POINTER_REACH * POINTER_REACH

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let x = ox + i * gap
        let y = oy + j * gap

        // Swell: two slow bands crossing, sharpened so most of the sheet stays quiet.
        const a = 0.5 + 0.5 * Math.sin(x * 0.0042 + y * 0.0061 - now * 0.55)
        const b = 0.5 + 0.5 * Math.sin(x * 0.0031 - y * 0.0047 + now * 0.38)
        const swell = Math.pow(a * b, 3)

        let hot = 0
        if (pointer.strength > 0.001) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          hot += Math.exp(-(dx * dx + dy * dy) / reach2) * pointer.strength
        }

        for (const r of ripples) {
          const age = now - r.born
          const dx = x - r.x
          const dy = y - r.y
          const d = Math.hypot(dx, dy) || 1
          const fade = 1 - age / RING_LIFE
          // A leading ring and two weaker ones trailing it.
          let ring = 0
          for (let k = 0; k < 3; k++) {
            const off = (d - (age * RING_SPEED - k * 96)) / RING_WIDTH
            ring += Math.exp(-off * off) * (1 - k * 0.34)
          }
          ring *= fade * fade
          hot += ring
          // The ring lifts cells outward as it passes.
          x += (dx / d) * ring * 7
          y += (dy / d) * ring * 7
        }

        hot = Math.min(hot, 1)
        const size = 1.5 + swell * 3.5 + hot * 9
        if (hot > 0.06) {
          ctx.fillStyle = SIGNAL
          ctx.globalAlpha = 0.2 + hot * 0.8
        } else {
          ctx.fillStyle = fg
          ctx.globalAlpha = 0.13 + swell * 0.4
        }
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
      }
    }
    ctx.globalAlpha = 1
  }

  function frame(t: number) {
    const dt = Math.min((t - last) / 1000, 0.05)
    last = t
    now += dt
    pointer.strength += ((pointer.on ? 1 : 0) - pointer.strength) * Math.min(1, dt * 6)
    while (ripples.length && now - ripples[0].born > RING_LIFE) ripples.shift()
    draw()
    raf = requestAnimationFrame(frame)
  }

  readTheme()
  resize()

  return {
    resize,
    start() {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    },
    stop() {
      running = false
      cancelAnimationFrame(raf)
    },
    // Drop a stone. Coordinates are relative to the canvas.
    drop(x: number, y: number) {
      if (ripples.length > 5) ripples.shift()
      ripples.push({ x, y, born: now })
    },
    point(x: number, y: number) {
      pointer.x = x
      pointer.y = y
      pointer.on = true
    },
    release() {
      pointer.on = false
    },
    // Spreadsheet style address of the cell under a point, for the readout.
    address(x: number, y: number) {
      const col = Math.max(0, Math.round(x / gap))
      const row = Math.max(0, Math.round(y / gap))
      return `R${String(row).padStart(2, '0')}:C${String(col).padStart(2, '0')}`
    },
    destroy() {
      running = false
      cancelAnimationFrame(raf)
      themeWatch.disconnect()
    },
  }
}
