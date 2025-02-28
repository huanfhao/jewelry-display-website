'use client'

import { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
})

export default function LoadingIndicator() {
  useEffect(() => {
    return () => {
      NProgress.done()
    }
  }, [])

  return null
} 