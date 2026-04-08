'use client'
/**
 * Cursor — custom cursor with event delegation (no MutationObserver).
 *
 * Uses a single mouseover listener on document to detect interactive elements
 * instead of attaching/detaching listeners on every DOM mutation.
 */
import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth <= 768
    if (IS_MOBILE) return

    const cd = document.getElementById('cd')
    const cr = document.getElementById('cr')
    const cl = document.getElementById('cl')
    if (!cd || !cr) return

    let tx = 0, ty = 0, x = 0, y = 0
    let rafId = 0
    let isVisible = true

    // Single RAF loop — only source of cursor position updates
    const raf = () => {
      if (!isVisible) { rafId = requestAnimationFrame(raf); return }
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      const xStr = x.toFixed(1) + 'px'
      const yStr = y.toFixed(1) + 'px'
      cd.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`
      cr.style.transform = `translate3d(${xStr}, ${yStr}, 0) translate(-50%, -50%)`
      rafId = requestAnimationFrame(raf)
    }

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    // Event delegation — single listener on document, check target ancestry
    const isInteractive = (el: Element | null): HTMLElement | null => {
      while (el && el !== document.body) {
        if (el instanceof HTMLElement) {
          const tag = el.tagName
          if (tag === 'A' || tag === 'BUTTON' || el.hasAttribute('data-cur')) {
            return el
          }
        }
        el = el.parentElement
      }
      return null
    }

    const onOver = (e: MouseEvent) => {
      const target = isInteractive(e.target as Element)
      if (target) {
        cr.classList.add('h')
        cd.classList.add('h')
        const label = target.getAttribute('data-cur')
        if (cl && label) cl.textContent = label
      }
    }

    const onOut = (e: MouseEvent) => {
      const related = isInteractive(e.relatedTarget as Element)
      if (!related) {
        cr.classList.remove('h')
        cd.classList.remove('h')
      }
    }

    // Pause RAF when tab is hidden
    const onVisibility = () => {
      isVisible = !document.hidden
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    document.addEventListener('mousedown', () => cr.classList.add('c'))
    document.addEventListener('mouseup', () => cr.classList.remove('c'))
    document.addEventListener('visibilitychange', onVisibility)

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <>
      <div id="cd" role="presentation" aria-hidden="true" />
      <div id="cr" role="presentation" aria-hidden="true"><span id="cl" /></div>
    </>
  )
}
