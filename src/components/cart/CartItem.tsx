'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  maxQuantity: number
  isUpdating?: boolean
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
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
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow mb-4"
    >
      <div className="relative w-20 h-20">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded"
          sizes="80px"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-600">{formatPrice(price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={quantity <= 1 || isUpdating}
          onClick={() => onUpdateQuantity(quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          disabled={quantity >= maxQuantity || isUpdating}
          onClick={() => onUpdateQuantity(quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        disabled={isUpdating}
        onClick={onRemove}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  )
} 