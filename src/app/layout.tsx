import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'nprogress/nprogress.css'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial']
})

const LoadingFallback = dynamic(() => import('@/components/common/LoadingFallback'))
const RootClientLayout = dynamic(() => import('./root-client-layout'), {
  ssr: true,
  loading: () => <LoadingFallback />
})

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Professional Jewelry Display",
  "url": "https://syjewelrydisplay.cn",
  "logo": "https://syjewelrydisplay.cn/logo.png",
  "description": "Professional jewelry display manufacturer offering custom design and wholesale services."
}

export const metadata: Metadata = {
  metadataBase: new URL('https://syjewelrydisplay.cn'),
  title: {
    template: '%s | Professional Jewelry Display',
    default: 'Professional Jewelry Display - Custom Jewelry Display Solutions'
  },
  description: 'Professional jewelry display manufacturer offering custom design and wholesale services.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    shortcut: [
      { url: '/favicon.ico' }
    ]
  },
  openGraph: {
    title: 'Professional Jewelry Display - Custom Jewelry Display Solutions',
    description: 'Professional jewelry display manufacturer offering custom design and wholesale services.',
    url: 'https://syjewelrydisplay.cn',
    siteName: 'Professional Jewelry Display',
    locale: 'en_US',
    type: 'website',
  }
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://flylink-cdn-oss-prod.inflyway.com" />
        <link rel="preconnect" href="https://store.flylinking.com" />
        
        <link 
          rel="preload" 
          href="/fonts/inter.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="" 
        />
        
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://flylink-cdn-oss-prod.inflyway.com" />
        
        <link rel="prefetch" href="/products" />
        <link rel="prefetch" href="/about" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Suspense fallback={<LoadingFallback />}>
          <RootClientLayout>{children}</RootClientLayout>
        </Suspense>
      </body>
    </html>
  )
}