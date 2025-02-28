'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EmptyCart() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-6 flex justify-center">
          <ShoppingBag className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-light mb-4">购物车是空的</h2>
        <p className="text-gray-500 mb-8">
          快去挑选心仪的商品吧
        </p>
        <Button
          onClick={() => router.push('/')}
          className="min-w-[200px]"
        >
          继续购物
        </Button>
      </motion.div>
    </div>
  )
} 