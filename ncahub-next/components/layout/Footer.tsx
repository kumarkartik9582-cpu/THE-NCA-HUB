'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EXPO = [0.16, 1, 0.3, 1] as const

const COLS = [
  { title: 'Prepare', links: [
    { href: '/#method', label: 'The Method' }, { href: '/#pods', label: 'Pods' },
    { href: '/#subjects', label: 'Subjects' }, { href: '/#pricing', label: 'Pricing' },
    { href: '/#sample', label: 'Free Chapter' }, { href: '/readiness/', label: 'Readiness Score' },
  ] },
  { title: 'Subjects', links: [
    { href: '/notes/administrative-law/', label: 'Admin Law' },
    { href: '/notes/constitutional-law/', label: 'Con Law' },
    { href: '/notes/criminal-law/', label: 'Criminal Law' },
    { href: '/notes/foundations-of-canadian-law/', label: 'Foundations' },
    { href: '/notes/professional-responsibility/', label: 'Prof. Responsibility' },
  ] },
  { title: 'Guides', links: [
    { href: '/nca-for-indian-lawyers/', label: 'For Indian Lawyers' },
    { href: '/nca-for-uk-lawyers/', label: 'For UK Lawyers' },
    { href: '/nca-for-nigerian-lawyers/', label: 'For Nigerian Lawyers' },
    { href: '/nca-for-pakistani-lawyers/', label: 'For Pakistani Lawyers' },
    { href: '/nca-for-philippine-lawyers/', label: 'For Philippine Lawyers' },
  ] },
  { title: 'Legal', links: [
    { href: '/about/', label: 'About' }, { href: '/contact/', label: 'Contact' },
    { href: '/privacy.html', label: 'Privacy' }, { href: '/terms.html', label: 'Terms' },
    { href: '/refund.html', label: 'Refund' },
  ] },
]

const SOCIALS = [
  { href: 'https://www.linkedin.com/company/thencahub', label: 'LinkedIn' },
  { href: 'https://www.instagram.com/thencahub/', label: 'Instagram' },
]

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px' })

  return (
    <footer
      ref={ref}
      id="contact"
      style={{
        background: 'var(--void)',
        borderTop: '1px solid rgba(201,168,76,.07)',
        padding: '80px 48px 52px',
        position: 'relative', zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Animated glow line at top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: EXPO }}
        style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,.35) 30%, rgba(240,216,120,.5) 50%, rgba(201,168,76,.35) 70%, transparent 100%)',
          transformOrigin: 'center',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr repeat(4,auto)', gap: 48, marginBottom: 64 }}>

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EXPO }}
          >
            <Link href="/" style={{ display: 'block', marginBottom: 16 }}>
              <span className="neon-text" style={{
                fontFamily: 'var(--fd)', fontSize: '1.4rem', fontWeight: 500, color: 'var(--g1)',
              }}>THE NCA HUB</span>
            </Link>
            <p style={{ fontSize: 'var(--sm)', color: 'var(--dim)', lineHeight: 1.75, maxWidth: 260 }}>
              NCA exam prep for internationally trained lawyers qualifying in Canada.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              {SOCIALS.map(({ href, label }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 3, color: 'var(--g1)' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase',
                    color: 'var(--dim)',
                  }}
                >
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav columns — staggered */}
          {COLS.map((col, ci) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + ci * 0.08, ease: EXPO }}
            >
              <div style={{
                fontSize: 'var(--nano)', letterSpacing: '.3em', textTransform: 'uppercase',
                fontWeight: 600, marginBottom: 20,
              }}>
                <span className="gradient-text">{col.title}</span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map((l, li) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.25 + ci * 0.08 + li * 0.04, ease: EXPO }}
                  >
                    <Link href={l.href} style={{
                      fontSize: 'var(--sm)', color: 'var(--dim)',
                      transition: 'color .25s ease',
                    }}>
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.5, ease: EXPO }}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.15), transparent)',
            transformOrigin: 'center',
            marginBottom: 32,
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
        >
          <p style={{ fontSize: 'var(--nano)', color: 'var(--dim)', letterSpacing: '.1em' }}>
            © {new Date().getFullYear()} The NCA Hub. All rights reserved.
          </p>
          <p style={{ fontSize: 'var(--nano)', color: 'var(--dim)', letterSpacing: '.08em' }}>
            Built by an internationally qualified lawyer who passed all 5 NCA subjects.
          </p>
        </motion.div>
      </div>

      <style>{`
        @media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr!important;gap:32px!important}}
        footer{padding:52px 24px!important}
        @media(min-width:769px){footer{padding:80px 48px 52px!important}}
        footer a:hover { color: var(--g1) !important }
      `}</style>
    </footer>
  )
}
