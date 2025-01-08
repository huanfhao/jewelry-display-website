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
  onCheckout: () => Promise<void>
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
      className="bg-white p-8 rounded-xl shadow-sm"
    >
      <h2 className="text-2xl font-semibold mb-8">Order Summary</h2>

      <div className="space-y-4 text-base">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>

        {subtotal < 10000 && (
          <div className="py-3 px-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
            Add {formatPrice(10000 - subtotal)} more to get free shipping
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * After clicking "Send Order", the order details will be sent to your email for manual processing.
          </p>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={disabled || isProcessing}
        className="w-full mt-8"
        size="lg"
      >
        {isProcessing ? 'Processing...' : 'Send Order'}
      </Button>
    </motion.div>
  )
} 