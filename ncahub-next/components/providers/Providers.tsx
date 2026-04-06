'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Low-end device detection
    const conn = (navigator as any).connection
    const isLowEnd =
      (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.saveData)) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    if (isLowEnd) document.documentElement.classList.add('nca-low-end')

    // Lenis smooth scroll synced with GSAP
    const lenis = new Lenis({ autoRaf: false })
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    // Scroll progress + discovery bar
    const prog = document.getElementById('prog')
    const bar = document.getElementById('discovery-bar')
    const onScroll = () => {
      const s = window.scrollY
      const t = document.documentElement.scrollHeight - window.innerHeight
      if (prog && t > 0) prog.style.width = (s / t * 100).toFixed(2) + '%'
      if (bar) bar.classList.toggle('hidden', s > 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Ambient cursor light
    const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth <= 768
    if (!IS_MOBILE) {
      if (!document.getElementById('nca-spotlight')) {
        const s = document.createElement('style')
        s.id = 'nca-spotlight'
        s.textContent = 'body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(600px circle at var(--mx,50%) var(--my,50%),rgba(201,168,76,0.04) 0%,transparent 60%)}'
        document.head.appendChild(s)
      }
      let mx = 50, my = 50, tx = 50, ty = 50
      document.addEventListener('mousemove', (e) => {
        tx = e.clientX / window.innerWidth * 100
        ty = e.clientY / window.innerHeight * 100
      }, { passive: true })
      const lerp = () => {
        mx += (tx - mx) * 0.06
        my += (ty - my) * 0.06
        document.documentElement.style.setProperty('--mx', mx.toFixed(2) + '%')
        document.documentElement.style.setProperty('--my', my.toFixed(2) + '%')
        requestAnimationFrame(lerp)
      }
      lerp()
    }

    return () => {
      gsap.ticker.remove(lenis.raf)
      lenis.destroy()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <>{children}</>
}
