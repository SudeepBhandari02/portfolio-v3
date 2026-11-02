// Single place to register GSAP plugins. Import gsap/ScrollTrigger/useGSAP from here.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP)

// The base curve from the design system (B7). Use ease: 'base' for every tween.
CustomEase.create('base', '0.22,1,0.36,1')

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)'

export { gsap, ScrollTrigger, useGSAP }
