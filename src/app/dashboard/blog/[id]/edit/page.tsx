import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import BlogPostForm from '@/components/admin/blog/BlogPostForm'

interface EditBlogPostPageProps {
  params: {
    id: string
  }
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    include: {
      categories: true,
      tags: true,
    },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">编辑文章</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <BlogPostForm
          initialData={{
            id: post.id,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            published: post.published,
            publishedAt: post.publishedAt?.toISOString() || '',
            categories: post.categories.map(c => c.id),
            tags: post.tags.map(t => t.id),
          }}
        />
      </div>
    </div>
  )
} 