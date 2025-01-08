import React from 'react'
import { Metadata } from 'next'
import { Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wishlist - SY Jewelry',
  description: 'View your favorite jewelry items',
}

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <h1 className="text-4xl font-light mb-8">Wishlist</h1>
      
      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-light text-gray-600 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mb-8">
          Browse our collections and add items you love
        </p>
        <a
          href="/products"
          className="inline-flex items-center justify-center h-10 px-6 font-medium text-white transition-colors bg-black rounded-full hover:bg-gray-900"
        >
          Browse Collections
        </a>
      </div>
    </div>
  )
} 