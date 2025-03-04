import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlogList from '@/components/blog/BlogList'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | null
}

export const metadata: Metadata = {
  title: 'Blog | SY Jewelry Display',
  description: 'Latest news and updates from SY Jewelry Display'
}

export default async function BlogPage() {
  const posts = await prisma.$queryRaw<BlogPost[]>`
    SELECT id, title, slug, excerpt, "coverImage", "publishedAt"
    FROM blog_posts
    WHERE published = true
    ORDER BY "publishedAt" DESC
  `;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-playfair mb-8 text-center">Our Blog</h1>
        <p className="text-gray-600 text-center mb-12">
          Latest news, updates and insights about jewelry displays
        </p>
        <BlogList posts={posts} />
      </div>
    </div>
  )
} 