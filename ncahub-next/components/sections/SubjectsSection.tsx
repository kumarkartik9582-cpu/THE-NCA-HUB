'use client'
/**
 * SubjectsSection — GSAP-pinned horizontal scroll panel with 3D cards.
 *
 * As the user scrolls DOWN, the panel slides horizontally across 8 subject cards.
 * Now with holographic card effects, perspective hover, and particle trails.
 */
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FloatingParticles from '@/components/ui/FloatingParticles'

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
        position: 'relative',
      }}
    >
      {/* Grid background */}
      <div className="grid-bg" aria-hidden="true" style={{
        position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none',
      }} />

      {/* Floating particles */}
      <FloatingParticles count={18} opacity={0.35} />

      {/* Glow line at top */}
      <div className="glow-line" style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', zIndex: 5,
      }} />

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
        <div className="neon-text" style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 4vw, 4rem)',
          fontWeight: 400, color: 'var(--cream)', lineHeight: 1.05, marginTop: 10,
        }}>
          Nothing wasted.
        </div>
        {/* Progress bar with glow */}
        <div style={{
          marginTop: 28, width: 160, height: 2,
          background: 'rgba(201,168,76,.08)', borderRadius: 2, overflow: 'hidden',
          position: 'relative',
        }}>
          <div
            ref={progressRef}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--g2), var(--g1), var(--g0))',
              width: '0%',
              boxShadow: '0 0 10px rgba(201,168,76,0.5)',
              borderRadius: 2,
            }}
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

    const onEnter = () => {
      gsap.to(el, {
        borderColor: 'rgba(201,168,76,0.35)',
        boxShadow: '0 0 40px rgba(201,168,76,0.08), 0 20px 60px rgba(0,0,0,0.3)',
        y: -4,
        duration: 0.4,
        ease: 'expo.out',
      })
    }
    const onLeave = () => {
      gsap.to(el, {
        borderColor: 'rgba(201,168,76,0.06)',
        boxShadow: 'none',
        y: 0,
        duration: 0.5,
        ease: 'expo.out',
      })
    }

    // 3D tilt effect
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(el, {
        rotateY: x * 6,
        rotateX: -y * 4,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
    const onLeaveReset = () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'expo.out' })
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeaveReset)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeaveReset)
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
        borderRadius: 8,
        position: 'relative',
        cursor: 'default',
        transition: 'border-color 0.35s',
        background: 'linear-gradient(170deg, rgba(201,168,76,0.03) 0%, rgba(8,8,16,0.6) 40%, rgba(201,168,76,0.01) 100%)',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        overflow: 'hidden',
      }}
    >
      {/* Vertical accent line with glow */}
      <div style={{
        position: 'absolute', top: '15%', left: -1,
        width: 2, height: '35%',
        background: `linear-gradient(${subject.accentAngle}, transparent, rgba(201,168,76,0.65), transparent)`,
        boxShadow: '0 0 8px rgba(201,168,76,0.2)',
      }} />

      {/* Corner accent */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0,
        width: 40, height: 40,
        borderTop: '1px solid rgba(201,168,76,0.15)',
        borderRight: '1px solid rgba(201,168,76,0.15)',
        borderRadius: '0 8px 0 0',
        opacity: 0.5,
      }} />

      {/* Large ghost number */}
      <div style={{
        position: 'absolute', top: '15%', right: 16,
        fontFamily: 'var(--fd)', fontSize: 'clamp(5rem, 9vw, 8rem)',
        lineHeight: 1, fontWeight: 300, userSelect: 'none',
      }}>
        <span className="gradient-text" style={{ opacity: 0.08 }}>{subject.code}</span>
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
          style={{
            fontSize: '.62rem', padding: '9px 16px', display: 'inline-flex',
            borderRadius: '4px',
          }}
        >
          <span>View Notes →</span>
        </Link>
      </div>
    </div>
  )
}
