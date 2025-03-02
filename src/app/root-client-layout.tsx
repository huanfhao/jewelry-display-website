'use client'

import { useUserPreferences } from '@/hooks/useUserPreferences'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import FacebookPixel from '@/components/analytics/FacebookPixel'
import dynamic from 'next/dynamic'

const AccessibilityWidget = dynamic(() => import('@/components/accessibility/AccessibilityWidget'), {
  ssr: false,
  loading: () => null
})

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const { preferences } = useUserPreferences()
  const theme = preferences.theme || 'light'

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      <AccessibilityWidget />
      <GoogleAnalytics />
      <VercelAnalytics />
      <SpeedInsights />
      <FacebookPixel />
    </>
  )
} 