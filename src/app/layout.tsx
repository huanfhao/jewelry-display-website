import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'nprogress/nprogress.css'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const LoadingFallback = dynamic(() => import('@/components/common/LoadingFallback'))
const RootClientLayout = dynamic(() => import('./root-client-layout'))

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SY Jewelry Display",
  "url": "https://syjewelrydisplay.cn",
  "logo": "https://syjewelrydisplay.cn/logo.png",
  "description": "Professional jewelry display manufacturer offering custom design and wholesale services."
}

export const metadata: Metadata = {
  metadataBase: new URL('https://syjewelrydisplay.cn'),
  title: {
    template: '%s | SY Jewelry Display',
    default: 'SY Jewelry Display - Professional Jewelry Display Manufacturer'
  },
  description: 'Professional jewelry display manufacturer offering custom design and wholesale services.',
  openGraph: {
    title: 'SY Jewelry Display - Professional Jewelry Display Manufacturer',
    description: 'Professional jewelry display manufacturer offering custom design and wholesale services.',
    url: 'https://syjewelrydisplay.cn',
    siteName: 'SY Jewelry Display',
    locale: 'en_US',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Suspense fallback={<LoadingFallback />}>
          <RootClientLayout>{children}</RootClientLayout>
        </Suspense>
      </body>
    </html>
  )
}