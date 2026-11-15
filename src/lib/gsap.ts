// Single place to register GSAP plugins. Import gsap / ScrollTrigger / SplitText / useGSAP from here.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)

// The two curves of the site. 'soft' settles things into place, 'cut' moves whole surfaces.
CustomEase.create('soft', '0.16,1,0.3,1')
CustomEase.create('cut', '0.76,0,0.24,1')

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)'
export const DESKTOP = '(min-width: 768px)'

export const reducedMotion = () => window.matchMedia(MOTION_REDUCED).matches

export { gsap, ScrollTrigger, SplitText, useGSAP }
