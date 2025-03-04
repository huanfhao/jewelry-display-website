import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import CommentSection from '@/components/blog/CommentSection'

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  published: boolean
  publishedAt: Date | null
  categories: Category[]
  tags: Tag[]
  comments: { id: string; author: string; content: string; createdAt: Date }[]
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [post] = await prisma.$queryRaw<BlogPost[]>`
    SELECT * FROM blog_posts WHERE slug = ${params.slug} LIMIT 1
  `;

  if (!post) return {};

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : []
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const [post] = await prisma.$queryRaw<BlogPost[]>`
    WITH post_data AS (
      SELECT 
        p.*,
        array_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) as categories,
        array_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)) as tags
      FROM blog_posts p
      LEFT JOIN "_BlogPostToCategory" pc ON p.id = pc."A"
      LEFT JOIN categories c ON c.id = pc."B"
      LEFT JOIN "_BlogPostToTag" pt ON p.id = pt."A"
      LEFT JOIN tags t ON t.id = pt."B"
      WHERE p.slug = ${params.slug}
      GROUP BY p.id
    ),
    comments_data AS (
      SELECT 
        "postId",
        json_agg(
          json_build_object(
            'id', id,
            'author', author,
            'content', content,
            'createdAt', "createdAt"
          ) ORDER BY "createdAt" DESC
        ) as comments
      FROM comments
      GROUP BY "postId"
    )
    SELECT 
      p.*,
      COALESCE(c.comments, '[]'::json) as comments
    FROM post_data p
    LEFT JOIN comments_data c ON c."postId" = p.id
  `;

  if (!post) notFound();

  return (
    <article className="min-h-screen bg-gray-50">
      <div className="w-full h-[40vh] relative bg-gray-900">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-playfair text-white text-center max-w-4xl mx-auto">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-8 text-gray-500 text-sm">
            <time dateTime={post.publishedAt?.toString()}>
              {formatDate(post.publishedAt)}
            </time>
            <Link href="/blog" className="hover:text-primary transition-colors">
              ← Back to Blog
            </Link>
          </div>

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-4">
              {post.categories
                .filter(Boolean)
                .map(category => (
                  <Link 
                    key={category.id} 
                    href={`/blog/category/${category.slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags
                .filter(Boolean)
                .map(tag => (
                  <Link 
                    key={tag.id} 
                    href={`/blog/tag/${tag.slug}`}
                    className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
            </div>
          </div>

          <CommentSection 
            postId={post.id} 
            comments={post.comments || []} 
          />
        </div>
      </div>
    </article>
  )
} 