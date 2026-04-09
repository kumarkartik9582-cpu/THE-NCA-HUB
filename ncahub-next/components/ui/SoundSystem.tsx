'use client'
/**
 * SoundSystem — opt-in Web Audio API synthesis.
 * Hover tones, click tones, success chimes.
 * Restored from original index.html nca-world-class.js sound system.
 */
import { useEffect, useRef, useState, useCallback } from 'react'

export default function SoundSystem() {
  const [enabled, setEnabled] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  // Load preference from localStorage
  useEffect(() => {
    const pref = localStorage.getItem('nca_sfx')
    if (pref === 'true') setEnabled(true)
  }, [])

  // Save preference
  const toggle = useCallback(() => {
    const next = !enabled
    setEnabled(next)
    localStorage.setItem('nca_sfx', String(next))
    if (next) playTone(880, 0.08, 0.015, 'sine') // confirmation beep
  }, [enabled])

  // Lazy-init AudioContext
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  // Play a tone
  const playTone = useCallback((freq: number, dur: number, vol: number, type: OscillatorType) => {
    if (!enabled && freq !== 880) return // allow confirmation beep
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      gain.gain.value = vol
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + dur)
    } catch { /* graceful degradation */ }
  }, [enabled, getCtx])

  // Attach hover/click listeners via event delegation
  useEffect(() => {
    if (!enabled) return

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('a, button, [data-cur]') || target.closest('a, button, [data-cur]')) {
        playTone(880, 0.06, 0.012, 'sine')
      }
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('a, button, [data-cur]') || target.closest('a, button, [data-cur]')) {
        playTone(440, 0.08, 0.02, 'triangle')
        setTimeout(() => playTone(660, 0.06, 0.015, 'sine'), 40)
      }
    }

    document.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('click', onClick, { passive: true })
    return () => {
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('click', onClick)
    }
  }, [enabled, playTone])

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'Disable sound effects' : 'Enable sound effects'}
      data-cur={enabled ? 'Mute' : 'Sound'}
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: enabled ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${enabled ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
        color: enabled ? 'var(--g1)' : 'var(--dim)',
        cursor: 'pointer',
        zIndex: 9025,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        fontFamily: 'var(--fb)',
      }}
    >
      {enabled ? '♪' : '♪'}
    </button>
  )
}
