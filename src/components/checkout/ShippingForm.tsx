'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface ShippingInfo {
  name: string
  phone: string
  email: string
  address: string
  note: string
}

interface ShippingFormProps {
  shippingInfo: ShippingInfo
  onChange: (info: ShippingInfo) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export default function ShippingForm({
  shippingInfo,
  onChange,
  onSubmit,
  isSubmitting,
}: ShippingFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="space-y-6">
        {/* 姓名和电话 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={shippingInfo.name}
              onChange={(e) => onChange({ ...shippingInfo, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
              <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={shippingInfo.phone}
              onChange={(e) => onChange({ ...shippingInfo, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>

        {/* 邮箱 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
            <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={shippingInfo.email}
            onChange={(e) => onChange({ ...shippingInfo, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
            placeholder="Enter your email address"
            required
          />
        </div>

        {/* 地址 */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Address
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            value={shippingInfo.address}
            onChange={(e) => onChange({ ...shippingInfo, address: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
            placeholder="Enter your shipping address"
            rows={3}
            required
          />
        </div>

        {/* 备注 */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Order Notes (Optional)
          </label>
          <textarea
            id="note"
            value={shippingInfo.note}
            onChange={(e) => onChange({ ...shippingInfo, note: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
            placeholder="Any special instructions for your order?"
            rows={3}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-900 disabled:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      >
        <span>Continue to Payment</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.form>
  )
} 