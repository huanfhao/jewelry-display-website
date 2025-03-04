'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SeoOptimizer() {
  const pathname = usePathname()

  useEffect(() => {
    // 更新结构化数据
    const updateStructuredData = () => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SY Jewelry Display',
        url: 'https://syjewelrydisplay.cn',
        logo: 'https://syjewelrydisplay.cn/logo.png',
        description: 'Professional jewelry display manufacturer offering custom design and wholesale services.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Guangzhou',
          addressRegion: 'Guangdong',
          addressCountry: 'CN'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+86 153 9578 7004',
          contactType: 'sales',
          email: 'SYJewelryDisplay@outlook.com',
          availableLanguage: ['en', 'zh']
        },
        sameAs: [
          'https://www.linkedin.com/company/sy-jewelry-display',
          'https://www.facebook.com/SYJewelryDisplay'
        ]
      })
      document.head.appendChild(script)
    }

    // 更新 Meta 标签
    const updateMetaTags = () => {
      const meta = {
        'og:type': 'website',
        'og:site_name': 'SY Jewelry Display',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@SYJewelryDisplay',
        'theme-color': '#ffffff',
        'format-detection': 'telephone=no',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default'
      }

      Object.entries(meta).forEach(([name, content]) => {
        let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
        if (!tag) {
          tag = document.createElement('meta') as HTMLMetaElement
          tag.setAttribute('name', name)
          document.head.appendChild(tag)
        }
        tag.setAttribute('content', content)
      })
    }

    updateStructuredData()
    updateMetaTags()

    return () => {
      document.querySelectorAll('script[type="application/ld+json"]')
        .forEach(el => el.remove())
    }
  }, [pathname])

  return null
} 