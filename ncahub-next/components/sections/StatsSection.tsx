'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 5,  suffix: '',  label: 'NCA subjects passed by founder' },
  { value: 7,  suffix: 'd', label: 'Days to prep for first exam' },
  { value: 80, suffix: '+', label: 'Pages max per subject' },
  { value: 12, suffix: '+', label: 'Countries represented' },
]

const TESTIMONIALS = [
  {
    quote: 'Kartik\'s Vavilov framework was clearer than any textbook I had read. Passed on my first attempt with 10 days of prep.',
    author: 'Anum S.',
    location: 'Toronto',
    subject: 'Administrative Law',
    result: '1st attempt · Passed',
  },
  {
    quote: 'I had failed Constitutional Law three times before. On my fourth attempt, using The NCA Hub method, I passed. This is the only thing that worked.',
    author: 'Anum S.',
    location: 'Toronto',
    subject: 'Constitutional Law',
    result: '4th attempt · Passed',
  },
  {
    quote: 'Passed first attempt with 3 weeks of prep. The answer templates are worth the price alone — I knew exactly how to structure every answer.',
    author: 'M.B.',
    location: 'Toronto',
    subject: 'Administrative Law',
    result: '1st attempt · Passed',
  },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const el = useRef<HTMLSpanElement>(null!)
  const obj = useRef({ val: 0 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(obj.current, { val: 0 }, {
        val: target, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: el.current, start: 'top 88%', toggleActions: 'play none none none' },
        onUpdate() { if (el.current) el.current.textContent = Math.round(obj.current.val) + suffix },
      })
    })
    return () => ctx.revert()
  }, [target, suffix])

  return <span ref={el}>0{suffix}</span>
}

export default function StatsSection() {
  return (
    <section
      id="proof"
      aria-label="Results and testimonials"
      style={{
        padding: 'clamp(80px,10vh,120px) clamp(24px,5vw,72px)',
        background: 'var(--abyss)',
        borderTop: '1px solid rgba(201,168,76,.06)',
        position: 'relative', zIndex: 1,
      }}
    >
      <div className="glow-line" style={{ position: 'absolute', top: 0, left: '15%', right: '15%' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Stats strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid rgba(201,168,76,0.1)', borderRadius: 8,
          overflow: 'hidden', marginBottom: 72,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '32px 24px', textAlign: 'center',
              background: 'rgba(2,2,4,0.5)',
              borderRight: i < 3 ? '1px solid rgba(201,168,76,0.08)' : 'none',
            }}>
              <div className="gradient-text" style={{
                fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem,5vw,4rem)',
                fontWeight: 300, lineHeight: 1,
              }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{
                fontSize: 'var(--nano)', color: 'var(--dim)',
                marginTop: 10, letterSpacing: '.1em', lineHeight: 1.5,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Section label */}
        <div style={{ marginBottom: 40 }}>
          <span style={{
            fontSize: 'var(--nano)', letterSpacing: '.3em',
            textTransform: 'uppercase', color: 'var(--g1)', fontWeight: 600,
          }}>
            What Candidates Say
          </span>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
            color: 'var(--cream)', fontWeight: 400, marginTop: 12, lineHeight: 1.2,
          }}>
            People who used these notes. <em style={{ color: 'var(--g1)', fontStyle: 'italic' }}>And passed.</em>
          </h2>
        </div>

        {/* Testimonials */}
        <div className="testimonials-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              padding: '28px 24px',
              background: 'rgba(201,168,76,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderTop: '2px solid rgba(201,168,76,0.3)',
              borderRadius: 8,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 16,
              }}>
                <span style={{
                  fontSize: 'var(--nano)', color: 'var(--g1)',
                  fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase',
                }}>
                  {t.subject}
                </span>
                <span style={{
                  fontSize: '.55rem', letterSpacing: '.1em', textTransform: 'uppercase',
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
                  color: 'var(--g1)', padding: '3px 8px', borderRadius: 3, fontWeight: 600,
                }}>
                  ✓ {t.result}
                </span>
              </div>

              <p style={{
                fontFamily: 'var(--fd)', fontSize: '1rem',
                fontStyle: 'italic', color: 'var(--cream)',
                lineHeight: 1.7, marginBottom: 18,
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)' }}>
                — {t.author} · {t.location}
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @media(max-width:900px){
          #proof .testimonials-grid { grid-template-columns: 1fr!important; }
          #proof div[style*="repeat(4"] { grid-template-columns: repeat(2,1fr)!important; }
          #proof div[style*="repeat(4"] > div { border-right: none!important; border-bottom: 1px solid rgba(201,168,76,0.08); }
        }
      `}</style>
    </section>
  )
}
