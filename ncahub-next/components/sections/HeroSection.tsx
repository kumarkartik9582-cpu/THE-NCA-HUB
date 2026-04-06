'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'motion/react'

const HeroSceneLoader = dynamic(() => import('@/components/3d/HeroSceneLoader'), { ssr: false })

const TICKER_ITEMS = [
  'Administrative Law','Constitutional Law','Criminal Law','Foundations of Canadian Law',
  'Professional Responsibility','Legal Research & Writing','NCA Readiness Score',
  'Exam-Tested Method','Under 80-Page Notes','Built by a Qualified Lawyer',
  'Subject-Specific Drills','CPLED LRW Guidance',
]

export default function HeroSection() {
  return (
    <>
      {/* 3D WebGL scene behind everything */}
      <HeroSceneLoader />

      {/* Hero content */}
      <section
        id="hero"
        aria-label="Introduction"
        style={{
          position: 'relative', zIndex: 2, minHeight: '100vh',
          display: 'flex', alignItems: 'center',
          padding: '140px 48px 80px',
        }}
      >
        <h1 className="seo-h1">NCA Exam Prep Canada — The NCA Hub</h1>

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 64, alignItems: 'center' }}>
          {/* Left: headline */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: 'rgba(201,168,76,.06)', border: '1px solid rgba(201,168,76,.18)',
                padding: '6px 14px', borderRadius: 2, marginBottom: 32,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--g1)', display: 'inline-block' }} />
              <span style={{ fontSize: 'var(--nano)', letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--g1)', fontFamily: 'var(--fb)', fontWeight: 600 }}>
                YOU QUALIFIED ABROAD — CANADA REQUIRES 5 MORE EXAMS
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--fd)', fontSize: 'var(--h1)', fontWeight: 400, lineHeight: 1.05, color: 'var(--cream)', marginBottom: 28 }}
            >
              <span style={{ display: 'block' }}>Pass the NCA.</span>
              <span style={{ display: 'block' }}>Not in <em>years.</em></span>
              <span style={{ display: 'block' }}>This <em style={{ color: 'var(--g1)' }}>cycle.</em></span>
            </motion.h2>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              style={{ fontSize: 'var(--lead)', color: 'var(--fog)', lineHeight: 1.75, maxWidth: 540, marginBottom: 16 }}
            >
              Under 80 pages per subject. Answer templates. Practice questions.
              Built by a lawyer who passed all 5 NCA exams — the first with 7 days to prepare.
            </motion.p>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              style={{ fontSize: 'var(--nano)', color: 'var(--dim)', letterSpacing: '.1em', marginBottom: 40 }}
            >
              Built by an India-qualified lawyer · All 5 NCA subjects passed · CoQ requested · Candidates from 12+ countries
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
              <Link href="#readiness" className="bp" data-cur="Score">
                <span>Get My Readiness Score →</span>
              </Link>
              <Link href="#pricing" className="nc" data-cur="View">
                <span>See Notes</span>
              </Link>
            </motion.div>
          </div>

          {/* Right: results card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass"
            data-cur="Results"
            style={{ padding: 28 }}
          >
            <div style={{ fontSize: 'var(--nano)', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--g1)', fontWeight: 600, marginBottom: 20 }}>
              Candidate Results
            </div>
            {[
              { subject: 'Admin Law · 1st attempt · 10 days', quote: '"Kartik\'s Vavilov framework was clearer than any textbook."', author: 'Anum S. · Toronto' },
              { subject: 'Con Law · 4th attempt · 10 days', quote: '"The only method that worked for me."', author: 'Anum S. · Toronto' },
              { subject: 'Admin Law · 1st attempt · 3 weeks', quote: '"Passed first attempt."', author: 'M.B. · Toronto' },
            ].map((t, i) => (
              <div key={i} style={{
                padding: '14px 16px',
                background: `rgba(201,168,76,${0.05 - i * 0.01})`,
                borderLeft: `2px solid rgba(201,168,76,${1 - i * 0.35})`,
                marginBottom: i < 2 ? 12 : 0,
              }}>
                <div style={{ fontSize: 'var(--nano)', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--g1)', fontWeight: 600, marginBottom: 4 }}>{t.subject}</div>
                <div style={{ fontSize: 'var(--sm)', color: 'var(--cream)', fontFamily: 'var(--fd)', fontStyle: 'italic' }}>{t.quote}</div>
                <div style={{ fontSize: '.6rem', color: 'var(--dim)', marginTop: 4 }}>
                  {t.author} · <strong style={{ color: 'var(--g1)' }}>Passed</strong>
                </div>
              </div>
            ))}
            <Link href="#readiness" className="bp" style={{ width: '100%', textAlign: 'center', justifyContent: 'center', fontSize: '.72rem', marginTop: 16, display: 'flex' }}>
              <span>Get My Readiness Score →</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--dim)',
        }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--g1), transparent)' }} />
          Scroll to explore
        </div>
      </section>

      {/* Ticker */}
      <div className="tb" aria-hidden="true">
        <div className="tt" id="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <>
              <span key={`item-${i}`} className="ti">{item}</span>
              <span key={`sep-${i}`} className="td2" />
            </>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          #hero > div > div { grid-template-columns: 1fr !important; }
          #hero > div > div > div:last-child { display: none; }
          #hero { padding: 120px 24px 60px !important; }
        }
      `}</style>
    </>
  )
}
