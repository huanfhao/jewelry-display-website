'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import OrderSummary from '@/components/checkout/OrderSummary'
import ShippingForm from '@/components/checkout/ShippingForm'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

interface ShippingInfo {
  name: string
  phone: string
  email: string
  address: string
  note: string
}

const CHECKOUT_STEPS = [
  {
    title: 'Cart',
    description: 'Review items',
  },
  {
    title: 'Shipping',
    description: 'Add address',
  },
  {
    title: 'Payment',
    description: 'Select method',
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  })

  useEffect(() => {
    fetchCartItems()
  }, [])

  async function fetchCartItems() {
    try {
      const response = await fetch('/api/cart')
      if (!response.ok) {
        throw new Error('Failed to fetch cart items')
      }
      const data = await response.json()
      
      // Check if cart is empty
      if (data.length === 0) {
        router.replace('/cart')
        return
      }

      setCartItems(data)
    } catch (error) {
      setError('Failed to load cart items')
      console.error('Error fetching cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShippingSubmit = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingInfo.email)) {
      alert('Please enter a valid email address')
      return
    }

    // Validate phone format (简单验证)
    const phoneRegex = /^\d{10,11}$/
    if (!phoneRegex.test(shippingInfo.phone)) {
      alert('Please enter a valid phone number')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          shippingInfo,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()
      router.push(data.url)
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to proceed to checkout')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/cart')}
            className="text-sm uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            Return to Cart
          </button>
        </div>
      </div>
    )
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 10000 ? 0 : 1000
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-light text-center mb-12"
          >
            Checkout
          </motion.h1>

          <CheckoutSteps
            currentStep={currentStep}
            steps={CHECKOUT_STEPS}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 配送信息表单 */}
            <div>
              <ShippingForm
                shippingInfo={shippingInfo}
                onChange={setShippingInfo}
                onSubmit={handleShippingSubmit}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* 订单摘要 */}
            <div>
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 