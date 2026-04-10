'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrollProgress from '@/components/ui/ScrollProgress'

const EXPO = [0.16, 1, 0.3, 1] as const

export type PostData = {
  title: string
  cat: string
  date: string
  readTime: string
  excerpt: string
  body: string[]
}

function ArticleBlock({ block, index }: { block: string; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  if (block.startsWith('## ')) {
    return (
      <motion.h2
        ref={ref as React.Ref<HTMLHeadingElement>}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: EXPO }}
        style={{
          fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 400,
          color: 'var(--cream)', marginTop: 48, marginBottom: 20, lineHeight: 1.3,
        }}
      >
        {block.slice(3)}
      </motion.h2>
    )
  }

  return (
    <motion.p
      ref={ref as React.Ref<HTMLParagraphElement>}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EXPO }}
      style={{ fontSize: '.95rem', color: 'var(--fog)', lineHeight: 1.85, marginBottom: 24 }}
    >
      {block}
    </motion.p>
  )
}

export default function BlogPostContent({ post, slug }: { post: PostData; slug: string }) {
  const heroRef = useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef, { once: true })

  return (
    <main>
      <ScrollProgress />
      {/* Hero */}
      <section ref={heroRef} style={{ background: 'var(--void)', padding: '160px 0 60px', borderBottom: '1px solid rgba(201,168,76,.07)' }}>
        <div className="w" style={{ maxWidth: 800 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}
          >
            <Link href="/blog/" style={{ fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)' }}>
              ← All Articles
            </Link>
            <span style={{ color: 'var(--dim)' }}>·</span>
            <span style={{ fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--g2)', fontWeight: 600 }}>
              {post.cat}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EXPO }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 400, lineHeight: 1.1, color: 'var(--cream)', marginBottom: 24 }}
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.28 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', lineHeight: 1.7, marginBottom: 24 }}
          >
            {post.excerpt}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.44 }}
            style={{ display: 'flex', gap: 20, fontSize: 'var(--nano)', color: 'var(--dim)', letterSpacing: '.15em', textTransform: 'uppercase' }}
          >
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
            <span>·</span>
            <span>The NCA Hub</span>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section style={{ background: 'var(--void)', padding: '60px 0 120px' }}>
        <div className="w" style={{ maxWidth: 800 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 64, alignItems: 'start' }}>
            {/* Article content — each block self-triggered */}
            <article>
              {post.body.map((block, i) => (
                <ArticleBlock key={i} block={block} index={i} />
              ))}
            </article>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: 100 }}>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75, delay: 0.5, ease: EXPO }}
              >
                <div style={{ background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.12)', padding: 24, marginBottom: 16 }}>
                  <div style={{ fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 16, fontWeight: 600 }}>
                    Free Chapter
                  </div>
                  <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65, marginBottom: 20 }}>
                    Get a free chapter from the notes for any subject — no credit card required.
                  </p>
                  <Link href="/#free-chapter" className="bp" style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: '.68rem' }}>
                    <span>Get Free Chapter →</span>
                  </Link>
                </div>
                <div style={{ background: 'rgba(201,168,76,.02)', border: '1px solid rgba(201,168,76,.08)', padding: 24 }}>
                  <div style={{ fontSize: 'var(--nano)', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--g1)', marginBottom: 16, fontWeight: 600 }}>
                    All 5 Subjects
                  </div>
                  <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65, marginBottom: 20 }}>
                    Complete Bundle — under 80 pages per subject, answer templates included.
                  </p>
                  <Link href="/#pricing" className="nc" style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: '.68rem' }}>
                    <span>View Pricing →</span>
                  </Link>
                </div>
              </motion.div>
            </aside>
          </div>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid rgba(201,168,76,.08)' }}
          >
            <Link href="/blog/" style={{ fontSize: 'var(--sm)', color: 'var(--g1)', letterSpacing: '.15em', textTransform: 'uppercase' }}>
              ← Back to All Articles
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`@media(max-width:768px){article+aside{display:none!important}}`}</style>
    </main>
  )
}
