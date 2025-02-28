'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import EmptyCart from '@/components/cart/EmptyCart'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

interface CartProduct {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (session?.user) {
      fetchCartItems()
    } else {
      setLoading(false)
    }
  }, [session])

  async function fetchCartItems() {
    try {
      const response = await fetch('/api/cart')
      if (!response.ok) {
        throw new Error('Failed to fetch cart items')
      }
      const data = await response.json()
      setCartItems(data)
    } catch (error) {
      setError('Failed to load cart items')
      console.error('Error fetching cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (pendingUpdates[productId]) return

    const originalItems = [...cartItems]
    
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )

    setPendingUpdates(prev => ({ ...prev, [productId]: true }))

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      })

      if (!response.ok) {
        setCartItems(originalItems)
        const error = await response.text()
        throw new Error(error)
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update quantity')
    } finally {
      setPendingUpdates(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleRemoveItem = async (productId: string) => {
    if (pendingUpdates[productId]) return

    const originalItems = [...cartItems]
    
    setCartItems((prev) => prev.filter((item) => item.id !== productId))

    setPendingUpdates(prev => ({ ...prev, [productId]: true }))

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        setCartItems(originalItems)
        const error = await response.text()
        throw new Error(error)
      }

      router.refresh()
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to remove item')
    } finally {
      setPendingUpdates(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleCheckout = async () => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      const response = await fetch('/api/orders/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderDetails: {
            subtotal,
            shipping,
            total,
          }
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast.success('Order details have been sent to your email')
      setCartItems([])
      router.refresh()
    } catch (error) {
      console.error('Error processing order:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process order')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">请先登录</h2>
        <Button onClick={() => router.push('/login')}>
          去登录
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return <EmptyCart />
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
            className="text-3xl font-light mb-12"
          >
            Shopping Cart
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 购物车列表 */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    image={item.image}
                    maxQuantity={item.stock}
                    onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
                    onRemove={() => handleRemoveItem(item.id)}
                    isUpdating={pendingUpdates[item.id]}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* 订单摘要 */}
            <div>
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                onCheckout={handleCheckout}
                disabled={isProcessing || Object.values(pendingUpdates).some(Boolean)}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-end gap-4">
            <div className="text-xl font-bold">
              总计：{formatPrice(total)}
            </div>
            <Button
              size="lg"
              onClick={() => router.push('/checkout')}
            >
              去结算
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 