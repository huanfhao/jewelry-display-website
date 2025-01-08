'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
  onAddToCart: () => void
  onAddToWishlist: () => void
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  isNew,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative bg-white rounded-lg overflow-hidden hover-card"
    >
      {/* 图片容器 */}
      <Link href={`/products/${id}`} className="block relative aspect-square">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {isNew && (
          <div className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 rounded-full">
            New
          </div>
        )}
      </Link>

      {/* 快速操作按钮 */}
      <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onAddToWishlist}
          className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Heart className="w-4 h-4" />
        </button>
        <button
          onClick={onAddToCart}
          className="w-8 h-8 rounded-full bg-black text-white shadow-md flex items-center justify-center hover:bg-gray-900 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* 产品信息 */}
      <div className="p-4">
        <Link href={`/products/${id}`} className="block">
          <h3 className="font-medium line-clamp-2 group-hover:text-gray-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{category}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-medium">{formatPrice(price)}</p>
            <div className="text-sm text-gray-500">
              {/* 这里可以添加评分或其他信息 */}
            </div>
          </div>
        </Link>

        {/* 添加到购物车按钮（移动端） */}
        <button
          onClick={onAddToCart}
          className="w-full mt-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition-colors md:hidden"
        >
          Add to Cart
        </button>
      </div>

      {/* 桌面端悬停时显示的添加到购物车按钮 */}
      <div className="absolute inset-x-4 bottom-4 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onAddToCart}
          className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-900 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
} 