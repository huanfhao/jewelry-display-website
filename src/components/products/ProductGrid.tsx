'use client'

import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

interface Product {
  title: string
  image: string
  description: string
  slug: string
}

interface ProductGridProps {
  products: {
    title: string
    image: string
    description: string
    slug: string
  }[]
  onProductClick: () => void
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProductCard {...product} onClick={onProductClick} />
        </motion.div>
      ))}
    </div>
  )
} 