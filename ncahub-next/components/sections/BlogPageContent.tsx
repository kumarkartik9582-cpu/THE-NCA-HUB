'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const POSTS = [
  { slug: 'article-a1-what-is-nca', title: 'What Is the NCA? A Complete Guide for Foreign-Trained Lawyers', cat: 'Overview', date: 'Apr 2026', excerpt: 'Everything you need to know about the National Committee on Accreditation process — who it applies to, how long it takes, and what exams you will face.' },
  { slug: 'article-a2-nca-exam-format', title: 'The NCA Exam Format Explained', cat: 'Exam Strategy', date: 'Mar 2026', excerpt: 'Open-book, time-pressured, and deeply framework-dependent. Learn exactly what the NCA exams look like and how to structure your answers.' },
  { slug: 'article-a3-nca-timeline', title: 'NCA Timeline: From Application to Bar Admission', cat: 'Planning', date: 'Mar 2026', excerpt: 'A realistic month-by-month breakdown of the full NCA process — application, assessment, exam windows, and law school requirements.' },
  { slug: 'article-b1-constitutional-law-nca', title: 'How to Tackle Constitutional Law', cat: 'Subject Guide', date: 'Feb 2026', excerpt: 'Constitutional Law is the most framework-heavy NCA subject. Here is how to master the Charter, division of powers, and section 35 Aboriginal rights.' },
  { slug: 'article-b2-administrative-law-nca', title: 'Administrative Law: The Vavilov Revolution', cat: 'Subject Guide', date: 'Feb 2026', excerpt: 'Since Vavilov (2019), the standard of review framework has fundamentally changed. This guide walks through what changed and how to apply it in exams.' },
  { slug: 'article-b3-criminal-law-nca', title: 'Criminal Law for the NCA: Frameworks Over Memory', cat: 'Subject Guide', date: 'Feb 2026', excerpt: 'Criminal Law rewards structured answers. Learn the actus reus / mens rea framework, the key defences, and sentencing principles the NCA actually tests.' },
  { slug: 'article-b4-professional-responsibility-nca', title: 'Professional Responsibility: Rules-Based and Predictable', cat: 'Subject Guide', date: 'Jan 2026', excerpt: 'PR is the most rules-based NCA subject. Master the duty of loyalty, conflict of interest rules, and trust accounting and you can score high.' },
  { slug: 'article-b5-foundations-nca', title: 'Foundations of Canadian Law: What It Actually Tests', cat: 'Subject Guide', date: 'Jan 2026', excerpt: 'Foundations is conceptual, not case-heavy. This guide covers sources of law, constitutional supremacy, and the common law vs civil law distinction.' },
  { slug: 'article-c1-failed-nca-exam', title: 'Failed the NCA Exam? What to Do Next', cat: 'Recovery', date: 'Feb 2026', excerpt: 'Failing an NCA exam is more common than people admit. Here is a practical guide to reviewing your performance, reapplying, and approaching the retake differently.' },
  { slug: 'article-c2-nca-anxiety', title: 'Managing NCA Exam Anxiety', cat: 'Mindset', date: 'Jan 2026', excerpt: 'High-stakes open-book exams create a specific kind of anxiety. Practical strategies to manage pressure and perform on exam day.' },
  { slug: 'article-c3-one-month-nca-prep', title: 'One Month NCA Prep — A Realistic Plan', cat: 'Planning', date: 'Dec 2025', excerpt: 'Given 30 days and one NCA subject, here is exactly how to allocate your time — including the week before the exam.' },
  { slug: 'article-d1-nca-prep-materials-compared', title: 'NCA Prep Materials Compared (2026)', cat: 'Resources', date: 'Jan 2026', excerpt: 'We compared every NCA prep resource on the market: textbooks, prep services, notes packages, and online guides. Here is the honest breakdown.' },
  { slug: 'article-d2-open-book-strategy', title: 'Open Book Exam Strategy for the NCA', cat: 'Exam Strategy', date: 'Dec 2025', excerpt: 'Open-book does not mean easy. Most candidates bring too much. Here is how to curate your materials and use them efficiently under time pressure.' },
  { slug: 'article-e1-nca-study-schedule-working', title: 'NCA Study Schedule While Working Full-Time', cat: 'Planning', date: 'Jan 2026', excerpt: 'Most NCA candidates are working while studying. This guide builds a realistic weekly schedule around a 40+ hour work week.' },
  { slug: 'article-e2-nca-multiple-subjects', title: 'Should You Take Multiple NCA Subjects at Once?', cat: 'Planning', date: 'Nov 2025', excerpt: 'Taking two or more NCA subjects simultaneously is possible — but requires careful sequencing. Here is when it makes sense and when it does not.' },
]

export default function BlogPageContent() {
  const heroRef = useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef, { once: true })
  const gridRef = useRef<HTMLElement>(null)
  const gridInView = useInView(gridRef, { once: true, margin: '0px' })

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
            Free Guides
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.05, marginBottom: 16 }}
          >
            Everything you need<br /><em>to know.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.38 }}
            style={{ fontSize: 'var(--lead)', color: 'var(--fog)', maxWidth: 560 }}
          >
            Practical guides on NCA exam strategy, subject breakdowns, and how to pass efficiently. Written by someone who passed all 5 subjects.
          </motion.p>
        </div>
      </section>

      {/* Grid — staggered cascade */}
      <section ref={gridRef} style={{ background: 'var(--void)', padding: '80px 0 140px' }}>
        <div className="w">
          <div className="blog-grid">
            {POSTS.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={gridInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.55, delay: i * 0.045, ease: EASE }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Link href={`/blog/${post.slug}/`} className="blog-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontSize: 'var(--nano)', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--g2)', fontWeight: 600 }}>{post.cat}</span>
                    <span style={{ fontSize: 'var(--nano)', color: 'var(--dim)' }}>{post.date}</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', color: 'var(--cream)', lineHeight: 1.4, fontWeight: 400, marginBottom: 12 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: 'var(--sm)', color: 'var(--dim)', lineHeight: 1.65, marginBottom: 20 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ fontSize: 'var(--nano)', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--g1)' }}>
                    Read →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
        .blog-card{display:block;padding:28px 24px;background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.08);transition:border-color .3s,background .3s;text-decoration:none;height:100%}
        .blog-card:hover{border-color:rgba(201,168,76,.25);background:rgba(201,168,76,.05)}
        @media(max-width:1024px){.blog-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.blog-grid{grid-template-columns:1fr}}
      `}</style>
    </main>
  )
}
