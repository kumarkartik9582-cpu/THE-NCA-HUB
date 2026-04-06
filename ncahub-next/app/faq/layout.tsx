import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | The NCA Hub',
  description: 'Frequently asked questions about the NCA process, The NCA Hub notes, exam strategy, and purchasing. All answers in one place.',
  alternates: { canonical: 'https://www.thencahub.com/faq/' },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
