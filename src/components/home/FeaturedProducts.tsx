'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category: {
    name: string
  }
}

const DEFAULT_IMAGE = '/images/placeholder.jpg'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?limit=3')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        console.log('Featured products data:', data)
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleImageError = (productId: string, imageUrl: string) => {
    console.log(`Image error for product ${productId}, URL: ${imageUrl}`)
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  if (loading) {
    return (
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-sm uppercase tracking-widest">Featured Collection</span>
            <h2 className="text-3xl font-light mt-4">Curated with Love</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="relative aspect-[3/4] mb-6 bg-gray-200" />
                <div className="text-center space-y-3">
                  <div className="h-4 bg-gray-200 w-1/4 mx-auto" />
                  <div className="h-6 bg-gray-200 w-3/4 mx-auto" />
                  <div className="h-4 bg-gray-200 w-1/3 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm uppercase tracking-widest">Featured Collection</span>
          <h2 className="text-3xl font-light mt-4">Curated with Love</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product, index) => {
            const imageUrl = imageErrors[product.id] ? DEFAULT_IMAGE : (product.images[0] || DEFAULT_IMAGE)
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                      quality={85}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={() => handleImageError(product.id, imageUrl)}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-xs uppercase tracking-wider text-gray-500">{product.category.name}</span>
                    <h3 className="text-lg mt-2 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">${product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link
            href="/products"
            className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:border-gray-400 transition-colors"
          >
            View All Collections
          </Link>
        </motion.div>
      </div>
    </section>
  )
} 