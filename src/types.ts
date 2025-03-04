export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: Date
}

export interface CookieData {
  name: string
  value: string
  domain: string
  path: string
  expires: number
  size: number
  httpOnly: boolean
  secure: boolean
  session: boolean
  sameSite: string
  priority: string
}

export interface Product {
  id: string
  title: string
  description: string
  image: string
  price?: number
  slug: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

export interface WebVitalsMetric {
  id: string
  name: string
  value: number
  label?: string
  page?: string
  createdAt: Date
}

export interface ProductOffer {
  '@type': 'Offer'
  price: number
  priceCurrency: string
  availability: string
}

export interface ProductBrand {
  '@type': 'Brand'
  name: string
} 