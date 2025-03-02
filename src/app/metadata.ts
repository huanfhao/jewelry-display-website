import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | SY Jewelry Display',
    default: 'SY Jewelry Display - Professional Jewelry Display Manufacturer'
  },
  description: 'Professional jewelry display manufacturer offering custom design and wholesale services. High-quality acrylic, wooden and metal display stands for jewelry stores.',
  keywords: [
    'jewelry display',
    'display stands',
    'jewelry store fixtures',
    'retail display',
    'custom display',
    'wholesale display'
  ],
  openGraph: {
    title: 'SY Jewelry Display - Professional Jewelry Display Manufacturer',
    description: 'Professional jewelry display manufacturer offering custom design and wholesale services.',
    url: 'https://syjewelrydisplay.cn',
    siteName: 'SY Jewelry Display',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SY Jewelry Display - Professional Jewelry Display Manufacturer',
    description: 'Professional jewelry display manufacturer offering custom design and wholesale services.',
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
  }
} 