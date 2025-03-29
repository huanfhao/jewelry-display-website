'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import ProductGrid from '@/components/products/ProductGrid'
import CouponModal from '@/components/common/CouponModal'

const STORE_URL = 'https://store.flylinking.com/s/2UPEH35FWO'

// 检查是否在客户端
const isClient = typeof window !== 'undefined'

// 安全的获取 sessionStorage
const getFromStorage = (key: string) => {
  if (!isClient) return null
  try {
    return sessionStorage.getItem(key)
  } catch (error) {
    console.error('Error accessing sessionStorage:', error)
    return null
  }
}

// 安全的设置 sessionStorage
const setToStorage = (key: string, value: string) => {
  if (!isClient) return
  try {
    sessionStorage.setItem(key, value)
  } catch (error) {
    console.error('Error setting sessionStorage:', error)
  }
}

// 产品数据
const featuredProducts = [
  {
    title: 'Acrylic Ring Display',
    image: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/1740642402764_f0ae2f70ff77720b457a4e8e54858901.webp',
    description: 'Clear acrylic ring display stand, perfect for jewelry store showcase.',
    slug: 'acrylic-ring-display'
  },
  {
    title: 'Jewelry Display Stand',
    image: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/1734597652416_1ad066513b2f086707069692b389307d.webp',
    description: 'Professional jewelry display stand with multiple layers.',
    slug: 'jewelry-display-stand'
  },
  {
    title: 'Necklace Display',
    image: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/1734921287054_23193664127817d7fc2a2c7df6f17760.webp',
    description: 'Elegant necklace display stand for retail and home use.',
    slug: 'necklace-display'
  },
  {
    title: 'Watch Display',
    image: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/1734937589496_8bf6ebae8c0b343cfe34484bb9e27563.webp',
    description: 'Premium watch display stand with modern design.',
    slug: 'watch-display'
  }
]

export function ClientPage() {
  const [showCoupon, setShowCoupon] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  useEffect(() => {
    if (!isClient) return
    const hasSeenCoupon = getFromStorage('hasSeenCoupon')
    if (hasSeenCoupon) {
      setIsFirstVisit(false)
      return
    }

    const timer = setTimeout(() => {
      setShowCoupon(true)
      setToStorage('hasSeenCoupon', 'true')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleRedirect = () => {
    if (!isClient) return
    window.location.href = STORE_URL
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Hero />
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-playfair mb-4">Featured Products</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Professional jewelry display manufacturer in Guangzhou. We offer high-quality jewelry displays, custom design services, and wholesale solutions.
              </p>
            </div>
            <ProductGrid products={featuredProducts} onProductClick={handleRedirect} />
            <div className="text-center mt-12">
              <button 
                onClick={handleRedirect}
                className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300"
              >
                Browse All Products
              </button>
            </div>
          </div>
        </section>
        {isFirstVisit && showCoupon && (
          <CouponModal
            onClose={() => setShowCoupon(false)}
            onRedirect={handleRedirect}
          />
        )}
      </div>
    </Suspense>
  )
} 