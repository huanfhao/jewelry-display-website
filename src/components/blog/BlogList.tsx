import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | null
}

interface BlogListProps {
  posts: BlogPost[]
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="relative h-48 w-full">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
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
              <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              )}
              {post.publishedAt && (
                <time className="text-sm text-gray-500">
                  {formatDate(post.publishedAt)}
                </time>
              )}
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}