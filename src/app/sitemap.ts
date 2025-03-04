import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

type SitemapEntry = {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 获取所有产品
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true }
  })

  // 获取所有博客文章
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  })

  // 静态页面
  const routes: SitemapEntry[] = [
    '',
    '/about',
    '/products',
    '/blog',
    '/contact'
  ].map((route) => ({
    url: `https://www.syjewelrydisplay.com${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1
  }))

  // 产品页面
  const productUrls: SitemapEntry[] = products.map((product) => ({
    url: `https://www.syjewelrydisplay.com/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8
  }))

  // 博客页面
  const postUrls: SitemapEntry[] = posts.map((post) => ({
    url: `https://www.syjewelrydisplay.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6
  }))

  return [...routes, ...productUrls, ...postUrls]
} 