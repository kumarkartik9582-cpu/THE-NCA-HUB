import type { Metadata } from 'next'
import BlogPageContent from '@/components/sections/BlogPageContent'

export const metadata: Metadata = {
  title: 'NCA Exam Prep Articles & Guides | The NCA Hub',
  description: 'Free guides on NCA exam strategy, subject breakdowns, study schedules, and how to recover from a failed exam. Written by someone who passed all 5 NCA subjects.',
  alternates: { canonical: 'https://www.thencahub.com/blog/' },
}

export default function BlogPage() {
  return <BlogPageContent />
}
