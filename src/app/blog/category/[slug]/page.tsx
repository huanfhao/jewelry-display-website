import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogList from '@/components/blog/BlogList'

interface Props {
  params: { slug: string }
}

interface Category {
  id: string
  name: string
  slug: string
  posts: Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    publishedAt: Date | null
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [category] = await prisma.$queryRaw<Category[]>`
    SELECT * FROM categories WHERE slug = ${params.slug} LIMIT 1
  `;

  if (!category) return {}

  return {
    title: `${category.name} | Blog Categories`,
    description: `Articles in category: ${category.name}`
  }
}

export default async function CategoryPage({ params }: Props) {
  const [category] = await prisma.$queryRaw<Category[]>`
    SELECT 
      c.*,
      array_agg(
        DISTINCT jsonb_build_object(
          'id', p.id,
          'title', p.title,
          'slug', p.slug,
          'excerpt', p.excerpt,
          'coverImage', p."coverImage",
          'publishedAt', p."publishedAt"
        )
      ) FILTER (WHERE p.id IS NOT NULL) as posts
    FROM categories c
    LEFT JOIN "_BlogPostToCategory" pc ON c.id = pc."B"
    LEFT JOIN blog_posts p ON p.id = pc."A" AND p.published = true
    WHERE c.slug = ${params.slug}
    GROUP BY c.id
  `;

  if (!category) notFound()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-playfair mb-4 text-center">
          Category: {category.name}
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Browse articles in {category.name}
        </p>
        <BlogList posts={category.posts.filter(Boolean)} />
      </div>
    </div>
  )
} 