// The fixed nav sits over black and orange surfaces. Whatever is painted under it decides its ink:
// the surface carries data-nav="ink" (dark text) or nothing (white text).
const PROBE_X = 40
const PROBE_Y = 30

let queued = false

function apply() {
  queued = false
  const stack = document.elementsFromPoint(PROBE_X, PROBE_Y)
  const under = stack.find((el) => !el.closest('[data-chrome]'))
  const theme = under?.closest<HTMLElement>('[data-nav]')?.dataset.nav ?? 'paper'
  const root = document.documentElement
  if (root.dataset.nav !== theme) root.dataset.nav = theme
}

export function updateNavTheme() {
  if (queued) return
  queued = true
  requestAnimationFrame(apply)
}
