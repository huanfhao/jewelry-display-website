'use client'

import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import 'nprogress/nprogress.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Suspense } from 'react'
import { useUserPreferences } from '@/hooks/useUserPreferences'
import dynamic from 'next/dynamic'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import FacebookPixel from '@/components/analytics/FacebookPixel'

const LoadingFallback = dynamic(() => import('@/components/common/LoadingFallback'), {
  ssr: true
})

const AccessibilityWidget = dynamic(() => import('@/components/accessibility/AccessibilityWidget'), {
  ssr: false,
  loading: () => null
})

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true
})

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { preferences } = useUserPreferences()
  const theme = preferences.theme || 'light'

  return (
    <html 
      lang={preferences.language || 'en'} 
      className={`scroll-smooth ${playfair.variable} ${theme}`}
      style={{ fontSize: `${preferences.fontSize === 'large' ? '1.1' : preferences.fontSize === 'small' ? '0.9' : '1'}rem` }}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Suspense fallback={<LoadingFallback />}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <AccessibilityWidget />
        </Suspense>
        <GoogleAnalytics />
        <VercelAnalytics />
        <SpeedInsights />
        <FacebookPixel />
      </body>
    </html>
  )
} 