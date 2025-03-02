import type { WebVitalsMetric } from '@/types'

export function reportWebVitals(metric: WebVitalsMetric) {
  // Core Web Vitals
  if (metric.name === 'FCP') {
    console.log('FCP:', metric.value)
  }
  if (metric.name === 'LCP') {
    console.log('LCP:', metric.value)
  }
  if (metric.name === 'CLS') {
    console.log('CLS:', metric.value)
  }
  if (metric.name === 'FID') {
    console.log('FID:', metric.value)
  }
  if (metric.name === 'TTFB') {
    console.log('TTFB:', metric.value)
  }

  try {
    // 发送到分析服务
    const body = JSON.stringify(metric)
    const url = '/api/vitals'

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body)
    } else {
      fetch(url, { body, method: 'POST', keepalive: true })
    }
  } catch (error) {
    console.error('Error reporting web vitals:', error)
  }
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