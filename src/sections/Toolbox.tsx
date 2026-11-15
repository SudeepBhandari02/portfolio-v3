import { CERTIFICATIONS, EDUCATION, TOOLBOX } from '../lib/content'
import { Label } from '../components/ui'
import { Marquee } from '../components/Marquee'
import { Wipe } from '../components/Wipe'

// Three bands for the marquee, each a mix of categories so no band reads as a list.
const BANDS = [0, 1, 2].map((b) => TOOLBOX.flatMap((g) => g.tools).filter((_, i) => i % 3 === b))

function Band({ tools, outline }: { tools: string[]; outline?: boolean }) {
  return (
    <>
      {tools.map((t) => (
        <span key={t} className="flex items-center">
          <span className={`vf t-display px-[0.18em] whitespace-nowrap ${outline ? 'outline-type' : ''}`}>{t}</span>
          <span className="size-[clamp(0.6rem,1.4vw,1.5rem)] shrink-0 bg-signal" />
        </span>
      ))}
    </>
  )
}

// The tools, twice: once as moving type you feel, once as a table you can read.
export function Toolbox() {
  return (
    <section id="toolbox" aria-labelledby="tools-title" className="rule-t relative pb-[58vh]">
      <header className="gutter grid grid-cols-12 items-end gap-x-4 pt-[12vh] pb-[8vh]">
        <div className="col-span-12 md:col-span-3">
          <Label index="03">Toolbox</Label>
        </div>
        <h2 id="tools-title" data-reveal="lines" className="vf t-display col-span-12 mt-6 md:col-span-9 md:mt-0">
          What I reach for
        </h2>
      </header>

      <div className="flex flex-col gap-[1.5vw] py-[2vh]">
        <Marquee speed={70}>
          <Band tools={BANDS[0]} />
        </Marquee>
        <Marquee speed={50} dir={-1}>
          <Band tools={BANDS[1]} outline />
        </Marquee>
        <Marquee speed={85}>
          <Band tools={BANDS[2]} />
        </Marquee>
      </div>

      <div className="gutter mt-[10vh] grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
        {TOOLBOX.map((g) => (
          <div key={g.category} data-reveal="up" className="rule-t pt-4">
            <h3 className="t-label text-fg-muted">{g.category}</h3>
            <ul className="mt-4 space-y-1">
              {g.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="gutter mt-[16vh] grid grid-cols-12 gap-x-4 gap-y-12">
        <div className="col-span-12 md:col-span-3">
          <Label index="04">Education</Label>
        </div>
        <div className="col-span-12 md:col-span-9">
          <ul>
            {EDUCATION.map((e) => (
              <li key={e.title} data-reveal="up" className="rule-t grid grid-cols-9 items-baseline gap-x-4 gap-y-1 py-6">
                <h3 className="t-h3 col-span-9 md:col-span-4">{e.title}</h3>
                <p className="col-span-9 text-fg-muted md:col-span-3">{e.org}</p>
                <p className="t-label nums col-span-9 text-fg-muted md:col-span-2 md:text-right">{e.dates}</p>
              </li>
            ))}
          </ul>
          <h3 className="t-label mt-12 text-fg-muted">Certifications</h3>
          <ul className="mt-4 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            {CERTIFICATIONS.map((c) => (
              <li key={c.title} data-reveal="up" className="rule-t flex items-baseline justify-between gap-6 py-4">
                <span>{c.title}</span>
                <span className="t-label text-fg-muted">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Wipe to="signal" />
    </section>
  )
}
