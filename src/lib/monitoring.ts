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