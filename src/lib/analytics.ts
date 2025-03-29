import { UserPreferences } from '@/types/user'

type TrackingEvent = {
  type: 'page_view' | 'product_view' | 'search' | 'preference_change'
  data: Record<string, any>
  preferences: UserPreferences
}

export function trackEvent(event: TrackingEvent) {
  try {
    // 发送到分析服务
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log(metric) // 开发环境下查看性能指标
    
    // 发送到分析服务
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
    })
    
    navigator.sendBeacon('/api/vitals', body)
  }
} 