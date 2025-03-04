import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogList from '@/components/blog/BlogList'

interface Props {
  params: { slug: string }
}

interface Tag {
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
  const [tag] = await prisma.$queryRaw<Tag[]>`
    SELECT * FROM tags WHERE slug = ${params.slug} LIMIT 1
  `;

  if (!tag) return {}

  return {
    title: `#${tag.name} | Blog Tags`,
    description: `Articles tagged with #${tag.name}`
  }
}

export default async function TagPage({ params }: Props) {
  const [tag] = await prisma.$queryRaw<Tag[]>`
    SELECT 
      t.*,
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
    FROM tags t
    LEFT JOIN "_BlogPostToTag" pt ON t.id = pt."B"
    LEFT JOIN blog_posts p ON p.id = pt."A" AND p.published = true
    WHERE t.slug = ${params.slug}
    GROUP BY t.id
  `;

  if (!tag) notFound()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-playfair mb-4 text-center">
          #{tag.name}
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Browse articles tagged with #{tag.name}
        </p>
        <BlogList posts={tag.posts.filter(Boolean)} />
      </div>
    </div>
  )
} 