import { CERTIFICATIONS, EDUCATION } from '../lib/content'
import { Container, SectionHeader } from '../components/ui'
import { Reveal } from '../components/Reveal'

// A quiet table. After four loud sections, one that just sits still.
export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="py-24">
      <Container>
        <SectionHeader id="education" title={<span id="education-title">Education and certifications</span>} />

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="caption-4 font-mono text-fg-subtle">education · {EDUCATION.length} rows</p>
            <ul className="mt-4 divide-y divide-ink-3 border-y border-ink-3">
              {EDUCATION.map((e) => (
                <li key={e.title} className="grid gap-2 py-6 sm:grid-cols-[120px_1fr] sm:gap-6">
                  <p className="caption-4 font-mono text-signal sm:pt-1">{e.dates}</p>
                  <div>
                    <h3 className="title-2">{e.title}</h3>
                    <p className="body-6 mt-1 text-fg-muted">{e.org}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="caption-4 font-mono text-fg-subtle">certifications · {CERTIFICATIONS.length} rows</p>
            <ul className="mt-4 divide-y divide-ink-3 border-y border-ink-3">
              {CERTIFICATIONS.map((c) => (
                <li key={c.title} className="flex items-baseline justify-between gap-6 py-4">
                  <h3 className="title-3">{c.title}</h3>
                  <p className="caption-4 font-mono text-fg-subtle">{c.issuer}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
