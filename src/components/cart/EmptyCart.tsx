'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center py-16 px-4"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
        <ShoppingBag className="w-8 h-8 text-gray-500" />
      </div>
      
      <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. 
        Start shopping to find beautiful pieces for your collection.
      </p>
      
      <Link
        href="/products"
        className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-900 transition-colors"
      >
        Browse Collections
      </Link>
    </motion.div>
  )
} 