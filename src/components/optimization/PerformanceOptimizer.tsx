'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PerformanceOptimizer() {
  const pathname = usePathname()

  useEffect(() => {
    // 预加载关键资源
    const preloadResources = () => {
      const links = [
        { rel: 'preload', href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
        { rel: 'preload', href: '/images/hero.jpg', as: 'image' },
        { rel: 'dns-prefetch', href: 'https://res.cloudinary.com' },
        { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
      ]

      links.forEach(({ rel, href, as, type, crossOrigin }) => {
        const link = document.createElement('link')
        link.rel = rel
        link.href = href
        if (as) link.as = as
        if (type) link.type = type
        if (crossOrigin) link.crossOrigin = crossOrigin
        document.head.appendChild(link)
      })
    }

    // 延迟加载非关键资源
    const lazyLoadResources = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement | HTMLIFrameElement
            if (target.dataset.src) {
              target.src = target.dataset.src
              observer.unobserve(target)
            }
          }
        })
      })

      document.querySelectorAll('[data-src]').forEach((el) => observer.observe(el))
    }

    // 优化字体加载
    const optimizeFonts = () => {
      if ('fonts' in document) {
        Promise.all([
          (document as any).fonts.load('1em Inter'),
          (document as any).fonts.load('1em Playfair Display')
        ]).then(() => {
          document.documentElement.classList.add('fonts-loaded')
        })
      }
    }

    preloadResources()
    lazyLoadResources()
    optimizeFonts()

    // 清理函数
    return () => {
      document.querySelectorAll('link[rel="preload"], link[rel="dns-prefetch"]')
        .forEach(el => el.remove())
    }
  }, [pathname])

  return null
} 