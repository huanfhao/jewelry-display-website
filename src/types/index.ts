import type { Comment } from '@prisma/client'
import type { Product as PrismaProduct } from '@prisma/client'
import type { Prisma } from '@prisma/client'

export interface CommentWithPost extends Omit<Comment, 'post'> {
  post: {
    title: string
  }
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AdminAccess {
  isAuthenticated: boolean
  error?: string
}

export interface WebVitalsMetric {
  id: string
  name: string
  value: number
  label?: string
  page?: string
}

export interface PerformanceMetric {
  id: string
  name: string
  value: number
  label?: string
  page?: string
  createdAt: Date
}

export type Product = Prisma.ProductGetPayload<{
  include: {
    _count: {
      select: {
        inquiries: true
      }
    }
  }
}>

export interface CookieData {
  name: string
  value: string
  domain: string
  expires: string
  category: string
}

export interface SerializedContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
  updatedAt: string
}

export interface SerializedCommentWithPost extends Omit<Comment, 'post' | 'createdAt' | 'updatedAt'> {
  post: {
    title: string
  }
  createdAt: string
  updatedAt: string
}

export interface SerializedPerformanceMetric {
  id: string
  name: string
  value: number
  label?: string
  page?: string
  createdAt: string
}

