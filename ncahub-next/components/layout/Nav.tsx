'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { href: '/#method', label: 'Method' },
  { href: '/#pods', label: 'Pods' },
  { href: '/#subjects', label: 'Subjects' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/notes/', label: 'Notes', gold: true },
  { href: '/blog/', label: 'Articles' },
]

const EXPO = [0.16, 1, 0.3, 1] as const

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: '28px', inset: '0 0 auto 0', zIndex: 9040,
          padding: '16px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled
            ? 'rgba(2,2,4,0.92)'
            : 'rgba(2,2,4,0.7)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderBottom: scrolled
            ? '1px solid rgba(201,168,76,0.12)'
            : '1px solid rgba(201,168,76,0.04)',
          transition: 'all 0.5s cubic-bezier(.16,1,.3,1)',
          boxShadow: scrolled
            ? '0 4px 30px rgba(0,0,0,0.4), 0 0 40px rgba(201,168,76,0.03)'
            : 'none',
        }}
      >
        {/* Animated top glow line */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -1, left: '10%', right: '10%', height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 30%, rgba(240,216,120,0.5) 50%, rgba(201,168,76,0.3) 70%, transparent 100%)',
          opacity: scrolled ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }} />

        <Link href="/" style={{ display: 'flex', flexDirection: 'column', gap: 1, position: 'relative' }}>
          <span className="neon-text" style={{
            fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 500,
            color: 'var(--g1)', letterSpacing: '.06em',
          }}>
            THE NCA HUB
          </span>
          <span style={{
            fontSize: '.42rem', letterSpacing: '.35em', textTransform: 'uppercase',
            color: 'var(--dim)', fontFamily: 'var(--fb)',
          }}>
            Canada · NCA Prep
          </span>
        </Link>

        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase',
                fontFamily: 'var(--fb)', fontWeight: 500,
                color: l.gold ? 'var(--g1)' : 'var(--fog)',
                position: 'relative',
                padding: '4px 0',
                transition: 'color 0.3s ease',
              }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://payhip.com/THENCAHUB"
            target="_blank"
            rel="noopener noreferrer"
            className="bp pulse-ring"
            style={{ padding: '10px 20px', fontSize: '.6rem', borderRadius: '4px' }}
          >
            <span>Get Notes →</span>
          </a>
        </div>

        {/* Animated hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="nav-burger"
          aria-label="Toggle menu"
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', padding: 12, flexDirection: 'column', gap: 5,
            minWidth: 44, minHeight: 44,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            transition={{ duration: 0.3, ease: EXPO }}
            style={{ display: 'block', width: 22, height: 1, background: 'var(--g1)' }}
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'block', width: 22, height: 1, background: 'var(--g1)' }}
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            transition={{ duration: 0.3, ease: EXPO }}
            style={{ display: 'block', width: 22, height: 1, background: 'var(--g1)' }}
          />
        </button>
      </nav>

      {/* Mobile overlay menu — AnimatePresence for smooth enter/exit */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: EXPO }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9035,
              background: 'rgba(2,2,4,0.97)',
              backdropFilter: 'blur(30px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 32,
            }}
          >
            {/* Grid pattern overlay */}
            <div className="grid-bg" aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

            {LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 + i * 0.07, ease: EXPO }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <Link
                  href={l.href}
                  style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '2rem',
                    color: l.gold ? 'var(--g1)' : 'var(--cream)',
                    textDecoration: 'none',
                  }}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}

            <motion.a
              href="/#pricing"
              className="bp"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 + LINKS.length * 0.07, ease: EXPO }}
              style={{ marginTop: 16, position: 'relative', zIndex: 1 }}
            >
              <span>Get Notes →</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        nav a:hover { color: var(--g1) !important }
        @media(max-width:768px){.nav-desktop{display:none!important}.nav-burger{display:flex!important}}
        @media(min-width:769px){.nav-burger{display:none!important}}
      `}</style>
    </>
  )
}
