import { Metadata } from 'next'
import ProductList from '@/components/products/ProductList'
import { Product } from '@/types'

const products: Product[] = [
  {
    id: '1',
    title: 'Acrylic Ring Display',
    image: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/1740642402764_f0ae2f70ff77720b457a4e8e54858901.webp',
    description: 'Clear acrylic ring display stand, perfect for jewelry store showcase.',
    slug: 'acrylic-ring-display',
    price: 29.99,
    category: 'Ring Displays',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Necklace Display Stand',
    image: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/1740642402764_f0ae2f70ff77720b457a4e8e54858901.webp',
    description: 'Elegant necklace display stand with multiple hooks.',
    slug: 'necklace-display-stand',
    price: 39.99,
    category: 'Necklace Displays',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
  // ... 其他产品
]

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our wide selection of jewelry display products including ring stands, necklace holders, and custom solutions.',
  openGraph: {
    title: 'SY Jewelry Display - Products',
    description: 'Browse our wide selection of jewelry display products including ring stands, necklace holders, and custom solutions.'
  }
}

export default function ProductsPage() {
  return <ProductList products={products} />
} 