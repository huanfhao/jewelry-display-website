'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function PerformanceMonitor() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 监控页面加载性能
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // 记录关键指标
          console.log(`[Performance] ${entry.name}: ${entry.startTime}`)
          
          // 发送到分析服务
          fetch('/api/vitals', {
            method: 'POST',
            body: JSON.stringify({
              name: entry.name,
              value: entry.startTime,
              path: pathname
            })
          }).catch(console.error)
        })
      })

      // 观察关键指标
      observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      })

      return () => observer.disconnect()
    }
  }, [pathname])

  return null
} 