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