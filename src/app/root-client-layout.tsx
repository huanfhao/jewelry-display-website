'use client'

import { useUserPreferences } from '@/hooks/useUserPreferences'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import FacebookPixel from '@/components/analytics/FacebookPixel'
import dynamic from 'next/dynamic'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

const AccessibilityWidget = dynamic(() => import('@/components/accessibility/AccessibilityWidget'), {
  ssr: false,
  loading: () => null
})

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const { preferences } = useUserPreferences()
  const theme = preferences.theme || 'light'

  useEffect(() => {
    // 调用数据库预热API
    const warmupDatabase = async () => {
      try {
        const response = await fetch('/api/db-warmup')
        const data = await response.json()
        if (!data.success) {
          console.error('Database warmup failed:', data.message)
        }
      } catch (error) {
        console.error('Error during database warmup:', error)
      }
    }

    warmupDatabase()
  }, [])

  return (
    <SessionProvider>
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
      <Toaster />
    </SessionProvider>
  )
} 