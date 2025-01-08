'use client';

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Product } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface ExtendedProduct extends Product {
  category: {
    id: string;
    name: string;
  };
}

interface ProductGridProps {
  products: ExtendedProduct[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleAddToCart = async (e: React.MouseEvent, product: ExtendedProduct) => {
    e.preventDefault() // 阻止链接跳转
    
    if (!session) {
      toast.error('Please sign in to add items to cart')
      router.push('/login')
      return
    }

    if (loadingStates[product.id]) return

    setLoadingStates(prev => ({ ...prev, [product.id]: true }))
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      toast.success('Added to cart')
      router.refresh() // 刷新页面以更新购物车数量
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart')
    } finally {
      setLoadingStates(prev => ({ ...prev, [product.id]: false }))
    }
  }

  const handleAddToWishlist = async (e: React.MouseEvent, product: ExtendedProduct) => {
    e.preventDefault() // 阻止链接跳转
    if (!session) {
      toast.error('Please sign in to add items to wishlist')
      router.push('/login')
      return
    }
    // TODO: 实现添加到愿望清单的功能
    toast.success('Added to wishlist')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <Link 
          key={product.id} 
          href={`/products/${product.id}`}
          className="group"
        >
          <Card className="overflow-hidden h-full transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative aspect-square">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority={index < 6}
                loading={index < 6 ? 'eager' : 'lazy'}
                quality={85}
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYxMC8vMTQ3PEFGODlLPTQ5RWFJTlNhWVdbZ2JnP0BXcWNcWVr/2wBDARUXFyAeIBogHh4gIiAqJSUlKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                placeholder="blur"
              />
              <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleAddToWishlist(e, product)}
                  className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={loadingStates[product.id]}
                  className="w-8 h-8 rounded-full bg-black text-white shadow-md flex items-center justify-center hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-2">
                <span className="text-sm text-gray-500">{product.category.name}</span>
                <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-primary">
                  {formatPrice(product.price)}
                </span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
} 