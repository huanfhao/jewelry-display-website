import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import ProductGrid from '@/components/products/ProductGrid'
import Link from 'next/link'
import { Metadata } from 'next'
import { ClientPage } from '@/components/home/ClientPage'

const STORE_URL = 'https://store.flylinking.com/s/2UPEH35FWO'

// 检查是否在客户端
const isClient = typeof window !== 'undefined'

// 安全的获取 sessionStorage
const getFromStorage = (key: string) => {
  if (!isClient) return null
  try {
    return sessionStorage.getItem(key)
  } catch (error) {
    console.error('Error accessing sessionStorage:', error)
    return null
  }
}

// 安全的设置 sessionStorage
const setToStorage = (key: string, value: string) => {
  if (!isClient) return
  try {
    sessionStorage.setItem(key, value)
  } catch (error) {
    console.error('Error setting sessionStorage:', error)
  }
}

// 产品数据
const featuredProducts = [
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

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to SY Jewelry Display - Your trusted partner for professional jewelry display solutions.',
  openGraph: {
    title: 'SY Jewelry Display - Home',
    description: 'Welcome to SY Jewelry Display - Your trusted partner for professional jewelry display solutions.'
  }
}

export default function HomePage() {
  return <ClientPage />
}
