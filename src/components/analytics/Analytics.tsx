'use client'

import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import GoogleAnalytics from './GoogleAnalytics'
import FacebookPixel from './FacebookPixel'

export default function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <VercelAnalytics />
      <SpeedInsights />
      <FacebookPixel />
    </>
  )
} 