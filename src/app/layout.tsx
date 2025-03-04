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
  "name": "SY Jewelry Display",
  "url": "https://syjewelrydisplay.cn",
  "logo": "https://syjewelrydisplay.cn/logo.png",
  "description": "Leading manufacturer of high-quality jewelry displays and store fixtures",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Guangzhou",
    "addressRegion": "Guangdong",
    "addressCountry": "CN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+86-153-9578-7004",
    "contactType": "sales",
    "email": "SYJewelryDisplay@outlook.com",
    "availableLanguage": ["en", "zh"]
  },
  "sameAs": [
    "https://www.facebook.com/your-page",
    "https://www.instagram.com/your-page",
    "https://www.linkedin.com/company/your-page"
  ]
}

export const metadata: Metadata = {
  metadataBase: new URL('https://syjewelrydisplay.cn'),
  title: {
    template: '%s | SY Jewelry Display',
    default: 'SY Jewelry Display - Professional Jewelry Display Manufacturer'
  },
  description: 'Leading manufacturer of high-quality jewelry displays, showcases, and retail store fixtures. Custom design solutions for jewelry stores worldwide.',
  keywords: [
    'jewelry display manufacturer',
    'jewelry showcase design',
    'retail store fixtures',
    'custom jewelry displays',
    'jewelry store equipment',
    'display solutions'
  ].join(', '),
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
    type: 'website',
    siteName: 'SY Jewelry Display',
    title: 'Professional Jewelry Display Solutions',
    description: 'Custom jewelry display manufacturer offering premium quality display stands and retail solutions.',
    url: 'https://syjewelrydisplay.cn',
    images: [{
      url: '/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'SY Jewelry Display - Professional Display Solutions'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Jewelry Display - Custom Solutions',
    description: 'Leading manufacturer of jewelry displays and store fixtures',
    images: ['/images/og-image.jpg']
  },
  alternates: {
    canonical: 'https://syjewelrydisplay.cn',
    languages: {
      'en-US': 'https://syjewelrydisplay.cn/en',
      'zh-CN': 'https://syjewelrydisplay.cn/zh'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  verification: {
    google: 'your-google-verification-code'
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