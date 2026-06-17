'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SUBJECTS = [
  { code: 'ADM', name: 'Administrative Law',          pages: 74, href: 'https://payhip.com/THENCAHUB' },
  { code: 'CON', name: 'Constitutional Law',           pages: 78, href: 'https://payhip.com/THENCAHUB' },
  { code: 'CRM', name: 'Criminal Law',                 pages: 68, href: 'https://payhip.com/THENCAHUB' },
  { code: 'FCL', name: 'Foundations of Canadian Law',  pages: 52, href: 'https://payhip.com/THENCAHUB' },
  { code: 'PR',  name: 'Professional Responsibility',  pages: 58, href: 'https://payhip.com/THENCAHUB' },
]

const WHAT_YOU_GET = [
  {
    title: 'Strategic Notes',
    body: 'Under 80 pages per subject. No textbook padding. No waffle. Every page maps directly to what the NCA examiner tests and rewards.',
    detail: 'The industry standard runs 169–304 pages. Ours is under 80. Not because we cut corners — because everything else did.',
  },
  {
    title: 'Answer Templates',
    body: 'Pre-built response frameworks for every question type. You walk into the exam knowing exactly how to open, structure, and close every answer.',
    detail: 'No other NCA prep provider offers answer templates. This alone is what candidates say changed their results.',
  },
  {
    title: 'Practice Questions',
    body: 'Subject-specific questions built on real exam patterns. Timed drills using the exact question types the NCA examiner uses.',
    detail: 'Knowing the law is not enough. The NCA rewards technique. Practice questions train the technique.',
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

export default function WhatYouGetSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <section
      id="what-you-get"
      aria-label="What is included"
      ref={ref}
      style={{
        padding: 'clamp(80px,10vh,120px) clamp(24px,5vw,72px)',
        borderTop: '1px solid rgba(201,168,76,.06)',
        position: 'relative', zIndex: 1,
      }}
    >
      <div className="glow-line" style={{ position: 'absolute', top: 0, left: '15%', right: '15%' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ maxWidth: 640, marginBottom: 64 }}>
          <motion.span
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 'var(--nano)', letterSpacing: '.3em',
              textTransform: 'uppercase', color: 'var(--g1)', fontWeight: 600,
            }}
          >
            What You Get
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: 'var(--fd)', fontSize: 'clamp(2rem,4vw,3.2rem)',
              fontWeight: 400, lineHeight: 1.1, marginTop: 12, marginBottom: 16,
              color: 'var(--cream)',
            }}
          >
            Everything you need.<br /><em className="gradient-text">Nothing you don&apos;t.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', lineHeight: 1.75 }}
          >
            The NCA is a technique exam. Not a memory test. Every product in the NCA Hub is built around that single fact.
          </motion.p>
        </div>

        {/* Three product pillars */}
        <div className="wyg-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: 20, marginBottom: 64,
        }}>
          {WHAT_YOU_GET.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.12, ease: EASE }}
              style={{
                padding: '32px 28px',
                background: 'rgba(201,168,76,0.02)',
                border: '1px solid rgba(201,168,76,0.1)',
                borderTop: '2px solid rgba(201,168,76,0.35)',
                borderRadius: 8,
              }}
            >
              <div style={{
                fontFamily: 'var(--fd)', fontSize: '1.35rem',
                color: 'var(--cream)', marginBottom: 14, fontWeight: 400,
              }}>
                {item.title}
              </div>
              <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.75, marginBottom: 16 }}>
                {item.body}
              </p>
              <p style={{
                fontSize: 'var(--nano)', color: 'var(--dim)',
                lineHeight: 1.7, paddingTop: 14,
                borderTop: '1px solid rgba(201,168,76,0.07)',
              }}>
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Subject breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        >
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 20,
          }}>
            <span style={{
              fontSize: 'var(--nano)', letterSpacing: '.25em',
              textTransform: 'uppercase', color: 'var(--g1)', fontWeight: 600,
            }}>
              All Five NCA Subjects
            </span>
            <span style={{ fontSize: 'var(--nano)', color: 'var(--dim)' }}>
              330+ pages total across all subjects
            </span>
          </div>

          <div className="subjects-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12,
          }}>
            {SUBJECTS.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', padding: '20px 18px', textDecoration: 'none',
                  background: 'rgba(201,168,76,0.03)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: 6, transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(201,168,76,0.3)'
                  el.style.background = 'rgba(201,168,76,0.06)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(201,168,76,0.1)'
                  el.style.background = 'rgba(201,168,76,0.03)'
                }}
              >
                <div style={{
                  fontSize: 'var(--nano)', letterSpacing: '.2em',
                  textTransform: 'uppercase', color: 'var(--g1)', fontWeight: 600, marginBottom: 8,
                }}>
                  {s.code}
                </div>
                <div style={{ fontSize: 'var(--sm)', color: 'var(--cream)', lineHeight: 1.4, marginBottom: 10 }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)' }}>
                  {s.pages} pages
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ textAlign: 'center', marginTop: 52 }}
        >
          <a
            href="https://payhip.com/THENCAHUB"
            target="_blank"
            rel="noopener noreferrer"
            className="bp"
            style={{ borderRadius: 4, display: 'inline-flex' }}
          >
            <span>Get All 5 Subjects →</span>
          </a>
          <p style={{ fontSize: 'var(--nano)', color: 'var(--dim)', marginTop: 14 }}>
            CA$199 · All five subjects · Instant PDF · Pay once
          </p>
        </motion.div>

      </div>

      <style>{`
        @media(max-width:900px){
          #what-you-get .wyg-grid      { grid-template-columns: 1fr!important; }
          #what-you-get .subjects-grid { grid-template-columns: repeat(2,1fr)!important; }
        }
        @media(max-width:480px){
          #what-you-get .subjects-grid { grid-template-columns: 1fr!important; }
        }
      `}</style>
    </section>
  )
}
