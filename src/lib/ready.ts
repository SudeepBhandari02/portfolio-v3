// The loader holds the page back on first visit. Intro timelines wait for it here.
let ready = false
const waiting = new Set<() => void>()

export function setReady() {
  if (ready) return
  ready = true
  waiting.forEach((fn) => fn())
  waiting.clear()
}

// Runs fn once the loader has left (immediately if it already has). Returns a cancel function.
export function onReady(fn: () => void) {
  if (ready) {
    fn()
    return () => {}
  }
  waiting.add(fn)
  return () => {
    waiting.delete(fn)
  }
}
