'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'

const STORE_URL = 'https://store.flylinking.com/s/2UPEH35FWO'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const handleRedirect = () => {
    window.location.href = STORE_URL
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${product.price}</span>
                <Link 
                  href={`/products/${product.slug}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 