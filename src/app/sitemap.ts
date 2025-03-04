import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 返回静态路由
  const routes = [
    {
      url: 'https://www.syjewelrydisplay.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: 'https://www.syjewelrydisplay.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: 'https://www.syjewelrydisplay.com/products',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: 'https://www.syjewelrydisplay.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    }
  ]

  return routes
} 