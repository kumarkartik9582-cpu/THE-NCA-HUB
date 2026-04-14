'use client'
/**
 * ComparisonSection — factual comparison table vs competitors.
 * Ported from original index.html comparison section.
 */
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'

const FEATURES = [
  { name: 'Notes length', us: 'Under 80 pages', c1: '169–304 pages', c2: '137–397 pages', c3: 'Bundled only' },
  { name: 'Video format', us: '8–12 min modules (in production)', c1: 'Multi-hour recorded series', c2: 'Group sessions', c3: 'Full class only' },
  { name: 'Readiness Assessment', us: true, c1: false, c2: false, c3: false },
  { name: 'Performance Pods', us: 'Included (Q3 2026)', c1: 'Facebook group only', c2: false, c3: false },
  { name: 'Answer templates', us: true, c1: false, c2: false, c3: false },
  { name: 'Price per subject', us: '$175–$279 CAD', c1: 'From $55.50 CAD', c2: 'From $55.50 CAD', c3: 'Variable' },
]

const COLS = ['The NCA Hub', 'NCA Mentor', 'NCA Tutor', 'Exam Guru']

export default function ComparisonSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  return (
    <section className="sec" id="compare" aria-label="Comparison" ref={ref}
      style={{ background: 'var(--abyss)', borderTop: '1px solid rgba(201,168,76,.06)', overflow: 'hidden' }}>

      <div className="glow-line" style={{ position: 'absolute', top: 0, left: '15%', right: '15%' }} />

      <div className="w" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'end', marginBottom: 24 }}>
          <div>
            <motion.span className="ey"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}>
              A Factual Comparison
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-depth"
              style={{ fontFamily: 'var(--fd)', fontSize: 'var(--h1)', fontWeight: 400, lineHeight: 1.1 }}>
              How we chose to <br /><em className="gradient-text">build differently.</em>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', lineHeight: 1.75 }}>
            The same format has dominated NCA preparation for years. Long videos, dense notes, no templates. These are the material facts. You can verify all of them.
          </motion.p>
        </div>

        {/* Price context note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="holo-card"
          style={{
            padding: '24px 28px', marginBottom: 32, maxWidth: 820,
            borderLeft: '3px solid var(--g1)',
          }}>
          <div style={{ fontSize: 'var(--nano)', letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--g1)', fontWeight: 600, marginBottom: 10 }}>
            A note on price
          </div>
          <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.75, margin: 0 }}>
            At $55.50 you get lecture recordings. No answer templates, no readiness assessment, no structured exam frameworks. The question is not which preparation costs less. It is which preparation reduces the risk of paying $500 to resit. Failing one exam costs more than this entire bundle.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse', minWidth: 700,
            fontSize: 'var(--sm)', color: 'var(--fog)',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                <th style={{ textAlign: 'left', padding: '16px 12px', width: '22%', fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', fontWeight: 600 }}>Feature</th>
                {COLS.map((col, i) => (
                  <th key={col} style={{
                    textAlign: 'left', padding: '16px 12px',
                    fontSize: 'var(--nano)', letterSpacing: '.15em', textTransform: 'uppercase',
                    fontWeight: 600,
                    color: i === 0 ? 'var(--g1)' : 'var(--dim)',
                    background: i === 0 ? 'rgba(201,168,76,0.04)' : 'transparent',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <motion.tr
                  key={f.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.55 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}
                >
                  <td style={{ padding: '14px 12px', fontWeight: 500, color: 'var(--cream)' }}>{f.name}</td>
                  {[f.us, f.c1, f.c2, f.c3].map((val, j) => (
                    <td key={j} style={{
                      padding: '14px 12px',
                      background: j === 0 ? 'rgba(201,168,76,0.04)' : 'transparent',
                      color: j === 0 ? 'var(--cream)' : 'var(--fog)',
                    }}>
                      {val === true ? (
                        <span style={{ color: 'var(--g1)' }}>&#10003; Included</span>
                      ) : val === false ? (
                        <span style={{ color: 'var(--dim)' }}>&#10007; Not offered</span>
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ fontSize: 'var(--nano)', color: 'var(--dim)', marginTop: 20, letterSpacing: '.08em', lineHeight: 1.6 }}>
          All claims are factual and verifiable as of publication date. Provider names are used for descriptive comparison only. The NCA Hub is not affiliated with any of the above providers.
        </motion.p>
      </div>

      <style>{`@media(max-width:768px){#compare .w > div:first-child{grid-template-columns:1fr!important;gap:24px!important}}`}</style>
    </section>
  )
}
