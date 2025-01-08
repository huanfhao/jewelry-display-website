'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Package, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string
  createdAt: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: {
    id: string
    name: string
    image: string
    quantity: number
    price: number
  }[]
}

interface RecentOrdersProps {
  orders: Order[]
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
        <p className="text-gray-500 mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm divide-y divide-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Recent Orders</h3>
          <Link
            href="/account/orders"
            className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* 订单图片预览 */}
              <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="relative w-12 h-12 rounded-full border-2 border-white overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="relative w-12 h-12 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              {/* 订单信息 */}
              <div className="flex-grow">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Order #{order.id}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* 订单金额和操作 */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium">{formatPrice(order.total)}</div>
                  <div className="text-sm text-gray-500">{order.items.length} items</div>
                </div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
} 