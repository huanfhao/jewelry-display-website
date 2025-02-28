import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import 'nprogress/nprogress.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Analytics from '@/components/analytics/Analytics'

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
    default: 'SY Jewelry Display - Professional Jewelry Display Manufacturer',
    template: '%s | SY Jewelry Display'
  },
  description: 'Professional jewelry display manufacturer in Guangzhou. We offer high-quality jewelry displays, custom design services, and wholesale solutions.',
  keywords: [
    'jewelry display manufacturer', 
    'jewelry display wholesale',
    'custom jewelry display',
    'jewelry stand',
    'jewelry holder',
    'display manufacturer',
    'Guangzhou manufacturer',
    'jewelry store fixtures',
    'retail display solutions',
    'jewelry showcase'
  ],
  authors: [{ name: 'SY Jewelry Display' }],
  creator: 'SY Jewelry Display',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://syjewelrydisplay.cn',
    siteName: 'SY Jewelry Display',
    title: 'SY Jewelry Display - Professional Jewelry Display Manufacturer',
    description: 'Professional jewelry display manufacturer offering custom design and wholesale services. High-quality jewelry displays made in Guangzhou.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SY Jewelry Display - Professional Display Solutions'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SY Jewelry Display - Professional Display Solutions',
    description: 'Professional jewelry display manufacturer offering custom design and wholesale services.',
    images: ['/images/og-image.jpg']
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
    ]
  }

  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/images/hero.jpg" as="image" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* 完整的图标配置 */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon_io/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon_io/android-chrome-512x512.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* 添加结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/images/hero.jpg" as="image" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
