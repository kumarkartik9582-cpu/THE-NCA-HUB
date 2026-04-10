'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrollProgress from '@/components/ui/ScrollProgress'

const EXPO = [0.16, 1, 0.3, 1] as const

export type SubjectData = {
  code: string
  title: string
  pages: string
  price: string
  payhipUrl: string
  description: string
  whatYouGet: string[]
  keyCases: { name: string; point: string }[]
  frameworks: { name: string; elements: string[] }[]
  topics: string[]
}

function Section({ children, bg = 'var(--void)', borderBottom = true }: {
  children: React.ReactNode
  bg?: string
  borderBottom?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  return (
    <section
      ref={ref}
      style={{ background: bg, padding: '80px 0', borderBottom: borderBottom ? '1px solid rgba(201,168,76,.06)' : 'none' }}
      data-in-view={inView}
    >
      {children}
    </section>
  )
}

export default function SubjectPageContent({ s, subject }: { s: SubjectData; subject: string }) {
  const heroRef = useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef, { once: true })
  const whatRef = useRef<HTMLElement>(null)
  const whatInView = useInView(whatRef, { once: true, margin: '-8%' })
  const casesRef = useRef<HTMLElement>(null)
  const casesInView = useInView(casesRef, { once: true, margin: '-8%' })
  const fwRef = useRef<HTMLElement>(null)
  const fwInView = useInView(fwRef, { once: true, margin: '-8%' })
  const ctaRef = useRef<HTMLElement>(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: '-8%' })

  return (
    <main>
      <ScrollProgress />
      {/* Hero */}
      <section ref={heroRef} style={{ background: 'var(--void)', padding: '160px 0 80px', borderBottom: '1px solid rgba(201,168,76,.07)' }}>
        <div className="w">
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 16 }}
          >
            <Link href="/notes/" style={{ fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)' }}>
              ← All Subjects
            </Link>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start' }}>
            <div>
              {/* Subject code — scale in from bottom */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, ease: EXPO }}
                style={{ fontFamily: 'var(--fd)', fontSize: '4rem', color: 'rgba(201,168,76,.25)', lineHeight: 1, marginBottom: 16 }}
              >
                {s.code}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.1, ease: EXPO }}
                style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.05, color: 'var(--cream)', marginBottom: 20 }}
              >
                {s.title}<br /><em>Study Notes</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.25 }}
                style={{ fontSize: 'var(--lead)', color: 'var(--fog)', lineHeight: 1.75, maxWidth: 600, marginBottom: 32 }}
              >
                {s.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.45 }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
              >
                <Link href={s.payhipUrl} className="bp" target="_blank" rel="noopener noreferrer">
                  <span>Buy {s.price} →</span>
                </Link>
                <Link href="/#free-chapter" className="nc"><span>Get Free Chapter First</span></Link>
              </motion.div>
            </div>

            {/* Stats card — slide from right */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.15, ease: EXPO }}
              className="glass"
              style={{ padding: '28px 32px', minWidth: 220, textAlign: 'center' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4, ease: EXPO }}
                style={{ fontFamily: 'var(--fd)', fontSize: '3rem', color: 'var(--g1)', lineHeight: 1 }}
              >
                {s.pages}
              </motion.div>
              <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 24 }}>pages</div>
              <div style={{ fontSize: 'var(--nano)', color: 'var(--fog)', lineHeight: 1.75 }}>
                Answer templates<br />Practice questions<br />Key case summaries<br />Instant PDF download
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section ref={whatRef} style={{ background: 'var(--abyss)', padding: '80px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={whatInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EXPO }}
            style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', marginBottom: 32 }}
          >
            What&apos;s included
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {s.whatYouGet.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={whatInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EXPO }}
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: 'rgba(201,168,76,.03)', border: '1px solid rgba(201,168,76,.08)' }}
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={whatInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.07, ease: EXPO }}
                  style={{ color: 'var(--g1)', flexShrink: 0, fontWeight: 600 }}
                >
                  ✓
                </motion.span>
                <span style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.6 }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Cases */}
      <section ref={casesRef} style={{ background: 'var(--void)', padding: '80px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={casesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EXPO }}
            style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', marginBottom: 32 }}
          >
            Key Cases Covered
          </motion.h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {s.keyCases.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={casesInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.09, ease: EXPO }}
                whileHover={{ x: 4, borderLeftColor: 'var(--g1)', transition: { duration: 0.2 } }}
                style={{ padding: '20px 24px', background: 'rgba(201,168,76,.02)', border: '1px solid rgba(201,168,76,.07)', borderLeft: '2px solid rgba(201,168,76,.4)' }}
              >
                <div style={{ fontSize: 'var(--sm)', color: 'var(--cream)', fontFamily: 'var(--fd)', fontStyle: 'italic', marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{c.point}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section ref={fwRef} style={{ background: 'var(--abyss)', padding: '80px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={fwInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EXPO }}
            style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', marginBottom: 32 }}
          >
            Core Frameworks
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {s.frameworks.map((f, fi) => (
              <motion.div
                key={fi}
                initial={{ opacity: 0, y: 28 }}
                animate={fwInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: fi * 0.12, ease: EXPO }}
                style={{ padding: 28, background: 'rgba(201,168,76,.03)', border: '1px solid rgba(201,168,76,.1)' }}
              >
                <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--g1)', letterSpacing: '.1em', marginBottom: 20 }}>{f.name}</div>
                <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {f.elements.map((el, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={fwInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: fi * 0.12 + 0.15 + j * 0.06, ease: EXPO }}
                      style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65, display: 'flex', gap: 12 }}
                    >
                      <span style={{ color: 'var(--g2)', flexShrink: 0, fontWeight: 600, fontFamily: 'var(--fd)' }}>{j + 1}.</span>
                      <span>{el}</span>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics + CTA */}
      <section ref={ctaRef} style={{ background: 'var(--void)', padding: '80px 0 120px' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: EXPO }}
                style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--cream)', marginBottom: 24 }}
              >
                All Topics Covered
              </motion.h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {s.topics.map((t, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: EXPO }}
                    style={{ padding: '6px 14px', border: '1px solid rgba(201,168,76,.15)', fontSize: 'var(--nano)', letterSpacing: '.12em', color: 'var(--fog)', textTransform: 'uppercase' }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Purchase CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.15, ease: EXPO }}
              style={{ padding: 32, background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <div style={{ fontFamily: 'var(--fd)', fontSize: '2.2rem', color: 'var(--g0)', marginBottom: 8 }}>{s.price}</div>
              <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', marginBottom: 8 }}>
                {s.pages} pages · Answer templates · Practice questions · Instant PDF
              </p>
              <p style={{ fontSize: 'var(--sm)', color: 'var(--dim)', marginBottom: 24, lineHeight: 1.65 }}>
                Free updates when the NCA changes its syllabus.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href={s.payhipUrl} className="bp" target="_blank" rel="noopener noreferrer">
                  <span>Buy Now →</span>
                </Link>
                <Link href="/notes/" className="nc"><span>← Back to All Subjects</span></Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){
          section > div > div[style*="1fr auto"]{grid-template-columns:1fr!important}
          section > div > div[style*="repeat(2, 1fr)"]{grid-template-columns:1fr!important}
          section > div > div[style*="1fr 1fr"]{grid-template-columns:1fr!important;gap:32px!important}
        }
      `}</style>
    </main>
  )
}
