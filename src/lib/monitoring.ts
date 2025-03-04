import { WebVitalsMetric } from '@/types'
import { prisma } from './prisma'

// 性能指标收集
export function reportWebVitals(metric: WebVitalsMetric) {
  // 将性能指标保存到数据库
  prisma.performanceMetric.create({
    data: {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      label: metric.label,
      page: metric.page
    }
  }).catch(console.error)

  // 如果性能指标超过阈值，发送告警
  if (
    (metric.name === 'FCP' && metric.value > 2000) || // First Contentful Paint
    (metric.name === 'LCP' && metric.value > 2500) || // Largest Contentful Paint
    (metric.name === 'FID' && metric.value > 100) ||  // First Input Delay
    (metric.name === 'CLS' && metric.value > 0.1)     // Cumulative Layout Shift
  ) {
    console.warn(`Performance degradation detected: ${metric.name} = ${metric.value}`)
  }
}

// 图片优化
export function getOptimizedImageUrl(url: string, width?: number, quality = 75) {
  if (!url) return ''
  
  // 如果是外部图片，使用 next/image 优化
  if (url.startsWith('http')) {
    return url
  }

  // 本地图片优化
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  params.set('q', quality.toString())
  params.set('auto', 'format')

  return `${url}?${params.toString()}`
}

// 资源预加载
export function preloadResources() {
  // 预加载关键 CSS
  const linkEl = document.createElement('link')
  linkEl.rel = 'preload'
  linkEl.as = 'style'
  linkEl.href = '/styles/critical.css'
  document.head.appendChild(linkEl)

  // 预加载字体
  const fontEl = document.createElement('link')
  fontEl.rel = 'preload'
  fontEl.as = 'font'
  fontEl.type = 'font/woff2'
  fontEl.href = '/fonts/playfair-display.woff2'
  fontEl.crossOrigin = 'anonymous'
  document.head.appendChild(fontEl)
}

export function reportError(error: Error, componentStack?: string | null) {
  console.error('Error:', error)
  console.error('Component Stack:', componentStack || 'No stack trace available')

  // 发送错误到监控服务
  fetch('/api/error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      componentStack: componentStack || undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    }),
  }).catch(console.error)
} 