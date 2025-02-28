'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useDebounce } from '@/hooks/useDebounce'

export default function CartCount() {
  const { data: session } = useSession()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/cart/count')
      const data = await res.json()
      setCount(data.count)
    } catch (error) {
      console.error('Error fetching cart count:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchCount()
      
      // 设置轮询间隔为 5 分钟
      const interval = setInterval(fetchCount, 5 * 60 * 1000)
      
      return () => clearInterval(interval)
    } else {
      setCount(0)
      setLoading(false)
    }
  }, [session])

  if (loading) return null

  return count > 0 ? (
    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center">
      {count}
    </span>
  ) : null
} 