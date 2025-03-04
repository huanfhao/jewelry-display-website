interface ProductSchemaProps {
  product: {
    name: string
    description: string
    image: string
    price?: string
    sku?: string
  }
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "SY Jewelry Display"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "SY Jewelry Display",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Guangzhou",
        "addressCountry": "CN"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
} 