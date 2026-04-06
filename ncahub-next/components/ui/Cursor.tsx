'use client'
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
    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY
      cd.style.left = tx + 'px'; cd.style.top = ty + 'px'
    }, { passive: true })
    const raf = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12
      cr.style.left = x.toFixed(1) + 'px'; cr.style.top = y.toFixed(1) + 'px'
      requestAnimationFrame(raf)
    }
    raf()
    document.addEventListener('mousedown', () => cr.classList.add('c'))
    document.addEventListener('mouseup', () => cr.classList.remove('c'))
  }, [])

  return (
    <>
      <div id="cd" role="presentation" aria-hidden="true" />
      <div id="cr" role="presentation" aria-hidden="true"><span id="cl" /></div>
    </>
  )
}
