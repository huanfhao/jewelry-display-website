import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import BlogContent from '@/components/blog/BlogContent'
import TableOfContents from '@/components/blog/TableOfContents'
import ReadingProgress from '@/components/blog/ReadingProgress'

interface Props {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      categories: true,
      tags: true,
    },
  })

  if (!post) {
    notFound()
  }

  return post
}

async function getRelatedPosts(currentPostId: string, categoryIds: string[]) {
  return prisma.blogPost.findMany({
    where: {
      id: { not: currentPostId },
      categories: {
        some: {
          id: { in: categoryIds }
        }
      },
      published: true
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true
    },
    take: 3,
    orderBy: {
      publishedAt: 'desc'
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  const relatedPosts = await getRelatedPosts(post.id, post.categories.map(c => c.id))

  return (
    <>
      <ReadingProgress />
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 文章头部 */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-playfair mb-6">{post.title}</h1>
            <div className="flex items-center justify-center text-gray-600 mb-8">
              <time dateTime={post.publishedAt?.toISOString()}>
                {post.publishedAt ? formatDate(post.publishedAt) : '未发布'}
              </time>
              {post.categories.length > 0 && (
                <>
                  <span className="mx-2">·</span>
                  <div className="flex gap-2">
                    {post.categories.map(category => (
                      <span key={category.id} className="text-primary">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            {post.coverImage && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            {post.excerpt && (
              <p className="text-xl text-gray-600 italic max-w-2xl mx-auto">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* 文章主体 */}
          <div className="flex gap-8">
            {/* 文章内容 */}
            <div className="flex-1">
              <BlogContent content={post.content} />
            </div>

            {/* 侧边栏 */}
            <aside className="hidden lg:block w-64">
              <TableOfContents />
            </aside>
          </div>

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12">
              {post.tags.map(tag => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 相关文章 */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-playfair mb-8 text-center">相关文章</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <article key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <a href={`/blog/${relatedPost.slug}`} className="block">
                      <div className="relative h-48">
                        {relatedPost.coverImage ? (
                          <Image
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold mb-3 hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        {relatedPost.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        )}
                        <time className="text-xs text-gray-500 mt-4 block">
                          {relatedPost.publishedAt ? formatDate(new Date(relatedPost.publishedAt)) : '未发布'}
                        </time>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  )
} 