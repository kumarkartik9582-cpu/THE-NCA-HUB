'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import SplitText from '@/components/ui/SplitText'
import TextScramble from '@/components/ui/TextScramble'
import TiltCard from '@/components/ui/TiltCard'
import FloatingParticles from '@/components/ui/FloatingParticles'

const HeroSceneLoader = dynamic(() => import('@/components/3d/HeroSceneLoader'), { ssr: false })

/* ─── Ticker data ─────────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  'Administrative Law', 'Constitutional Law', 'Criminal Law',
  'Foundations of Canadian Law', 'Professional Responsibility',
  'Legal Research & Writing', 'NCA Readiness Score', 'Exam-Tested Method',
  'Under 80-Page Notes', 'Built by a Qualified Lawyer',
  'Subject-Specific Drills', 'CPLED LRW Guidance',
]

/* ─── Magnetic button — uses gsap.quickTo for 10x efficiency ─────────────── */
function MagneticBtn({
  children, href, className, style, 'data-cur': dataCur,
}: {
  children: React.ReactNode
  href: string
  className: string
  style?: React.CSSProperties
  'data-cur'?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null!)

  useEffect(() => {
    const el = ref.current
    // quickTo reuses same tween — no new tween created per mousemove
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.35)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <a ref={ref} href={href} className={className} style={style} data-cur={dataCur}>
      {children}
    </a>
  )
}

/* ─── Result card ─────────────────────────────────────────────────────────── */
const RESULTS = [
  {
    subject: 'Admin Law · 1st attempt · 10 days',
    quote: '"Kartik\'s Vavilov framework was clearer than any textbook."',
    author: 'Anum S. · Toronto',
  },
  {
    subject: 'Con Law · 4th attempt · 10 days',
    quote: '"The only method that worked for me."',
    author: 'Anum S. · Toronto',
  },
  {
    subject: 'Admin Law · 1st attempt · 3 weeks',
    quote: '"Passed first attempt."',
    author: 'M.B. · Toronto',
  },
]

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null!)
  const ctaRef = useRef<HTMLDivElement>(null!)
  const authorRef = useRef<HTMLDivElement>(null!)
  const scrollRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    // Choreographed 8-step hero reveal — each element enters in sequence
    // Preloader takes ~2.5s, so we delay 2.8s for the hero to begin
    const tl = gsap.timeline({ delay: 2.8 })

    tl
      // Step 1: Subtext fades in (0s)
      .fromTo(authorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      )
      // Step 2: CTAs slide up (0.2s after sub)
      .fromTo(ctaRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      // Step 3: Results card rotates in from right (0.4s after CTAs)
      .fromTo(cardRef.current,
        { opacity: 0, y: 40, rotateY: -12 },
        { opacity: 1, y: 0, rotateY: 0, duration: 1.0, ease: 'expo.out' },
        '-=0.4'
      )
      // Step 4: Scroll indicator appears last
      .fromTo(scrollRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )
  }, [])

  return (
    <>
      {/* 3D WebGL scene — fixed, behind everything */}
      <HeroSceneLoader />

      {/* Hero content */}
      <section
        id="hero"
        aria-label="Introduction"
        style={{
          position: 'relative', zIndex: 2,
          minHeight: '100svh',
          display: 'flex', alignItems: 'center',
          padding: 'clamp(120px, 14vh, 160px) clamp(24px, 5vw, 72px) clamp(60px, 8vh, 100px)',
        }}
      >
        {/* Floating particles layer */}
        <FloatingParticles count={15} opacity={0.6} />

        {/* Visually-hidden SEO h1 */}
        <h1 className="seo-h1">NCA Exam Prep Canada — The NCA Hub</h1>

        <div style={{
          maxWidth: 1200, margin: '0 auto', width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 380px',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
          perspective: '1200px',
        }}>

          {/* ── Left ── */}
          <div>
            {/* Eyebrow pill */}
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'rgba(201,168,76,.04)',
                border: '1px solid rgba(201,168,76,.15)',
                padding: '7px 16px', borderRadius: 3, marginBottom: 36,
                opacity: 0, animation: 'fadeInDown 0.7s 2.7s ease forwards',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--g1)',
                display: 'inline-block',
                boxShadow: '0 0 12px var(--g1), 0 0 24px rgba(201,168,76,0.3)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }} />
              <span style={{
                fontSize: 'var(--nano)', letterSpacing: '.35em', textTransform: 'uppercase',
                color: 'var(--g1)', fontFamily: 'var(--fb)', fontWeight: 600,
              }}>
                You qualified abroad — Canada requires 5 more exams
              </span>
            </div>

            {/* Kinetic headline — split into words */}
            <div style={{
              fontFamily: 'var(--fd)', fontSize: 'var(--h1)', fontWeight: 400,
              lineHeight: 1.05, color: 'var(--cream)', marginBottom: 28,
              perspective: '800px',
            }}>
              <SplitText text="Pass the NCA." by="words" delay={2.9} stagger={0.08} scrollTrigger={false} style={{ display: 'block', marginBottom: '0.05em' }} />
              <SplitText text="Not in years." by="words" delay={3.2} stagger={0.08} scrollTrigger={false} style={{ display: 'block', marginBottom: '0.05em', color: 'var(--fog)' }} />
              <SplitText text="This cycle." by="words" delay={3.5} stagger={0.09} scrollTrigger={false} style={{ display: 'block' }} tokenColor="var(--g1)" />
            </div>

            {/* Sub */}
            <p
              ref={authorRef}
              style={{
                fontSize: 'var(--lead)', color: 'var(--fog)', lineHeight: 1.8,
                maxWidth: 520, marginBottom: 14, opacity: 0,
              }}
            >
              Under 80 pages per subject. Answer templates. Practice questions.
              Built by a lawyer who passed all 5 NCA exams — the first with 7 days to prepare.
            </p>

            {/* Author line — text scramble "decoding" effect */}
            <p style={{ fontSize: 'var(--nano)', color: 'var(--dim)', letterSpacing: '.1em', marginBottom: 44 }}>
              <TextScramble
                text="Built by an India-qualified lawyer · All 5 NCA subjects passed · CoQ requested · Candidates from 12+ countries"
                delay={3600}
                duration={1400}
              />
            </p>

            {/* CTAs */}
            <div ref={ctaRef} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: 0 }}>
              <MagneticBtn href="#readiness" className="bp" data-cur="Score" style={{ borderRadius: '4px' }}>
                <span>Get My Readiness Score →</span>
              </MagneticBtn>
              <MagneticBtn href="#pricing" className="nc" data-cur="View" style={{ borderRadius: '4px' }}>
                <span>See the Notes</span>
              </MagneticBtn>
            </div>
          </div>

          {/* ── Right: results card with 3D tilt ── */}
          <TiltCard
            className="glass"
            maxTilt={10}
            glare={0.12}
            style={{
              padding: 28,
              opacity: 0,
              transformOrigin: 'center center',
            }}
          >
            <div ref={cardRef} data-cur="Results" style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: 'var(--nano)', letterSpacing: '.3em', textTransform: 'uppercase',
                color: 'var(--g1)', fontWeight: 600, marginBottom: 20,
              }}>
                <span className="gradient-text-animated">Candidate Results</span>
              </div>
              {RESULTS.map((t, i) => (
                <div key={i} style={{
                  padding: '14px 16px',
                  background: `linear-gradient(135deg, rgba(201,168,76,${0.06 - i * 0.015}) 0%, rgba(8,8,16,0.4) 100%)`,
                  borderLeft: `2px solid rgba(201,168,76,${1 - i * 0.35})`,
                  marginBottom: i < 2 ? 12 : 0,
                  borderRadius: '0 6px 6px 0',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ fontSize: 'var(--nano)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--g1)', fontWeight: 600, marginBottom: 4 }}>
                    {t.subject}
                  </div>
                  <div style={{ fontSize: 'var(--sm)', color: 'var(--cream)', fontFamily: 'var(--fd)', fontStyle: 'italic' }}>
                    {t.quote}
                  </div>
                  <div style={{ fontSize: '.6rem', color: 'var(--dim)', marginTop: 4 }}>
                    {t.author} · <strong style={{ color: 'var(--g1)' }}>Passed</strong>
                  </div>
                </div>
              ))}
              <a href="#readiness" className="bp" style={{
                width: '100%', textAlign: 'center', justifyContent: 'center',
                fontSize: '.72rem', marginTop: 16, display: 'flex', borderRadius: '4px',
              }}>
                <span>Get My Readiness Score →</span>
              </a>
            </div>
          </TiltCard>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollRef}
          style={{
            position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--dim)',
            opacity: 0,
          }}
        >
          <div style={{
            width: 1, height: 44,
            background: 'linear-gradient(to bottom, var(--g1), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }} />
          Scroll
        </div>
      </section>

      {/* Ticker band */}
      <div className="tb" aria-hidden="true" style={{ position: 'relative' }}>
        {/* Glow line on top */}
        <div className="glow-line" style={{ position: 'absolute', top: 0, left: '5%', right: '5%' }} />
        <div className="tt">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 32 }}>
              <span className="ti">{item}</span>
              <span className="td2" />
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px var(--g1), 0 0 16px rgba(201,168,76,0.2); }
          50% { box-shadow: 0 0 16px var(--g1), 0 0 32px rgba(201,168,76,0.4); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }
        @media(max-width:768px){
          #hero > div > div { grid-template-columns:1fr!important; }
          #hero > div > div > div:last-child { display:none!important; }
          #hero { padding:110px 24px 60px!important; }
        }
      `}</style>
    </>
  )
}
