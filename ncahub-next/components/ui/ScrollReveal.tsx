'use client'
/**
 * ScrollReveal — wraps any children in a scroll-triggered entrance.
 *
 * Variants:
 *  - "slide-up"   : translate Y + opacity (default)
 *  - "clip-up"    : clip-path reveal (cinematic slide-up from bottom)
 *  - "fade"       : opacity only
 *  - "slide-left" : slide in from right
 *  - "slide-right": slide in from left
 *  - "scale"      : subtle scale-up + opacity
 *  - "line"       : 1px line drawing (width 0 → 100%)
 *
 * Usage:
 *   <ScrollReveal variant="clip-up" delay={0.2}>
 *     <h2>Big heading</h2>
 *   </ScrollReveal>
 */
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

type Variant = 'slide-up' | 'clip-up' | 'fade' | 'slide-left' | 'slide-right' | 'scale' | 'line'

interface ScrollRevealProps {
  children: React.ReactNode
  variant?: Variant
  delay?: number
  duration?: number
  distance?: number
  threshold?: string  // scrollTrigger start e.g. "top 85%"
  once?: boolean
  className?: string
  style?: React.CSSProperties
  as?: keyof React.JSX.IntrinsicElements
  stagger?: number   // if children is array of elements, stagger each
}

const DEFAULTS: Record<Variant, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  'slide-up': {
    from: { y: 60, opacity: 0 },
    to:   { y: 0,  opacity: 1 },
  },
  'clip-up': {
    from: { clipPath: 'inset(100% 0 0 0)', y: 30, opacity: 0 },
    to:   { clipPath: 'inset(0% 0 0 0)',   y: 0,  opacity: 1 },
  },
  'fade': {
    from: { opacity: 0 },
    to:   { opacity: 1 },
  },
  'slide-left': {
    from: { x: 60, opacity: 0 },
    to:   { x: 0,  opacity: 1 },
  },
  'slide-right': {
    from: { x: -60, opacity: 0 },
    to:   { x: 0,   opacity: 1 },
  },
  'scale': {
    from: { scale: 0.88, opacity: 0 },
    to:   { scale: 1,    opacity: 1 },
  },
  'line': {
    from: { scaleX: 0, transformOrigin: 'left center' },
    to:   { scaleX: 1, transformOrigin: 'left center' },
  },
}

export default function ScrollReveal({
  children,
  variant = 'slide-up',
  delay = 0,
  duration = 0.9,
  distance,
  threshold = 'top 88%',
  once = true,
  className,
  style,
  as: Tag = 'div',
  stagger = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null!)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const { from, to } = DEFAULTS[variant]

    // Override default distance if provided
    const fromFinal = { ...from }
    if (distance !== undefined) {
      if ('y' in fromFinal) fromFinal.y = distance
      if ('x' in fromFinal) fromFinal.x = distance
    }

    // Optionally stagger direct children
    const targets = stagger > 0 ? Array.from(el.children) : el

    const tween = gsap.fromTo(targets, fromFinal, {
      ...to,
      duration,
      ease: 'expo.out',
      delay,
      stagger: stagger > 0 ? stagger : 0,
      scrollTrigger: {
        trigger: el,
        start: threshold,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    })

    return () => { tween.kill() }
  }, [variant, delay, duration, threshold, once, stagger, distance])

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}
