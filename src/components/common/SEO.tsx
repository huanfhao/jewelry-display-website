import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  path: string
  image?: string
}

export function generateMetadata({ title, description, path, image }: SEOProps): Metadata {
  const url = `https://syjewelrydisplay.cn${path}`
  const imageUrl = image || '/images/og-image.jpg'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  }
} 