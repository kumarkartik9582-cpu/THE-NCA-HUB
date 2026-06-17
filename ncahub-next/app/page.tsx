import type { Metadata } from 'next'
import { lazy, Suspense } from 'react'
import HeroSection from '@/components/sections/HeroSection'

const SocialProofSection = lazy(() => import('@/components/sections/StatsSection'))
const WhatYouGetSection  = lazy(() => import('@/components/sections/MethodSection'))
const PricingSection     = lazy(() => import('@/components/sections/PricingSection'))
const FAQSection         = lazy(() => import('@/components/sections/FAQSection'))

export const metadata: Metadata = {
  title: 'NCA Exam Prep Canada 2026 | Study Notes for Internationally Trained Lawyers | The NCA Hub',
  description:
    'Concise NCA notes (under 80 pages), answer templates & practice questions for every NCA subject. Built by an internationally trained lawyer who passed all 5 — starting with 7 days to prepare.',
  alternates: { canonical: 'https://www.thencahub.com/' },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense><SocialProofSection /></Suspense>
      <Suspense><WhatYouGetSection /></Suspense>
      <Suspense><PricingSection /></Suspense>
      <Suspense><FAQSection /></Suspense>
    </>
  )
}
