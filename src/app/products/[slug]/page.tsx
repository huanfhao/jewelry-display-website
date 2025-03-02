'use client'

import { useEffect } from 'react'
import { useUserPreferences } from '@/hooks/useUserPreferences'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { trackProductView, preferences } = useUserPreferences()

  useEffect(() => {
    // 记录产品访问
    trackProductView(params.slug)
  }, [params.slug])

  // 使用用户偏好来个性化页面
  const recentlyViewed = preferences.viewedProducts || []
  const userTheme = preferences.theme || 'light'
  
  return (
    <div>
      {/* 产品详情 */}
      
      {/* 最近浏览 */}
      {recentlyViewed.length > 0 && (
        <div>
          <h3>Recently Viewed</h3>
          <ul>
            {recentlyViewed.map(productId => (
              <li key={productId}>{productId}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 