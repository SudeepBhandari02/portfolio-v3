import { SmoothScroll } from './components/SmoothScroll'
import { Nav } from './components/Nav'
import { Cursor } from './components/Cursor'
import { Loader } from './components/Loader'
import { Transition } from './components/Transition'
import { Home } from './pages/Home'
import { Axion } from './pages/Axion'
import { useRoute } from './lib/router'

export default function App() {
  const route = useRoute()
  return (
    <SmoothScroll>
      {/* A button, not an anchor: the hash belongs to the router. */}
      <button
        type="button"
        data-chrome
        onClick={() => document.getElementById('main')?.focus()}
        className="btn fixed top-3 left-3 z-[110] -translate-y-24 focus:translate-y-0"
      >
        Skip to content
      </button>
      <Nav />
      {/* key: a route change remounts the page, so every ScrollTrigger of the old one is torn down first. */}
      <main id="main" key={route} tabIndex={-1} className="outline-none">
        {route === '/work/axionbi' ? <Axion /> : <Home />}
      </main>
      <Cursor />
      <Transition />
      <Loader />
    </SmoothScroll>
  )
}
