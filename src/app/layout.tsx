import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import 'nprogress/nprogress.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomAnalytics from '@/components/analytics/Analytics'
import AccessibilityWidget from '@/components/accessibility/AccessibilityWidget'
import RouteChangeProvider from '@/app/providers/RouteChangeProvider';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { Suspense } from 'react'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter'
});
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  metadataBase: new URL('https://syjewelrydisplay.cn'),
  title: {
    default: 'Professional Jewelry Display | SY Jewelry Display',
    template: '%s | SY Jewelry Display'
  },
  description: 'Premium jewelry display manufacturer in Guangzhou. Offering custom acrylic displays, ring stands, necklace holders and wholesale solutions.',
  keywords: [
    'jewelry display manufacturer', 
    'jewelry display wholesale',
    'custom jewelry display',
    'acrylic jewelry display',
    'ring display stand',
    'necklace display',
    'watch display stand',
    'jewelry store fixtures',
    'retail display solutions',
    'Guangzhou manufacturer',
    'jewelry showcase manufacturer',
    'display stand wholesale'
  ],
  authors: [{ name: 'SY Jewelry Display' }],
  creator: 'SY Jewelry Display',
  publisher: 'SY Jewelry Display',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://syjewelrydisplay.cn',
    siteName: 'SY Jewelry Display',
    title: 'Professional Jewelry Display Manufacturer',
    description: 'Leading jewelry display manufacturer in Guangzhou. Custom acrylic displays, wholesale solutions, and premium quality products.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SY Jewelry Display - Premium Display Solutions'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SY Jewelry Display - Premium Display Solutions',
    description: 'Professional jewelry display manufacturer offering custom design and wholesale services.',
    images: ['/images/og-image.jpg'],
    creator: '@SYJewelryDisplay'
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
    },
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'bing': 'your-bing-verification-code'
    }
  },
  alternates: {
    canonical: 'https://syjewelrydisplay.cn',
    languages: {
      'en-US': 'https://syjewelrydisplay.cn',
      'zh-CN': 'https://syjewelrydisplay.cn/zh'
    }
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SY Jewelry Display",
    "url": "https://syjewelrydisplay.cn",
    "logo": "https://syjewelrydisplay.cn/favicon_io/android-chrome-512x512.png",
    "description": "Professional jewelry display manufacturer offering custom design and wholesale services.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Guangzhou",
      "addressRegion": "Guangdong",
      "addressCountry": "CN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+86 153 9578 7004",
      "contactType": "sales",
      "email": "SYJewelryDisplay@outlook.com",
      "availableLanguage": ["en", "zh"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/sy-jewelry-display",
      "https://www.facebook.com/SYJewelryDisplay"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  }

  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable}`}>
      <head>
        {/* 优先加载商店链接 */}
        <link 
          rel="preconnect" 
          href="https://store.flylinking.com"
          crossOrigin="anonymous"
        />
        <link 
          rel="dns-prefetch" 
          href="https://store.flylinking.com" 
        />
        <link 
          rel="prerender"  // 使用 prerender 替代 prefetch
          href="https://store.flylinking.com/s/2UPEH35FWO"
        />
        
        {/* 其他资源加载 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/images/hero.jpg" as="image" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* 图标配置 */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon_io/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon_io/android-chrome-512x512.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <RouteChangeProvider />
        <Suspense fallback={<div>Loading...</div>}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Suspense>
        <AccessibilityWidget />
        <GoogleAnalytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}