import type { Metadata } from 'next'
import AboutContent from '@/components/sections/AboutContent'

export const metadata: Metadata = {
  title: 'About | The NCA Hub',
  description: 'The NCA Hub was built by an India-qualified lawyer who passed all 5 NCA subjects. The system is designed for working candidates with limited time and real stakes.',
  alternates: { canonical: 'https://www.thencahub.com/about/' },
}

export default function AboutPage() {
  return <AboutContent />
}
