'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface ProductInfoProps {
  name: string
  description: string
  price: number
  stock: number
  category: string
  onAddToCart: (quantity: number) => Promise<void>
}

export default function ProductInfo({
  name,
  description,
  price,
  stock,
  category,
  onAddToCart
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta
      if (newQuantity < 1) return 1
      if (newQuantity > stock) return stock
      return newQuantity
    })
  }

  const handleAddToCart = async () => {
    if (isAdding) return
    setIsAdding(true)
    try {
      await onAddToCart(quantity)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-sm uppercase tracking-wider text-gray-500">{category}</span>
        <h1 className="text-3xl font-light mb-4">{name}</h1>
        <p className="text-gray-600 mb-8">{description}</p>
        <p className="text-2xl mb-8">{formatPrice(price)}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-black disabled:border-gray-100 disabled:text-gray-300 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-lg w-12 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= stock}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-black disabled:border-gray-100 disabled:text-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">
            {stock} pieces available
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding || stock === 0}
          className="w-full bg-black text-white py-4 px-8 rounded-full hover:bg-gray-900 disabled:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>
            {isAdding
              ? 'Adding...'
              : stock === 0
              ? 'Out of Stock'
              : 'Add to Cart'}
          </span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="border-t border-gray-100 pt-8"
      >
        <h3 className="text-sm uppercase tracking-wider mb-4">Product Details</h3>
        <ul className="space-y-4 text-gray-600">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-gray-200 rounded-full" />
            <span>Free shipping on orders over $10,000</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-gray-200 rounded-full" />
            <span>30-day return policy</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-gray-200 rounded-full" />
            <span>Certificate of authenticity included</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-gray-200 rounded-full" />
            <span>Gift wrapping available</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
} 