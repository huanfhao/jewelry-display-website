import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://syjewelrydisplay.cn'),
  title: {
    template: '%s | SY Jewelry Display',
    default: 'SY Jewelry Display - Professional Jewelry Display Manufacturer'
  },
  description: 'Leading manufacturer of high-quality jewelry displays, showcases, and store fixtures. Custom design solutions for jewelry stores, retail displays, and exhibitions.',
  keywords: [
    'jewelry display',
    'jewelry showcase',
    'jewelry store fixtures',
    'retail display stands',
    'custom jewelry display',
    'wholesale display props',
    'acrylic display',
    'ring display',
    'necklace display',
    'watch display stand',
    'jewelry store equipment',
    'display manufacturer'
  ],
  authors: [{ name: 'SY Jewelry Display' }],
  openGraph: {
    type: 'website',
    siteName: 'SY Jewelry Display',
    title: 'Professional Jewelry Display Solutions',
    description: 'Custom jewelry display manufacturer offering premium quality display stands and retail solutions.',
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
    description: 'Custom jewelry display manufacturer offering premium quality display stands and retail solutions.',
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