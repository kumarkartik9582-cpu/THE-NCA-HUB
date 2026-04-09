'use client'
/**
 * StatsSection — animated counter stats + testimonial pull-quotes.
 * Now with holographic counters, glow dividers, and 3D tilt quote cards.
 */
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from '@/components/ui/ScrollReveal'
import TiltCard from '@/components/ui/TiltCard'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 5,   suffix: '',  label: 'NCA subjects\npassed by founder', icon: '◈' },
  { value: 7,   suffix: 'd', label: 'Days to prep for\nfirst exam', icon: '⟐' },
  { value: 80,  suffix: '+', label: 'Pages max\nper subject', icon: '◇' },
  { value: 12,  suffix: '+', label: 'Countries our\ncandidates come from', icon: '○' },
]

const QUOTES = [
  {
    text: '"Kartik\'s Vavilov framework was clearer than any textbook I had read."',
    author: 'Anum S.', location: 'Toronto', subject: 'Admin Law · 1st attempt',
  },
  {
    text: '"The only method that worked for me after three previous attempts."',
    author: 'Anum S.', location: 'Toronto', subject: 'Con Law · 4th attempt',
  },
  {
    text: '"Passed first attempt with 3 weeks of prep using the notes."',
    author: 'M.B.', location: 'Toronto', subject: 'Admin Law · 1st attempt',
  },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const elRef = useRef<HTMLSpanElement>(null!)
  const obj = useRef({ val: 0 })

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        obj.current,
        { val: 0 },
        {
          val: target,
          duration: 2.0,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          onUpdate() {
            el.textContent = Math.round(obj.current.val) + suffix
          },
        }
      )
    })
    return () => ctx.revert()
  }, [target, suffix])

  return <span ref={elRef}>0{suffix}</span>
}

export default function StatsSection() {
  return (
    <section
      id="stats"
      aria-label="By the numbers"
      style={{
        padding: 'clamp(100px, 14vh, 160px) clamp(24px, 5vw, 72px)',
        background: 'var(--abyss)',
        borderTop: '1px solid rgba(201,168,76,.06)',
        position: 'relative', zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Glow line at top */}
      <div className="glow-line" style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', zIndex: 5,
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Stats row */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(24px, 4vw, 48px)',
          marginBottom: 'clamp(80px, 12vh, 120px)',
        }}>
          {STATS.map((s, i) => (
            <ScrollReveal key={i} variant="slide-up" delay={i * 0.1} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* Ghost icon behind number */}
                <span aria-hidden="true" style={{
                  position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                  fontSize: '4rem', opacity: 0.04, color: 'var(--g1)',
                  fontFamily: 'var(--fd)',
                }}>{s.icon}</span>
                <div className="neon-text" style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                  fontWeight: 300, lineHeight: 1,
                  marginBottom: 12,
                }}>
                  <span className="gradient-text-animated">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </span>
                </div>
              </div>
              <div style={{
                fontSize: 'var(--nano)', letterSpacing: '.18em', textTransform: 'uppercase',
                color: 'var(--dim)', lineHeight: 1.6, whiteSpace: 'pre-line',
              }}>
                {s.label}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Glow divider */}
        <ScrollReveal variant="line" style={{ marginBottom: 'clamp(60px, 8vh, 90px)' }}>
          <div className="glow-line" />
        </ScrollReveal>

        {/* Quotes as 3D tilt cards */}
        <div className="quotes-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(20px, 3vw, 36px)',
        }}>
          {QUOTES.map((q, i) => (
            <ScrollReveal key={i} variant="slide-up" delay={0.1 + i * 0.12}>
              <TiltCard
                className="holo-card"
                maxTilt={6}
                glare={0.1}
                style={{
                  padding: '28px 24px',
                  borderTop: '2px solid var(--g2)',
                  height: '100%',
                }}
              >
                <blockquote style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--fd)', fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
                    fontStyle: 'italic', color: 'var(--cream)', lineHeight: 1.7, marginBottom: 20,
                  }}>
                    {q.text}
                  </p>
                  <footer>
                    <div style={{
                      fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase',
                      fontWeight: 600,
                    }}>
                      <span className="gradient-text">{q.subject}</span>
                    </div>
                    <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)', marginTop: 4 }}>
                      {q.author} · {q.location} · <strong style={{ color: 'var(--g1)' }}>Passed</strong>
                    </div>
                  </footer>
                </blockquote>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .stats-grid  { grid-template-columns: repeat(2,1fr)!important; }
          .quotes-grid { grid-template-columns: 1fr!important; }
        }
      `}</style>
    </section>
  )
}
