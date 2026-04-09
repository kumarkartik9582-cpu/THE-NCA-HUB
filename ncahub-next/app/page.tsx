import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'

/* ─── Above-the-fold — loaded immediately ───────────────────────────────── */
import HeroSection from '@/components/sections/HeroSection'

/* ─── Below-the-fold — lazy-loaded for faster initial paint ──────────────── */
const PhilosophySection  = lazy(() => import('@/components/sections/PhilosophySection'))
const StorySection       = lazy(() => import('@/components/sections/StorySection'))
const MethodSection      = lazy(() => import('@/components/sections/MethodSection'))
const PodsSection        = lazy(() => import('@/components/sections/PodsSection'))
const ComparisonSection  = lazy(() => import('@/components/sections/ComparisonSection'))
const SubjectsSection    = lazy(() => import('@/components/sections/SubjectsSection'))
const StatsSection       = lazy(() => import('@/components/sections/StatsSection'))
const PricingSection     = lazy(() => import('@/components/sections/PricingSection'))
const ReadinessSection   = lazy(() => import('@/components/sections/ReadinessSection'))
const FreeChapterSection = lazy(() => import('@/components/sections/FreeChapterSection'))
const BlogSection        = lazy(() => import('@/components/sections/BlogSection'))
const CountrySection     = lazy(() => import('@/components/sections/CountrySection'))
const FAQSection         = lazy(() => import('@/components/sections/FAQSection'))

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

      {/* 2. Philosophy — the "big statement" manifesto */}
      <Suspense><PhilosophySection /></Suspense>

      {/* 3. Story — 4-chapter cinematic founder narrative */}
      <Suspense><StorySection /></Suspense>

      {/* 4. Method — four pillars that make us different */}
      <Suspense><MethodSection /></Suspense>

      {/* 5. Pods — accountability groups */}
      <Suspense><PodsSection /></Suspense>

      {/* 6. Comparison — factual table vs competitors */}
      <Suspense><ComparisonSection /></Suspense>

      {/* 7. Subjects — GSAP-pinned horizontal scroll panel */}
      <Suspense><SubjectsSection /></Suspense>

      {/* 8. Stats + Social proof — animated counters + testimonials */}
      <Suspense><StatsSection /></Suspense>

      {/* 9. Pricing — what you get and how to get it */}
      <Suspense><PricingSection /></Suspense>

      {/* 10. Readiness — interactive 6-question quiz */}
      <Suspense><ReadinessSection /></Suspense>

      {/* 11. Free Chapter — lead magnet download */}
      <Suspense><FreeChapterSection /></Suspense>

      {/* 12. Blog — latest articles */}
      <Suspense><BlogSection /></Suspense>

      {/* 13. Country Guides — jurisdiction-specific content */}
      <Suspense><CountrySection /></Suspense>

      {/* 14. FAQ — last-mile trust before conversion */}
      <Suspense><FAQSection /></Suspense>
    </>
  )
}
