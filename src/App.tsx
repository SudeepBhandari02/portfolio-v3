import { MotionConfig } from 'motion/react'
import { SmoothScroll } from './components/SmoothScroll'
import { Nav } from './components/Nav'
import { QueryBar } from './components/QueryBar'
import { Hero } from './sections/Hero'
import { Tagline } from './sections/Tagline'
import { Experience } from './sections/Experience'
import { Systems } from './sections/Systems'
import { Projects } from './sections/Projects'
import { Toolbox } from './sections/Toolbox'
import { Education } from './sections/Education'
import { Contact } from './sections/Contact'

export default function App() {
  return (
    // reducedMotion="user": Motion drops movement and keeps opacity for reduced motion users (B7).
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <a
          href="#main"
          className="button-sm fixed top-4 left-4 z-[60] -translate-y-24 rounded-full bg-fg px-3 py-2 text-ink-0 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <Tagline />
          <Experience />
          <Systems />
          <Projects />
          <Toolbox />
          <Education />
          <Contact />
        </main>
        <QueryBar />
      </SmoothScroll>
    </MotionConfig>
  )
}
