'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  maxQuantity: number
  isUpdating?: boolean
  onUpdateQuantity: (quantity: number) => Promise<void>
  onRemove: () => Promise<void>
}

export default function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  maxQuantity,
  isUpdating = false,
  onUpdateQuantity,
  onRemove
}: CartItemProps) {
  const [inputValue, setInputValue] = React.useState(quantity.toString())

  React.useEffect(() => {
    setInputValue(quantity.toString())
  }, [quantity])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setInputValue('')
      return
    }
    
    const number = parseInt(value)
    if (isNaN(number)) return
    setInputValue(number.toString())
  }

  const handleInputBlur = () => {
    const number = parseInt(inputValue)
    if (isNaN(number) || number < 1) {
      setInputValue(quantity.toString())
      return
    }
    if (number > maxQuantity) {
      setInputValue(maxQuantity.toString())
      onUpdateQuantity(maxQuantity)
      return
    }
    onUpdateQuantity(number)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex items-center gap-6 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all",
        isUpdating && "opacity-50"
      )}
    >
      {/* 商品图片 */}
      <Link href={`/products/${id}`} className="shrink-0">
        <div className="relative w-32 h-32 overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* 商品信息 */}
      <div className="flex-grow min-w-0">
        <Link href={`/products/${id}`}>
          <h3 className="text-xl font-medium truncate hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-lg font-medium text-primary mt-2">${price.toLocaleString()}</p>
      </div>

      {/* 数量控制 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(quantity - 1)}
          disabled={isUpdating || quantity <= 1}
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-gray-50 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={isUpdating}
          className="w-16 text-center"
        />
        <button
          onClick={() => onUpdateQuantity(quantity + 1)}
          disabled={isUpdating || quantity >= maxQuantity}
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 小计 */}
      <div className="w-32 text-right">
        <p className="text-lg font-medium">${(price * quantity).toLocaleString()}</p>
      </div>

      {/* 删除按钮 */}
      <button
        onClick={onRemove}
        disabled={isUpdating}
        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
    </motion.div>
  )
} 