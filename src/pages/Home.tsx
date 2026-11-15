import { useRef } from 'react'
import { useReveals } from '../components/Reveals'
import { Hero } from '../sections/Hero'
import { Manifesto } from '../sections/Manifesto'
import { Work } from '../sections/Work'
import { Experience } from '../sections/Experience'
import { Toolbox } from '../sections/Toolbox'
import { Contact } from '../sections/Contact'

export function Home() {
  const root = useRef<HTMLDivElement>(null)
  useReveals(root)
  return (
    <div ref={root}>
      <Hero />
      <Manifesto />
      <Work />
      <Experience />
      <Toolbox />
      <Contact />
    </div>
  )
}
