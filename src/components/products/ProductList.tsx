'use client'

import { useRouter } from 'next/navigation'
import type { Product } from '@prisma/client'
import ProductGrid from './ProductGrid'

interface ProductListProps {
  products: (Product & {
    _count: {
      inquiries: number
    }
  })[]
}

export default function ProductList({ products }: ProductListProps) {
  const router = useRouter()

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`)
  }

  const formattedProducts = products.map(product => ({
    title: product.name,
    image: product.images[0] || '/images/hero.jpg',
    description: product.description || 'No description available',
    slug: product.slug,
    category: {
      name: product.category || 'Uncategorized'
    },
    price: product.price,
    _count: {
      inquiries: product._count.inquiries
    }
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <ProductGrid 
        products={formattedProducts}
        onProductClick={handleProductClick}
      />
    </div>
  )
} 