'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import UserOverview from '@/components/account/UserOverview'
import RecentOrders from '@/components/account/RecentOrders'
import AddressList from '@/components/account/AddressList'

interface User {
  id: string
  name: string
  email: string
  createdAt: string
  image?: string
}

interface Order {
  id: string
  createdAt: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: {
    id: string
    name: string
    image: string
    quantity: number
    price: number
  }[]
}

interface Address {
  id: string
  name: string
  phone: string
  address: string
  isDefault: boolean
}

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])

  useEffect(() => {
    fetchUserData()
  }, [])

  async function fetchUserData() {
    try {
      // 获取用户信息
      const userResponse = await fetch('/api/user')
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data')
      }
      const userData = await userResponse.json()
      setUser(userData)

      // 获取最近订单
      const ordersResponse = await fetch('/api/orders?limit=5')
      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch orders')
      }
      const ordersData = await ordersResponse.json()
      setOrders(ordersData)

      // 获取收货地址
      const addressesResponse = await fetch('/api/addresses')
      if (!addressesResponse.ok) {
        throw new Error('Failed to fetch addresses')
      }
      const addressesData = await addressesResponse.json()
      setAddresses(addressesData)
    } catch (error) {
      setError('Failed to load account data')
      console.error('Error fetching account data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = () => {
    router.push('/account/addresses/new')
  }

  const handleEditAddress = (address: Address) => {
    router.push(`/account/addresses/${address.id}/edit`)
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete address')
      }

      setAddresses((prev) => prev.filter((address) => address.id !== id))
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('Failed to delete address')
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const response = await fetch(`/api/addresses/${id}/default`, {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error('Failed to set default address')
      }

      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          isDefault: address.id === id,
        }))
      )
    } catch (error) {
      console.error('Error setting default address:', error)
      alert('Failed to set default address')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'User not found'}</p>
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Personal Information</h1>
      
      <div className="space-y-8">
        {/* 用户信息概览 */}
        <UserOverview user={user} />

        {/* 最近订单 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <RecentOrders orders={orders} />
        </div>

        {/* 收货地址 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Addresses</h2>
          <AddressList
            addresses={addresses}
            onAdd={handleAddAddress}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            onSetDefault={handleSetDefaultAddress}
          />
        </div>
      </div>
    </div>
  )
} 