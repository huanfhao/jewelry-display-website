'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SeoOptimizer() {
  const pathname = usePathname()

  useEffect(() => {
    // 添加面包屑导航结构化数据
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": pathname.split('/').filter(Boolean).map((part, index, array) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": part.charAt(0).toUpperCase() + part.slice(1),
        "item": `https://syjewelrydisplay.cn/${array.slice(0, index + 1).join('/')}`
      }))
    })
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [pathname])

  return null
} 