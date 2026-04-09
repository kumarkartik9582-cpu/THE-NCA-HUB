'use client'
import { useEffect, useState, useCallback } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Preloader from '@/components/ui/Preloader'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const onPreloaderComplete = useCallback(() => setPreloaderDone(true), [])
  useEffect(() => {
    // Low-end device detection
    const conn = (navigator as any).connection
    const isLowEnd =
      (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.saveData)) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    if (isLowEnd) document.documentElement.classList.add('nca-low-end')

    // Lenis smooth scroll synced with GSAP
    const lenis = new Lenis({ autoRaf: false })
    const lenisRaf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(lenisRaf)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    // Pause GSAP ticker when tab is hidden (saves CPU in background)
    const onVisibility = () => {
      if (document.hidden) {
        gsap.ticker.sleep()
      } else {
        gsap.ticker.wake()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Scroll progress + discovery bar
    const prog = document.getElementById('prog')
    const bar = document.getElementById('discovery-bar')
    const onScroll = () => {
      const s = window.scrollY
      const t = document.documentElement.scrollHeight - window.innerHeight
      if (prog && t > 0) prog.style.transform = `scaleX(${(s / t).toFixed(4)})`
      if (bar) bar.classList.toggle('hidden', s > 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Ambient cursor spotlight — pauses when hidden
    const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth <= 768
    let spotlightRafId = 0
    let spotlightStyle: HTMLStyleElement | null = null

    if (!IS_MOBILE && !isLowEnd) {
      if (!document.getElementById('nca-spotlight')) {
        spotlightStyle = document.createElement('style')
        spotlightStyle.id = 'nca-spotlight'
        spotlightStyle.textContent = `
          body::after {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            background: radial-gradient(
              700px circle at var(--mx, 50%) var(--my, 50%),
              rgba(201,168,76,0.045) 0%,
              rgba(201,168,76,0.015) 30%,
              transparent 60%
            );
          }
        `
        document.head.appendChild(spotlightStyle)
      }

      let mx = 50, my = 50, tx = 50, ty = 50
      document.addEventListener('mousemove', (e) => {
        tx = e.clientX / window.innerWidth * 100
        ty = e.clientY / window.innerHeight * 100
      }, { passive: true })

      const lerp = () => {
        if (!document.hidden) {
          mx += (tx - mx) * 0.06
          my += (ty - my) * 0.06
          document.documentElement.style.setProperty('--mx', mx.toFixed(2) + '%')
          document.documentElement.style.setProperty('--my', my.toFixed(2) + '%')
        }
        spotlightRafId = requestAnimationFrame(lerp)
      }
      spotlightRafId = requestAnimationFrame(lerp)
    }

    return () => {
      gsap.ticker.remove(lenisRaf)
      lenis.destroy()
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(spotlightRafId)
      if (spotlightStyle) spotlightStyle.remove()
    }
  }, [])

  return (
    <>
      {!preloaderDone && <Preloader onComplete={onPreloaderComplete} />}
      {children}
    </>
  )
}
