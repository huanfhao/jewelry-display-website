'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 'jewelry-boxes',
    title: 'Jewelry Boxes',
    description: 'Premium Quality Collection',
    image: '/images/banner1.jpg',
    link: '/products?category=jewelry-boxes'
  },
  {
    id: 'jewelry-display-stands',
    title: 'Jewelry Display Stands',
    description: 'Professional Display Solutions',
    image: '/images/banner2.jpg',
    link: '/products?category=jewelry-display-stands'
  },
  {
    id: 'jewelry-display-props',
    title: 'Jewelry Display Props',
    description: 'Creative Display Elements',
    image: '/images/banner3.jpg',
    link: '/products?category=jewelry-display-props'
  },
  {
    id: 'jewelry-display-trays',
    title: 'Jewelry Display Trays',
    description: 'Organized Display Solutions',
    image: '/images/banner4.jpg',
    link: '/products?category=jewelry-display-trays'
  }
]

export default function CategoriesContent() {
  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <h1 className="text-4xl font-light mb-8">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.link}
            className="group relative overflow-hidden rounded-lg aspect-square"
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
              <h2 className="text-2xl font-medium mb-2">{category.title}</h2>
              <p className="text-sm opacity-90">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 