'use client'
import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const STATS = [
  { value: '5', label: 'NCA subjects passed' },
  { value: '12+', label: 'Countries represented' },
  { value: '7', label: 'Days to prep for first exam' },
  { value: '<80', label: 'Pages per subject' },
]

const COUNTRIES = [
  { country: 'India 🇮🇳', desc: 'The largest group of NCA candidates. Typically hold an LLB from a 3- or 5-year program and are assigned all 5 subjects.' },
  { country: 'United Kingdom 🇬🇧', desc: 'Solicitors and barristers. Often receive partial exemptions but still face 3–4 subjects.' },
  { country: 'Nigeria 🇳🇬', desc: 'Call to the Nigerian bar followed by UK or Canadian LLM. Typically assigned all 5 NCA subjects.' },
  { country: 'Pakistan 🇵🇰', desc: 'Similar credential pathway to India. All 5 subjects typically assigned.' },
  { country: 'Philippines 🇵🇭', desc: 'Philippine bar qualification. All 5 NCA subjects typically assigned.' },
  { country: 'Jamaica 🇯🇲', desc: 'Caribbean bar. Common law background may result in some exemptions.' },
]

const METHOD = [
  { n: '01', t: 'Framework first', d: 'Every NCA question maps to one of a small set of legal frameworks. Identify which one applies before writing a word.' },
  { n: '02', t: 'Under 80 pages', d: 'Not because depth was cut. Because everything else was. The NCA tests the same things repeatedly — those things are here.' },
  { n: '03', t: 'Answer templates', d: 'Pre-built response structures for every question type. So you spend the exam applying, not constructing.' },
  { n: '04', t: 'Readiness score', d: 'Know where you stand before exam day. Not a motivational tool — a diagnostic that tells you what to fix.' },
]

function parseVal(raw: string) {
  const m = raw.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/)
  if (!m) return { prefix: '', num: 0, suffix: raw }
  return { prefix: m[1], num: parseInt(m[2]), suffix: m[3] }
}

function CountStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  const { prefix, num, suffix } = parseVal(value)
  const motionVal = useMotionValue(0)
  const display = useTransform(motionVal, (v) => `${prefix}${Math.round(v)}${suffix}`)

  useEffect(() => {
    if (inView) {
      animate(motionVal, num, { duration: 1.5, delay, ease: 'easeOut' })
    }
  }, [inView, motionVal, num, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: EASE }}
      style={{ padding: '32px 24px', background: 'rgba(201,168,76,.03)', border: '1px solid rgba(201,168,76,.08)', textAlign: 'center' }}
    >
      <motion.div style={{ fontFamily: 'var(--fd)', fontSize: '3rem', color: 'var(--g1)', lineHeight: 1, marginBottom: 8 }}>
        {display}
      </motion.div>
      <div style={{ fontSize: 'var(--nano)', color: 'var(--dim)', letterSpacing: '.15em', textTransform: 'uppercase' }}>{label}</div>
    </motion.div>
  )
}

export default function AboutContent() {
  const heroRef = useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef, { once: true })
  const storyRef = useRef<HTMLElement>(null)
  const storyInView = useInView(storyRef, { once: true, margin: '-10%' })
  const whoRef = useRef<HTMLElement>(null)
  const whoInView = useInView(whoRef, { once: true, margin: '-10%' })
  const ctaRef = useRef<HTMLElement>(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: '-10%' })

  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} style={{ background: 'var(--void)', padding: '160px 0 80px', borderBottom: '1px solid rgba(201,168,76,.07)' }}>
        <div className="w">
          <motion.span
            className="ey"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400, lineHeight: 1.05, marginBottom: 24 }}
          >
            Built from inside<br /><em>the process.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.38 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 600, lineHeight: 1.8 }}
          >
            The NCA Hub was not built by an institution or a prep company. It was built by an internationally trained lawyer who went through the NCA process, identified what actually worked, and built a system around it.
          </motion.p>
        </div>
      </section>

      {/* Stats — animated count-up */}
      <section style={{ background: 'var(--abyss)', padding: '60px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {STATS.map((s, i) => (
              <CountStat key={s.label} value={s.value} label={s.label} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* Story — two-column slide-in */}
      <section ref={storyRef} style={{ background: 'var(--void)', padding: '100px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <motion.div
              initial={{ opacity: 0, x: -56 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: 32, color: 'var(--cream)' }}>
                The NCA is not a knowledge test.<br /><em>It is a technique test.</em>
              </h2>
              <p style={{ fontSize: '.95rem', color: 'var(--fog)', lineHeight: 1.85, marginBottom: 24 }}>
                The founder of The NCA Hub qualified as a lawyer in India. When he arrived in Canada and received his NCA assessment, he was assigned all five subjects. His first exam sitting was seven days after he decided to prepare for Administrative Law.
              </p>
              <p style={{ fontSize: '.95rem', color: 'var(--fog)', lineHeight: 1.85, marginBottom: 24 }}>
                He passed on the first attempt — not because he read more than other candidates, but because he identified what the NCA was actually testing. The exam is not asking you to demonstrate deep legal knowledge. It is asking you to apply a specific framework to a specific fact pattern within a time limit.
              </p>
              <p style={{ fontSize: '.95rem', color: 'var(--fog)', lineHeight: 1.85 }}>
                That insight became The NCA Hub. Under 80 pages per subject. Answer templates built from the exam up. A readiness assessment that tells you honestly where you stand before you sit. Everything else is cut.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 56 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            >
              <div style={{ background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.12)', padding: 36, marginBottom: 24 }}>
                <div style={{ fontSize: 'var(--nano)', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 20, fontWeight: 600 }}>
                  The Method
                </div>
                {METHOD.map((item, i) => (
                  <motion.div
                    key={item.n}
                    initial={{ opacity: 0, x: 24 }}
                    animate={storyInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.65, delay: 0.28 + i * 0.1, ease: EASE }}
                    style={{ display: 'flex', gap: 20, marginBottom: i < METHOD.length - 1 ? 24 : 0, paddingBottom: i < METHOD.length - 1 ? 24 : 0, borderBottom: i < METHOD.length - 1 ? '1px solid rgba(201,168,76,.07)' : 'none' }}
                  >
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', color: 'rgba(201,168,76,.3)', lineHeight: 1, flexShrink: 0, minWidth: 40 }}>{item.n}</div>
                    <div>
                      <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--cream)', marginBottom: 6 }}>{item.t}</div>
                      <div style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{item.d}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who uses it — staggered grid */}
      <section ref={whoRef} style={{ background: 'var(--abyss)', padding: '80px 0', borderBottom: '1px solid rgba(201,168,76,.06)' }}>
        <div className="w">
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={whoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 400, marginBottom: 16, color: 'var(--cream)' }}
          >
            Who uses The NCA Hub
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={whoInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: 'var(--sm)', color: 'var(--fog)', maxWidth: 600, marginBottom: 48, lineHeight: 1.75 }}
          >
            The NCA Hub is used by internationally trained lawyers from across the world, most of whom are working full-time while preparing for their exams.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {COUNTRIES.map((c, i) => (
              <motion.div
                key={c.country}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={whoInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: EASE }}
                style={{ padding: '24px 20px', background: 'rgba(201,168,76,.02)', border: '1px solid rgba(201,168,76,.07)' }}
              >
                <div style={{ fontSize: '.9rem', color: 'var(--cream)', fontWeight: 600, marginBottom: 10 }}>{c.country}</div>
                <div style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65 }}>{c.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} style={{ background: 'var(--void)', padding: '100px 0 140px', textAlign: 'center' }}>
        <div className="w">
          <motion.h2
            initial={{ opacity: 0, y: 36 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: EASE }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, color: 'var(--cream)', marginBottom: 16 }}
          >
            Ready to start?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.22 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 480, margin: '0 auto 40px' }}
          >
            Get your readiness score first. Then pick the subject that matters most.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.38, ease: EASE }}
            style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}
          >
            <Link href="/#readiness" className="bp"><span>Get My Readiness Score →</span></Link>
            <Link href="/notes/" className="nc"><span>Browse Notes</span></Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media(max-width:1024px){section > div > div[style*="repeat(4, 1fr)"]{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:768px){
          section > div > div[style*="repeat(3, 1fr)"]{grid-template-columns:1fr!important}
          section > div > div[style*="1fr 1fr"]{grid-template-columns:1fr!important;gap:48px!important}
        }
      `}</style>
    </main>
  )
}
