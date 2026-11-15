import type { RefObject } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK } from '../lib/gsap'

// One reveal vocabulary for the whole site, declared in markup:
//   data-reveal="lines"   text rises line by line out of a mask
//   data-reveal="up"      block fades up (siblings in the same parent stagger)
//   data-reveal="rule"    a hairline draws from the left
//   data-reveal="image"   a clipped frame opens while the image inside settles
//   data-parallax="12"    drifts by that many percent across its time on screen
//   data-count="257"      counts up to the number once seen
// Everything is visible by default; these only run when motion is allowed.
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(scope)

        q('[data-reveal="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 105,
                duration: 1,
                ease: 'soft',
                stagger: 0.07,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          })
        })

        ScrollTrigger.batch(q('[data-reveal="up"]'), {
          start: 'top 90%',
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { y: 28, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9, ease: 'soft', stagger: 0.07, overwrite: true },
            ),
        })
        gsap.set(q('[data-reveal="up"]'), { opacity: 0 })

        q('[data-reveal="rule"]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left',
            duration: 1.2,
            ease: 'cut',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          })
        })

        q('[data-reveal="image"]').forEach((el) => {
          const img = el.querySelector('img')
          gsap.fromTo(
            el,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.3,
              ease: 'cut',
              scrollTrigger: { trigger: el, start: 'top 82%', once: true },
            },
          )
          if (img)
            gsap.fromTo(
              img,
              { scale: 1.18 },
              { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 40%', scrub: true } },
            )
        })

        q('[data-parallax]').forEach((el) => {
          const amount = Number((el as HTMLElement).dataset.parallax)
          gsap.fromTo(
            el,
            { yPercent: amount },
            { yPercent: -amount, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })

        q('[data-count]').forEach((el) => {
          const target = Number((el as HTMLElement).dataset.count)
          const n = { v: 0 }
          el.textContent = '0'
          gsap.to(n, {
            v: target,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            onUpdate: () => {
              el.textContent = Math.round(n.v).toLocaleString('en-US')
            },
          })
        })
      })
    },
    { scope },
  )
}
