import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | The NCA Hub',
  description: 'Questions about NCA notes, payment plans, or anything else. Email thencahub@gmail.com — response within 24 hours.',
  alternates: { canonical: 'https://www.thencahub.com/contact/' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
