'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface OrderSummaryProps {
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
}

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
}: OrderSummaryProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="bg-gray-50 p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">Order Summary</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden flex items-center gap-2 text-sm text-gray-500"
        >
          {isExpanded ? (
            <>
              Hide details
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show details
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        className="lg:h-auto overflow-hidden"
      >
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-primary">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="space-y-4 text-sm border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>

        {subtotal < 10000 && (
          <div className="text-sm text-gray-600">
            Add {formatPrice(10000 - subtotal)} more to get free shipping
          </div>
        )}

        <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <span>Free returns within 30 days</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <span>International shipping available</span>
        </div>
      </div>
    </div>
  )
} 