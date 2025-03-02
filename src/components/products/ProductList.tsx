'use client'

import { useState } from 'react'
import ProductGrid from './ProductGrid'

const STORE_URL = 'https://store.flylinking.com/s/2UPEH35FWO'

const products = [
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

export default function ProductList() {
  const handleRedirect = () => {
    window.location.href = STORE_URL
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-playfair text-center mb-12">Our Products</h1>
      <ProductGrid products={products} onProductClick={handleRedirect} />
    </div>
  )
} 