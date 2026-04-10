'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const GUIDES = [
  { href: '/nca-for-indian-lawyers/', country: 'India', flag: '🇮🇳', desc: 'LLB graduates from India — the full path to Canadian qualification.' },
  { href: '/nca-for-uk-lawyers/', country: 'United Kingdom', flag: '🇬🇧', desc: 'UK-qualified solicitors and barristers navigating the NCA process.' },
  { href: '/nca-for-nigerian-lawyers/', country: 'Nigeria', flag: '🇳🇬', desc: 'Nigerian-qualified lawyers — what to expect and how to prepare.' },
  { href: '/nca-for-pakistani-lawyers/', country: 'Pakistan', flag: '🇵🇰', desc: 'Pakistani LLB graduates qualifying as Canadian lawyers.' },
  { href: '/nca-for-philippine-lawyers/', country: 'Philippines', flag: '🇵🇭', desc: 'Philippine-qualified lawyers on the path to Canadian bar membership.' },
  { href: '/nca-for-jamaican-lawyers/', country: 'Jamaica', flag: '🇯🇲', desc: 'Jamaican attorneys qualifying through the NCA process.' },
]

export default function CountrySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="country-guides" aria-label="Candidate guides by country" ref={ref}
      style={{ background: 'var(--void)', borderTop: '1px solid rgba(201,168,76,.07)', padding: '140px 0', position: 'relative', zIndex: 1 }}>
      <div className="w">
        <motion.span className="ey"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}>
          Candidate Guides
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>
          Wherever you qualified,<br /><em>we have your guide.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 600, marginBottom: 56 }}>
          Country-specific NCA guides for the jurisdictions most of our candidates come from.
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {GUIDES.map((g, i) => (
            <motion.div key={g.href}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              <Link href={g.href} className="cg-card"
                style={{
                  display: 'flex', flexDirection: 'column', gap: 12, padding: '24px 20px',
                  background: 'rgba(201,168,76,.02)', border: '1px solid rgba(201,168,76,.08)',
                  transition: 'border-color .3s, background .3s', height: '100%',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.25)'; e.currentTarget.style.background = 'rgba(201,168,76,.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.08)'; e.currentTarget.style.background = 'rgba(201,168,76,.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <motion.span
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: '1.5rem', lineHeight: 1, display: 'inline-block' }}
                  >
                    {g.flag}
                  </motion.span>
                  <span style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--cream)', letterSpacing: '.04em' }}>{g.country}</span>
                </div>
                <p style={{ fontSize: 'var(--sm)', color: 'var(--dim)', lineHeight: 1.65 }}>{g.desc}</p>
                <span style={{ fontSize: 'var(--nano)', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--g1)' }}>
                  Read Guide →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){#country-guides .w > div:last-child{grid-template-columns:1fr 1fr!important}}`}</style>
    </section>
  )
}
