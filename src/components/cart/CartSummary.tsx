'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface CartSummaryProps {
  subtotal: number
  shipping: number
  total: number
  onCheckout: () => void
  disabled?: boolean
}

export default function CartSummary({
  subtotal,
  shipping,
  total,
  onCheckout,
  disabled
}: CartSummaryProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const { data: session } = useSession()

  const handleCheckout = async () => {
    if (!session?.user?.email) {
      toast.error('Please sign in to checkout')
      return
    }

    if (isProcessing) return
    setIsProcessing(true)
    
    try {
      // 发送订单信息到用户邮箱
      const response = await fetch('/api/orders/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          orderDetails: {
            subtotal,
            shipping,
            total,
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send order details')
      }

      toast.success('Order details have been sent to your email')
      await onCheckout()
    } catch (error) {
      toast.error('Failed to process your order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 p-6 rounded-lg"
    >
      <h2 className="text-lg font-medium mb-4">订单摘要</h2>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>小计</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>运费</span>
          <span>{shipping === 0 ? '免运费' : formatPrice(shipping)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-gray-500">
            消费满{formatPrice(10000)}免运费
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 my-4" />

      <div className="flex justify-between font-medium mb-6">
        <span>总计</span>
        <span>{formatPrice(total)}</span>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={disabled || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : '去结算'}
      </Button>
    </motion.div>
  )
} 