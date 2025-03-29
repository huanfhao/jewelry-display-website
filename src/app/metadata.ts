import { Metadata } from 'next'

const baseMetadata: Metadata = {
  metadataBase: new URL('https://syjewelrydisplay.cn'),
  title: {
    template: '%s | SY Jewelry Display',
    default: 'SY Jewelry Display - Leading Professional Jewelry Display Manufacturer in China'
  },
  description: 'SY Jewelry Display is China\'s leading manufacturer of premium jewelry display solutions, offering professional display props, stands, and retail fixtures for global jewelry businesses.',
  keywords: [
    'jewelry display manufacturer',
    'jewelry showcase design',
    'retail store fixtures',
    'custom jewelry displays',
    'jewelry store equipment',
    'display solutions',
    'wholesale',
    'B2B',
    'China manufacturer',
    'professional jewelry display'
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

// 主页的metadata
export const homeMetadata: Metadata = {
  ...baseMetadata,
  title: 'SY Jewelry Display - Leading Professional Jewelry Display Manufacturer in China',
  description: 'SY Jewelry Display is China\'s leading manufacturer of premium jewelry display solutions, offering professional display props, stands, and retail fixtures for global jewelry businesses.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'SY Jewelry Display - Leading Professional Jewelry Display Manufacturer in China',
    description: 'SY Jewelry Display is China\'s leading manufacturer of premium jewelry display solutions, offering professional display props, stands, and retail fixtures for global jewelry businesses.'
  }
}

export default baseMetadata 