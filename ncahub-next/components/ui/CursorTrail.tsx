'use client'
/**
 * CursorTrail — gold sparkle physics trail on mouse movement.
 * Restored from original index.html trail canvas (nca-world-class.js).
 * Desktop only. Uses lightweight 2D canvas — no Three.js.
 */
import { useEffect, useRef } from 'react'

interface Spark {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  size: number
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth <= 768
    if (IS_MOBILE) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    const sparks: Spark[] = []
    let mx = w / 2, my = h / 2
    let pmx = mx, pmy = my
    let rafId = 0

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }

    const onMove = (e: MouseEvent) => {
      pmx = mx; pmy = my
      mx = e.clientX; my = e.clientY

      // Speed-based spark generation (max 4 per move)
      const speed = Math.hypot(mx - pmx, my - pmy)
      const count = Math.min(Math.floor(speed / 8), 4)
      for (let i = 0; i < count; i++) {
        sparks.push({
          x: mx + (Math.random() - 0.5) * 6,
          y: my + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.4,
          size: 1 + Math.random() * 1.5,
        })
      }

      // Cap total sparks for performance
      if (sparks.length > 80) sparks.splice(0, sparks.length - 80)
    }

    const onClick = () => {
      // Click burst: 12 directional sparks
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12
        const speed = 2 + Math.random() * 2
        sparks.push({
          x: mx, y: my,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.8 + Math.random() * 0.3,
          size: 1.5 + Math.random(),
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.02 // subtle gravity
        s.vx *= 0.98 // damping
        s.vy *= 0.98
        s.life -= 1 / (60 * s.maxLife) // decay over maxLife seconds

        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }

        const alpha = s.life * 0.6
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${alpha})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * s.life * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${alpha * 0.15})`
        ctx.fill()
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9996,
      }}
    />
  )
}
