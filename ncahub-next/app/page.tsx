import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import PhilosophySection from '@/components/sections/PhilosophySection'
import ReadinessSection from '@/components/sections/ReadinessSection'
import MethodSection from '@/components/sections/MethodSection'
import PodsSection from '@/components/sections/PodsSection'
import StatsSection from '@/components/sections/StatsSection'
import SubjectsSection from '@/components/sections/SubjectsSection'
import PricingSection from '@/components/sections/PricingSection'
import FreeChapterSection from '@/components/sections/FreeChapterSection'
import FAQSection from '@/components/sections/FAQSection'
import CountrySection from '@/components/sections/CountrySection'
import BlogSection from '@/components/sections/BlogSection'

export const metadata: Metadata = {
  title: 'NCA Exam Prep Canada 2026 | Study Notes for Internationally Trained Lawyers | The NCA Hub',
  description:
    'Indian, UK, or foreign-trained lawyer qualifying in Canada? Concise NCA notes (under 80 pages), answer templates & free readiness score. Built by someone who passed all 5 NCA subjects — starting with 7 days to prepare.',
  alternates: { canonical: 'https://www.thencahub.com/' },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PhilosophySection />
      <ReadinessSection />
      <MethodSection />
      <PodsSection />
      <StatsSection />
      <SubjectsSection />
      <PricingSection />
      <FreeChapterSection />
      <FAQSection />
      <CountrySection />
      <BlogSection />
    </>
  )
}
