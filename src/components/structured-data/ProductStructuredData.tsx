import { Product, ProductOffer, ProductBrand } from '@/types'

interface ProductStructuredDataProps {
  product: Product
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const brand: ProductBrand = {
    '@type': 'Brand',
    name: 'SY Jewelry Display'
  }

  const offer: ProductOffer = {
    '@type': 'Offer',
    price: product.price || 0,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    sku: product.id,
    brand,
    offers: offer
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
} 