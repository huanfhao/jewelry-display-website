'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ProductHeaderProps {
  totalProducts: number
  selectedCategory?: string
  searchQuery?: string
}

export default function ProductHeader({ totalProducts, selectedCategory, searchQuery }: ProductHeaderProps) {
  const getTitle = () => {
    if (searchQuery) {
      return `搜索结果: "${searchQuery}"`
    }
    if (selectedCategory) {
      return selectedCategory
    }
    return '所有珠宝系列'
  }

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-sm uppercase tracking-widest text-gray-500">Collection</span>
          <h1 className="text-4xl font-light mt-4 mb-2">{getTitle()}</h1>
          <p className="text-gray-600">
            {totalProducts} {totalProducts === 1 ? 'piece' : 'pieces'}
          </p>
        </motion.div>
      </div>
    </div>
  )
} 