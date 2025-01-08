'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 'rings',
    title: 'Rings',
    description: 'Unique Design Collection',
    image: '/images/banner1.jpg',
    link: '/products?category=rings'
  },
  {
    id: 'necklaces',
    title: 'Necklaces',
    description: 'Elegant Collection',
    image: '/images/banner2.jpg',
    link: '/products?category=necklaces'
  },
  {
    id: 'earrings',
    title: 'Earrings',
    description: 'Stylish Collection',
    image: '/images/banner3.jpg',
    link: '/products?category=earrings'
  }
]

export default function CategoriesContent() {
  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <h1 className="text-4xl font-light mb-8">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={category.link}
            className="group relative h-80 overflow-hidden rounded-lg bg-gray-100"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
            <div className="relative w-full h-full">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={category.id === 'rings'}
                quality={90}
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYyLy8yMi8vLzI3Pj0zNzJFREVFRUVFRUVFRUVFRUVFRUVFRUX/2wBDAR0XFyQcJB4eJEQzLjNERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERET/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-white">
                <h2 className="text-2xl font-light mb-2">{category.title}</h2>
                <p className="text-sm opacity-80">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 