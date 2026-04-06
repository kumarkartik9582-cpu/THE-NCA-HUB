'use client'
/**
 * SubjectsSection — GSAP-pinned horizontal scroll panel.
 *
 * As the user scrolls DOWN, the panel slides horizontally across 8 subject cards.
 * This is the "activetheory / mokn" style cinematic scroll experience.
 */
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from '@/components/ui/SplitText'
import ScrollReveal from '@/components/ui/ScrollReveal'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const SUBJECTS = [
  {
    code: '01',
    title: 'Administrative\nLaw',
    tagline: 'Vavilov. Dunsmuir. Standard of review — mapped cold.',
    href: '/notes/administrative-law/',
    accentAngle: '135deg',
  },
  {
    code: '02',
    title: 'Constitutional\nLaw',
    tagline: 'Charter rights. Division of powers. Section 1 analysis.',
    href: '/notes/constitutional-law/',
    accentAngle: '120deg',
  },
  {
    code: '03',
    title: 'Criminal\nLaw',
    tagline: 'Actus reus. Mens rea. Defences. Exam-ready templates.',
    href: '/notes/criminal-law/',
    accentAngle: '150deg',
  },
  {
    code: '04',
    title: 'Foundations of\nCanadian Law',
    tagline: 'Indigenous law. Quebec civil law. Federal structure.',
    href: '/notes/foundations-of-canadian-law/',
    accentAngle: '110deg',
  },
  {
    code: '05',
    title: 'Professional\nResponsibility',
    tagline: 'Ethics, conflicts of interest, Law Society obligations.',
    href: '/notes/professional-responsibility/',
    accentAngle: '160deg',
  },
  {
    code: '06',
    title: 'Contract\nLaw',
    tagline: 'Formation, breach, remedies — nothing left out.',
    href: '/notes/',
    accentAngle: '125deg',
  },
  {
    code: '07',
    title: 'Family\nLaw',
    tagline: 'Spousal support, parenting orders, Hague Convention.',
    href: '/notes/',
    accentAngle: '145deg',
  },
  {
    code: '08',
    title: 'Evidence\nLaw',
    tagline: 'Admissibility, hearsay exceptions, privilege.',
    href: '/notes/',
    accentAngle: '130deg',
  },
]

export default function SubjectsSection() {
  const sectionRef = useRef<HTMLElement>(null!)
  const trackRef = useRef<HTMLDivElement>(null!)
  const progressRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const getScrollDist = () => track.scrollWidth - window.innerWidth

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getScrollDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDist()}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`
            }
          },
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="subjects"
      aria-label="NCA Subjects"
      style={{
        overflow: 'hidden',
        background: 'var(--void)',
        borderTop: '1px solid rgba(201,168,76,.06)',
      }}
    >
      {/* Fixed header overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          padding: 'clamp(40px, 6vh, 64px) clamp(24px, 5vw, 72px) 0',
          background: 'linear-gradient(to bottom, var(--void) 65%, transparent)',
          pointerEvents: 'none',
        }}
      >
        <span className="ey">Every NCA Subject</span>
        <div style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 4rem)',
          fontWeight: 400, color: 'var(--cream)', lineHeight: 1.05, marginTop: 10,
        }}>
          Nothing wasted.
        </div>
        {/* Progress bar */}
        <div style={{
          marginTop: 28, width: 160, height: 1,
          background: 'rgba(201,168,76,.12)', borderRadius: 1, overflow: 'hidden',
        }}>
          <div
            ref={progressRef}
            style={{ height: '100%', background: 'var(--g1)', width: '0%' }}
          />
        </div>
        <p style={{
          fontSize: 'var(--nano)', letterSpacing: '.22em', textTransform: 'uppercase',
          color: 'var(--dim)', marginTop: 10,
        }}>
          Drag or scroll to explore →
        </p>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          height: '100vh',
          paddingTop: '200px',
          paddingLeft: 'clamp(24px, 5vw, 72px)',
          paddingRight: 'clamp(24px, 5vw, 72px)',
          gap: 24,
          willChange: 'transform',
        }}
      >
        {/* Leading spacer */}
        <div style={{ flexShrink: 0, width: 'clamp(200px, 28vw, 360px)' }} />

        {SUBJECTS.map((s, i) => (
          <SubjectCard key={s.code} subject={s} index={i} />
        ))}

        {/* Trailing spacer */}
        <div style={{ flexShrink: 0, width: 'clamp(24px, 5vw, 72px)' }} />
      </div>
    </section>
  )
}

function SubjectCard({ subject, index }: { subject: typeof SUBJECTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onEnter = () => gsap.to(el, { borderColor: 'rgba(201,168,76,0.35)', duration: 0.35 })
    const onLeave = () => gsap.to(el, { borderColor: 'rgba(201,168,76,0.06)', duration: 0.4 })
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        flexShrink: 0,
        width: 'clamp(240px, 20vw, 300px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 'clamp(36px, 5vh, 56px)',
        paddingLeft: 24,
        paddingRight: 24,
        border: '1px solid rgba(201,168,76,.06)',
        borderRadius: 4,
        position: 'relative',
        cursor: 'default',
        transition: 'border-color 0.35s',
        background: 'rgba(255,255,255,0.015)',
      }}
    >
      {/* Vertical accent line */}
      <div style={{
        position: 'absolute', top: '20%', left: -1,
        width: 2, height: '30%',
        background: `linear-gradient(${subject.accentAngle}, transparent, rgba(201,168,76,0.55), transparent)`,
      }} />

      {/* Large ghost number */}
      <div style={{
        position: 'absolute', top: '18%', right: 16,
        fontFamily: 'var(--fd)', fontSize: 'clamp(5rem, 9vw, 8rem)',
        color: 'rgba(201,168,76,0.07)', lineHeight: 1,
        fontWeight: 300, userSelect: 'none',
      }}>
        {subject.code}
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          fontSize: 'var(--nano)', letterSpacing: '.3em', textTransform: 'uppercase',
          color: 'var(--g2)', marginBottom: 16,
        }}>
          Subject {subject.code}
        </div>

        <h3 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
          fontWeight: 400, lineHeight: 1.1, color: 'var(--cream)',
          marginBottom: 14, whiteSpace: 'pre-line',
        }}>
          {subject.title}
        </h3>

        <p style={{ fontSize: 'var(--sm)', color: 'var(--fog)', lineHeight: 1.65, marginBottom: 28 }}>
          {subject.tagline}
        </p>

        <Link
          href={subject.href}
          className="nc"
          style={{ fontSize: '.62rem', padding: '9px 16px', display: 'inline-flex' }}
        >
          <span>View Notes →</span>
        </Link>
      </div>
    </div>
  )
}
