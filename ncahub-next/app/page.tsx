import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'

/* ─── Above-the-fold — loaded immediately ───────────────────────────────── */
import HeroSection from '@/components/sections/HeroSection'

/* ─── Below-the-fold — lazy-loaded for faster initial paint ──────────────── */
const PhilosophySection = lazy(() => import('@/components/sections/PhilosophySection'))
const MethodSection     = lazy(() => import('@/components/sections/MethodSection'))
const SubjectsSection   = lazy(() => import('@/components/sections/SubjectsSection'))
const StatsSection      = lazy(() => import('@/components/sections/StatsSection'))
const PricingSection    = lazy(() => import('@/components/sections/PricingSection'))
const FAQSection        = lazy(() => import('@/components/sections/FAQSection'))

export const metadata: Metadata = {
  title: 'NCA Exam Prep Canada 2026 | Study Notes for Internationally Trained Lawyers | The NCA Hub',
  description:
    'Indian, UK, or foreign-trained lawyer qualifying in Canada? Concise NCA notes (under 80 pages), answer templates & free readiness score. Built by someone who passed all 5 NCA subjects — starting with 7 days to prepare.',
  alternates: { canonical: 'https://www.thencahub.com/' },
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — 3D WebGL scene + kinetic headline + CTA */}
      <HeroSection />

      {/* 2–7: Below-fold sections — code-split and lazy-loaded */}
      <Suspense>
        <PhilosophySection />
      </Suspense>

      <Suspense>
        <MethodSection />
      </Suspense>

      <Suspense>
        <SubjectsSection />
      </Suspense>

      <Suspense>
        <StatsSection />
      </Suspense>

      <Suspense>
        <PricingSection />
      </Suspense>

      <Suspense>
        <FAQSection />
      </Suspense>
    </>
  )
}
