import type { Metadata } from 'next'
import Providers from '@/components/providers/Providers'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'NCA Exam Prep Canada 2026 | The NCA Hub',
    template: '%s | The NCA Hub',
  },
  description:
    'Concise NCA notes (under 80 pages), answer templates & free readiness score for internationally trained lawyers qualifying in Canada. Built by someone who passed all 5 NCA subjects.',
  metadataBase: new URL('https://www.thencahub.com'),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://www.thencahub.com',
    siteName: 'The NCA Hub',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thencahub',
    creator: '@thencahub',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" dir="ltr">
      <head>
        {/* Google Fonts — preconnect for performance, then async load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://payhip.com" />
        <link rel="dns-prefetch" href="https://formspree.io" />
      </head>
      <body>
        <Providers>
          {/* Overlays */}
          <div className="grain" aria-hidden="true" />
          <div id="vignette" aria-hidden="true" />
          <div id="prog" role="progressbar" aria-hidden="true" />
          <div id="discovery-bar" aria-hidden="true">
            Read by NCA candidates across 12+ countries &nbsp;·&nbsp;{' '}
            <span>Internationally qualified lawyers qualifying in Canada</span>
          </div>
          <Cursor />
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
