import { Metadata } from 'next'
import ProductList from '@/components/products/ProductList'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our wide selection of jewelry display products including ring stands, necklace holders, and custom solutions.',
  openGraph: {
    title: 'SY Jewelry Display - Products',
    description: 'Browse our wide selection of jewelry display products including ring stands, necklace holders, and custom solutions.'
  }
}

export default function ProductsPage() {
  return <ProductList />
} 