'use client';

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@prisma/client'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ProductFilterProps {
  categories: Category[]
  selectedCategory?: string
  searchQuery?: string
}

export default function ProductFilter({ categories, selectedCategory, searchQuery }: ProductFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    params.delete('page') // 重置页码
    router.push(`/products?${params.toString()}`)
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const search = formData.get('search') as string
    
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    params.delete('page') // 重置页码
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Card className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Search Products</h3>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search products..."
              className="pl-10"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          </div>
          <Button type="submit" className="w-full">
            Search
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            onClick={() => handleCategoryChange('all')}
            className="w-full justify-start"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.id)}
              className="w-full justify-start"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}