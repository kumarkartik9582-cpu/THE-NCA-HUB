'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/#method', label: 'Method' },
  { href: '/#pods', label: 'Pods' },
  { href: '/#subjects', label: 'Subjects' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/notes/', label: 'Notes', gold: true },
  { href: '/blog/', label: 'Articles' },
]

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
        className=""
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
          <span style={{
            display: 'block', width: 22, height: 1, background: 'var(--g1)',
            transform: open ? 'rotate(45deg) translate(3px, 3px)' : 'none',
            transition: 'transform 0.3s var(--expo)',
          }} />
          <span style={{
            display: 'block', width: 22, height: 1, background: 'var(--g1)',
            opacity: open ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }} />
          <span style={{
            display: 'block', width: 22, height: 1, background: 'var(--g1)',
            transform: open ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
            transition: 'transform 0.3s var(--expo)',
          }} />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {open && (
        <div
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
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--fd)', fontSize: '2rem', color: 'var(--cream)',
                opacity: 0,
                animation: `fadeInUp 0.5s ${0.1 + i * 0.06}s ease forwards`,
                position: 'relative',
              }}
            >
              {l.label}
            </Link>
          ))}
          <a href="/#pricing" className="bp" style={{
            marginTop: 16, opacity: 0,
            animation: `fadeInUp 0.5s ${0.1 + LINKS.length * 0.06}s ease forwards`,
          }}>
            <span>Get Notes →</span>
          </a>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        nav a:hover { color: var(--g1) !important }
        @media(max-width:768px){.nav-desktop{display:none!important}.nav-burger{display:flex!important}}
        @media(min-width:769px){.nav-burger{display:none!important}}
      `}</style>
    </>
  )
}
