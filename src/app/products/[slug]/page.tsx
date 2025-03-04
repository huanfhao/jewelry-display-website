import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductSchema from '@/components/products/ProductSchema'
import { prisma } from '@/lib/prisma'

interface Props {
  params: { slug: string }
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug }
    })
    
    if (!product) return null

    return {
      name: product.title,
      description: product.description,
      image: product.image,
      price: product.price?.toString() || undefined,
      category: product.category
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return {}

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }]
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  return (
    <>
      <ProductSchema product={product} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full rounded-lg mb-6"
          />
          <p className="text-gray-600 mb-4">{product.description}</p>
          {product.price && (
            <p className="text-xl font-semibold mb-4">Price: {product.price}</p>
          )}
          {product.category && (
            <p className="text-sm text-gray-500">Category: {product.category}</p>
          )}
        </div>
      </div>
    </>
  )
} 