import type { Metadata } from 'next'

/* ─── Sections — ordered for max narrative / visual impact ─────────────────
   Old: 12 sections loaded all at once → laggy
   New: 7 sections, each lazy-loaded via React.lazy in Providers
   ──────────────────────────────────────────────────────────────────────── */
import HeroSection      from '@/components/sections/HeroSection'
import PhilosophySection from '@/components/sections/PhilosophySection'
import MethodSection    from '@/components/sections/MethodSection'
import SubjectsSection  from '@/components/sections/SubjectsSection'
import StatsSection     from '@/components/sections/StatsSection'
import PricingSection   from '@/components/sections/PricingSection'
import FAQSection       from '@/components/sections/FAQSection'

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

      {/* 2. Philosophy — the "big statement" full-viewport manifesto */}
      <PhilosophySection />

      {/* 3. Method — four pillars that make us different */}
      <MethodSection />

      {/* 4. Subjects — GSAP-pinned horizontal scroll panel (the showstopper) */}
      <SubjectsSection />

      {/* 5. Stats + Social proof — animated counters + testimonials */}
      <StatsSection />

      {/* 6. Pricing — what you get and how to get it */}
      <PricingSection />

      {/* 7. FAQ — last-mile trust before conversion */}
      <FAQSection />
    </>
  )
}
