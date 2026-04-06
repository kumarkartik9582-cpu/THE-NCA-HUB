'use client'
/**
 * StatsSection — animated counter stats + testimonial pull-quotes.
 * Numbers count up when scrolled into view (GSAP odometer style).
 */
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from '@/components/ui/ScrollReveal'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 5,   suffix: '',  label: 'NCA subjects\npassed by founder' },
  { value: 7,   suffix: 'd', label: 'Days to prep for\nfirst exam' },
  { value: 80,  suffix: '+', label: 'Pages max\nper subject' },
  { value: 12,  suffix: '+', label: 'Countries our\ncandidates come from' },
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
          duration: 1.8,
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
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Stats row */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(24px, 4vw, 48px)',
          marginBottom: 'clamp(80px, 12vh, 120px)',
        }}>
          {STATS.map((s, i) => (
            <ScrollReveal key={i} variant="slide-up" delay={i * 0.08} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--fd)',
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                fontWeight: 300, lineHeight: 1,
                color: 'var(--g1)',
                marginBottom: 12,
              }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
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

        {/* Divider */}
        <ScrollReveal variant="line" style={{ marginBottom: 'clamp(60px, 8vh, 90px)' }}>
          <div style={{ height: 1, background: 'rgba(201,168,76,.08)' }} />
        </ScrollReveal>

        {/* Quotes */}
        <div className="quotes-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(20px, 3vw, 36px)',
        }}>
          {QUOTES.map((q, i) => (
            <ScrollReveal key={i} variant="slide-up" delay={0.1 + i * 0.1}>
              <blockquote style={{
                padding: '28px 24px',
                background: 'rgba(201,168,76,0.03)',
                border: '1px solid rgba(201,168,76,.08)',
                borderRadius: 4,
                borderTop: '2px solid var(--g2)',
              }}>
                <p style={{
                  fontFamily: 'var(--fd)', fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
                  fontStyle: 'italic', color: 'var(--cream)', lineHeight: 1.7, marginBottom: 20,
                }}>
                  {q.text}
                </p>
                <footer>
                  <div style={{ fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--g1)', fontWeight: 600 }}>
                    {q.subject}
                  </div>
                  <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)', marginTop: 4 }}>
                    {q.author} · {q.location} · <strong style={{ color: 'var(--g1)' }}>Passed</strong>
                  </div>
                </footer>
              </blockquote>
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
