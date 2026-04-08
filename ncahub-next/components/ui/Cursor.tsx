'use client'
import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth <= 768
    if (IS_MOBILE) return

    const cd = document.getElementById('cd')
    const cr = document.getElementById('cr')
    if (!cd || !cr) return

    let tx = 0, ty = 0, x = 0, y = 0

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY
      cd.style.left = tx + 'px'
      cd.style.top = ty + 'px'
    }, { passive: true })

    const raf = () => {
      x += (tx - x) * 0.1
      y += (ty - y) * 0.1
      cr.style.left = x.toFixed(1) + 'px'
      cr.style.top = y.toFixed(1) + 'px'
      requestAnimationFrame(raf)
    }
    raf()

    // Hover detection for interactive elements
    const interactiveEls = () => document.querySelectorAll('a, button, [data-cur]')
    const onEnter = (e: Event) => {
      cr.classList.add('h')
      cd.classList.add('h')
      const target = e.currentTarget as HTMLElement
      const label = target.getAttribute('data-cur')
      const cl = document.getElementById('cl')
      if (cl && label) cl.textContent = label
    }
    const onLeave = () => {
      cr.classList.remove('h')
      cd.classList.remove('h')
    }

    // Observe DOM for dynamic elements
    const attachListeners = () => {
      interactiveEls().forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attachListeners()

    const observer = new MutationObserver(() => attachListeners())
    observer.observe(document.body, { childList: true, subtree: true })

    document.addEventListener('mousedown', () => cr.classList.add('c'))
    document.addEventListener('mouseup', () => cr.classList.remove('c'))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div id="cd" role="presentation" aria-hidden="true" />
      <div id="cr" role="presentation" aria-hidden="true"><span id="cl" /></div>
    </>
  )
}
