'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const FEATURED_POSTS = [
  { slug: 'article-a2-nca-exam-format', title: 'The NCA Exam Format Explained', cat: 'Exam Strategy', date: 'Mar 2026' },
  { slug: 'article-b1-constitutional-law-nca', title: 'How to Tackle Constitutional Law', cat: 'Subject Guide', date: 'Feb 2026' },
  { slug: 'article-c1-failed-nca-exam', title: 'Failed the NCA Exam? What to Do Next', cat: 'Recovery', date: 'Feb 2026' },
  { slug: 'article-e1-nca-study-schedule-working', title: 'NCA Study Schedule While Working Full-Time', cat: 'Planning', date: 'Jan 2026' },
  { slug: 'article-d1-nca-prep-materials-compared', title: 'NCA Prep Materials Compared (2026)', cat: 'Resources', date: 'Jan 2026' },
  { slug: 'article-c3-one-month-nca-prep', title: 'One Month NCA Prep — A Realistic Plan', cat: 'Planning', date: 'Dec 2025' },
]

export default function BlogSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="blog" aria-label="Free Guides" ref={ref}
      style={{ background: 'var(--void)', borderTop: '1px solid rgba(201,168,76,.07)', padding: '140px 0', position: 'relative', zIndex: 1 }}>
      <div className="w">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <motion.span className="ey"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}>
              Free Guides
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, lineHeight: 1.1 }}>
              Everything you need<br /><em>to know.</em>
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
            <Link href="/blog/" className="nc"><span>All Articles →</span></Link>
          </motion.div>
        </div>

        <div id="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {FEATURED_POSTS.map((post, i) => (
            <motion.div key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}>
              <Link href={`/blog/${post.slug}/`} className="art-card"
                style={{
                  display: 'block', padding: '28px 24px',
                  background: 'rgba(201,168,76,.03)',
                  border: '1px solid rgba(201,168,76,.08)',
                  transition: 'border-color .3s ease, background .3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.25)'; e.currentTarget.style.background = 'rgba(201,168,76,.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,.08)'; e.currentTarget.style.background = 'rgba(201,168,76,.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--g2)', fontWeight: 600 }}>{post.cat}</span>
                  <span style={{ fontSize: 'var(--nano)', color: 'var(--dim)' }}>{post.date}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', color: 'var(--cream)', lineHeight: 1.4, fontWeight: 400 }}>
                  {post.title}
                </h3>
                <div style={{ marginTop: 20, fontSize: 'var(--nano)', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--g1)' }}>
                  Read →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){#blog-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
